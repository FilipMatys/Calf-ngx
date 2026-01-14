// External modules
import { Component, Input, QueryList, ContentChildren, AfterContentChecked, EventEmitter, Output, HostBinding, Injector, TemplateRef, ContentChild, OnInit, NgZone, OnDestroy, Renderer2, DoCheck, IterableDiffers, IterableDiffer, ElementRef, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { asapScheduler, fromEvent, Subscription } from "rxjs";
import { auditTime, startWith } from "rxjs/operators";

// Data
import { TableSortDirection } from "./enums/sort-direction.enum";
import { IRowClickEvent } from "./interfaces/row-click-event.interface";
import { ITableConfig } from "./interfaces/config.interface";
import { ITableSortColumn } from "./interfaces/sort-column.interface";

// Tokens
import { CONFIG } from "./symbols/config.token";

// Default values
import { tableConfigDefault } from "./defaults/config.default";
import { tableSortDefault } from "./defaults/sort.default";

// Directives
import { TableColumnDefinitionDirective } from "./directives/column/column-definition.directive";
import { TableExpansionDefinitionDirective } from "./directives/expansion/expansion-definition.directive";
import { TableEmptyDefinitionDirective } from "./directives/empty/empty-definition.directive";

// Components
import { TableHeaderComponent } from "./components/header/header.component";

@Component({
	selector: "ngx-table",
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.scss"],
	standalone: false,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements AfterContentChecked, OnInit, OnDestroy, DoCheck {

	// List of columns
	@Input("columns")
	public set columns(value: string[]) {
		// Assign value
		this._columns = value;

		// Build table
		this.build();
	}

	@Input("scrollContainer")
	public set scrollContainer(container: HTMLElement) {
		// Assign scroll container
		this._scrollContainer = container;

		// Make sure to unsubscribe scroll container subscription
		this._scrollContainerScrolledSubscription && this._scrollContainerScrolledSubscription.unsubscribe();

		// Check for container
		if (!container) {
			// Do nothing
			return;
		}

		// Run outside of angular zone
		this.ngZone.runOutsideAngular(() => {
			// Set to be position relative
			this.renderer.setStyle(this._scrollContainer, "position", "relative");

			// Subscribe to scroll event with optimized throttling
			this._scrollContainerScrolledSubscription = fromEvent(this._scrollContainer, "scroll")
				.pipe(
					startWith(null!),
					auditTime(16, asapScheduler) // ~60fps for smoother performance
				)
				.subscribe((event) => this.handleScrollContainerScroll(event));
		});
	};

	@Input("scrollSpacer")
	public set scrollSpacer(spacer: HTMLElement) {
		// Assign spacer
		this._scrollSpacer = spacer;

		// Check for spacer
		if (!spacer) {
			// Do nothing
			return;
		}

		// Run outside angular zone
		this.ngZone.runOutsideAngular(() => {
			// Set styles for spacer
			this.renderer.setStyle(this._scrollSpacer, "position", "absolute");
			this.renderer.setStyle(this._scrollSpacer, "width", "1px");
			this.renderer.setStyle(this._scrollSpacer, "top", 0);
			this.renderer.setStyle(this._scrollSpacer, "left", 0);
		});
	}

	/**
	 * Has footer definition flag
	 * @description Whether table has at least one footer definition
	 */
	public get hasFooterDefinition(): boolean {
		// Check if there is at least one footer definition within a column
		return (this.outputColumnDefinitions || []).some((def) => !!def.footer);
	}

	// List of columns
	private _columns: string[] = [];

	// Scroll container
	private _scrollContainer: HTMLElement;

	// Scroll spacer
	private _scrollSpacer: HTMLElement;

	// Scroll container scrolled subscription
	private _scrollContainerScrolledSubscription: Subscription;

	// Virtual scrolling optimization properties
	private _rafId: number | null = null;
	private _cachedMeasurements: {
		headHeight?: number;
		footHeight?: number;
		containerHeight?: number;
		lastMeasureTime?: number;
	} = {};

	// Iterable differ
	private _iterableDiffer: IterableDiffer<any>;

	// Click timer
	private clickTimer: any;

	// Total height
	public totalHeight: number = 0;
	public startNode: number = 0;
	public offsetY: number = 0;
	public visibleNodesCount: number = 0;

	// Data
	@Input("data")
	public data: any[] = [];

	// List of items
	private _items: any[] = [];

	// Items getter
	public get items(): any[] {
		// Return items
		return this._items;
	}

	@Input("sort")
	public set sort(value: any[]) {
		// Check if config is available
		if (!this._config || !this._config.sort) {
			// Store value for later processing
			setTimeout(() => {
				if (this._config && this._config.sort) {
					this._sort = this._config.sort.mapSetFn(value);
					this.updateHeaders();
					this.changeDetectorRef.markForCheck();
				}
			}, 0);
			return;
		}

		// Assign value
		this._sort = this.config.sort.mapSetFn(value);

		// Update headers
		this.updateHeaders();

		// Trigger change detection
		this.changeDetectorRef.markForCheck();
	}

	// List of sort columns
	private _sort: ITableSortColumn[] = [];

	// Table config setter
	@Input("config")
	public set config(value: ITableConfig<any>) {
		// First make sure config is set
		let config = Object.assign({}, tableConfigDefault, value);

		try {
			// Get global config
			const global = this.injector.get(CONFIG);

			// First make sure sort is set
			config.sort = Object.assign({}, tableSortDefault, global.sort || {}, config.sort || {});

			// Now make sure the whole config has all the default values
			config = Object.assign({}, tableConfigDefault, global || {}, config);
		}
		catch (_) { }
		finally {
			// Finally assign config
			this._config = config;

			// Trigger change detection when config changes
			this.changeDetectorRef.markForCheck();
		}
	};

	// Table config getter
	public get config(): ITableConfig<any> {
		return this._config;
	}

	// Table config
	private _config: ITableConfig<any> = tableConfigDefault;

	// Row click
	@Output("rowClick")
	public rowClick: EventEmitter<IRowClickEvent<any>> = new EventEmitter<IRowClickEvent<any>>();

	// Row double click
	@Output("rowDblClick")
	public rowDoubleClick: EventEmitter<IRowClickEvent<any>> = new EventEmitter<IRowClickEvent<any>>();

	// Sort change
	@Output("sortChange")
	public sortChange: EventEmitter<any> = new EventEmitter<any>();

	// Clickable class binding
	@HostBinding("class.ngx-table--clickable")
	public get isClickable(): boolean { return this._config.allowRowClick; }

	// Double clickable class binding
	@HostBinding("class.ngx-table--dbl-clickable")
	public get isDblClickable(): boolean { return this._config.allowRowDoubleClick; }

	// Head element ref
	@ViewChild("head", { read: ElementRef, static: true })
	public headElementRef: ElementRef<HTMLElement>;

	// Foot element ref
	@ViewChild("foot", { read: ElementRef, static: false })
	public footElementRef: ElementRef<HTMLElement>;

	// List of column definitions
	@ContentChildren(TableColumnDefinitionDirective)
	public columnDefinitions: QueryList<TableColumnDefinitionDirective>;

	// Expansion definition
	@ContentChild(TableExpansionDefinitionDirective, { read: TemplateRef })
	public expansionDefinition: TemplateRef<TableExpansionDefinitionDirective>;

	// Empty definition
	@ContentChild(TableEmptyDefinitionDirective, { read: TemplateRef })
	public emptyDefinition: TemplateRef<TableEmptyDefinitionDirective>

	// List of output column definitions
	// This is created from definitions based on columns array
	public outputColumnDefinitions: TableColumnDefinitionDirective[] = [];

	// List of headers
	public headers: TableHeaderComponent[] = [];

	/**
	 * Constructor
	 * @param ngZone 
	 * @param renderer 
	 * @param injector 
	 * @param elementRef 
	 * @param iterableDiffers 
	 * @param changeDetectorRef
	 */
	constructor(
		private readonly ngZone: NgZone,
		private readonly renderer: Renderer2,
		private readonly injector: Injector,
		private readonly elementRef: ElementRef<HTMLElement>,
		private readonly iterableDiffers: IterableDiffers,
		private readonly changeDetectorRef: ChangeDetectorRef
	) {
		// Init iterable differ
		this._iterableDiffer = this.iterableDiffers.find([]).create(null);
	}

	/**
	 * Optimized trackBy function for items
	 * @param index 
	 * @param item 
	 */
	public trackByItem = (index: number, item: any): any => {
		// Use custom trackBy function if provided, otherwise use index + startNode
		return this.config.trackRecordBy ?
			this.config.trackRecordBy(index + this.startNode, item) :
			index + this.startNode;
	}

	/**
	 * Optimized trackBy function for column definitions
	 * @param index 
	 * @param colDef 
	 */
	public trackByColumn = (index: number, colDef: TableColumnDefinitionDirective): any => {
		return colDef.identifier || index;
	}

	/**
	 * On init hook
	 */
	public ngOnInit(): void {
		// Check for config
		if (this._config) {
			// Nothing to do
			return;
		}

		// Process global configuration
		try {
			// Get global config
			const global = this.injector.get(CONFIG);

			// Init global config
			const config = Object.assign({}, tableConfigDefault, global || {});
			// Also make sure sort is set
			config.sort = Object.assign({}, tableSortDefault, config.sort || {});

			// Assign config
			this._config = config;
		}
		catch (e) { }
	}

	/**
	 * Do check hook
	 */
	public ngDoCheck(): void {
		// Check if data changed
		const dataChanges = this._iterableDiffer.diff(this.data);
		if (dataChanges) {
			// Check for virtual scroll config
			if (!this._config.virtualScroll || !this._config.virtualScroll.allow) {
				// Assign data only if it actually changed
				if (this._items !== this.data) {
					this._items = this.data;
					this.changeDetectorRef.markForCheck();
				}
			}
			else {
				// Emit scroll handler
				this.handleScrollContainerScroll(null, true);
			}
		}
	}

	/**
	 * On destroy hook
	 */
	public ngOnDestroy(): void {
		// Cancel any pending RAF
		if (this._rafId !== null) {
			cancelAnimationFrame(this._rafId);
			this._rafId = null;
		}

		// Unsubscribe from subscriptions
		this._scrollContainerScrolledSubscription && this._scrollContainerScrolledSubscription.unsubscribe();
	}

	/**
	 * On changes hook
	 */
	public ngAfterContentChecked() {
		// Build
		this.build();
	}

	/**
	 * Register header
	 * @param header 
	 */
	public registerHeader(header: TableHeaderComponent) {
		// Add header to list
		this.headers.push(header);

		// Update header
		this.updateHeader(header);
	}

	/**
	 * Unregister header 
	 */
	public unregisterHeader(header: TableHeaderComponent) {
		// Get index
		let idx = this.headers.indexOf(header);

		// Check if header was found
		if (idx !== -1) {
			this.headers.splice(idx, 1);
		}
	}

	/**
	 * On header click
	 * @param event
	 * @param header 
	 */
	public onHeaderClick(event: Event, header: TableHeaderComponent) {
		// Check if table is sortable
		if (header.isSortable && this.config && (this.config.sort || {}).allow) {
			// Call sort change hook
			this.onSortChange(event, header);
		}
	}

	/**
	 * On row click
	 * @param event 
	 * @param item 
	 * @param index 
	 */
	public onRowClick(event: Event, item: any, index: number): void {
		// Check if click events are allowed
		if (!this._config.allowRowClick) {
			// Do not emit row click event
			return;
		}

		// Check for double click
		if (!this._config.allowRowDoubleClick) {
			// Emit row click event and do nothing else
			return this.rowClick.emit({ item, index, event: event as MouseEvent });
		}

		// Set new timer to emit the click
		this.clickTimer = setTimeout(() => {
			// Check if click timer is set
			if (!this.clickTimer) return;

			// Emit row click
			this.rowClick.emit({ item, index, event: event as MouseEvent });
		}, this._config.doubleClickSafetyTimeout);
	}

	/**
	 * On row double click
	 * @param event 
	 * @param item 
	 * @param index 
	 */
	public onRowDoubleClick(event: Event, item: any, index: number): void {
		// Check if double click events are allowed
		if (!this._config.allowRowDoubleClick) {
			// Do not emit row double click event
			return;
		}

		// Clear timer if set
		this.clickTimer && clearTimeout(this.clickTimer);
		this.clickTimer = undefined;

		// Emit row double click event
		this.rowDoubleClick.emit({ item, index, event: event as MouseEvent });
	}

	/**
	 * On sort change
	 * @param event
	 * @param header 
	 */
	private onSortChange(event: Event, header: TableHeaderComponent) {
		// Check for index
		if (!header.column) {
			return;
		}

		// Get identifier
		const identifier = header.column.identifier;

		// Check for multi
		if (!this.config.sort.multi || !(event as any).ctrlKey) {
			// Preserve direction
			let oldDirection = header.sortDirection;

			// Reset all headers
			this.headers.forEach(h => h.sortDirection = TableSortDirection.NONE);

			// Set new direction for header
			header.sortDirection = this.getSortTransition(oldDirection);

			// Reset sort
			this._sort = [{ column: identifier, direction: header.sortDirection }];
		}
		else {
			// Set new direction for header
			header.sortDirection = this.getSortTransition(header.sortDirection);

			// Make sure sort is set
			this._sort = this._sort || [];

			// Check if sort contains given column, if so, we need to remove it, because
			// the column has to be at the end of the list
			let cIndex = this._sort.map(s => s.column).indexOf(identifier);

			// Check if columns was found
			if (cIndex !== -1) {
				this._sort.splice(cIndex, 1);
			}

			// Add column
			this._sort.push({ column: identifier, direction: header.sortDirection });
		}

		// Emit sort change
		this.sortChange.emit(this.config.sort.mapGetFn(this._sort));
	}

	/**
	 * Handle scroll container scroll - Optimized version
	 * @param event
	 * @param dataChanged 
	 */
	private async handleScrollContainerScroll(event: Event | null, dataChanged: boolean = false): Promise<void> {
		// Make sure virtual scroll is allowed
		if (!this._config.virtualScroll || !this._config.virtualScroll.allow) {
			return;
		}

		// Cancel previous RAF if pending
		if (this._rafId !== null) {
			cancelAnimationFrame(this._rafId);
		}

		// Batch updates using requestAnimationFrame for smooth performance
		this._rafId = requestAnimationFrame(() => {
			this._rafId = null;
			this.performVirtualScrollUpdate(dataChanged);
		});
	}

	/**
	 * Perform the actual virtual scroll update with optimizations
	 * @param dataChanged 
	 */
	private performVirtualScrollUpdate(dataChanged: boolean): void {
		const config = this._config.virtualScroll!;
		const now = performance.now();

		// Cache measurements for better performance
		const measurements = this.getMeasurements(now);
		const scrollPosition = this._scrollContainer.scrollTop;
		const scrollHeight = this._scrollContainer.offsetHeight;

		// Calculate virtual scrolling parameters
		const dataLength = (this.data || []).length;
		const totalHeight = dataLength * config.rowHeight + measurements.headHeight + measurements.footHeight;
		const nodePadding = config.paddingRowsCount || 0;
		const startNode = Math.max(0, Math.floor(scrollPosition / config.rowHeight) - nodePadding);
		const visibleNodesCount = Math.min(
			Math.ceil(scrollHeight / config.rowHeight) + 2 * nodePadding,
			dataLength - startNode
		);
		const offsetY = startNode * config.rowHeight;

		// Track what changed to minimize updates
		const changes = {
			totalHeight: this.totalHeight !== totalHeight,
			startNode: this.startNode !== startNode,
			visibleCount: this.visibleNodesCount !== visibleNodesCount,
			offset: this.offsetY !== offsetY
		};

		// Update internal state
		this.totalHeight = totalHeight;
		this.startNode = startNode;
		this.visibleNodesCount = visibleNodesCount;
		this.offsetY = offsetY;

		// Batch DOM updates for better performance
		this.batchDomUpdates(changes, measurements, scrollPosition, scrollHeight, visibleNodesCount, startNode);

		// Update data slice if needed
		if (changes.startNode || changes.visibleCount || dataChanged) {
			this.updateDataSlice(startNode, visibleNodesCount);
		}
	}

	/**
	 * Get cached measurements with invalidation
	 * @param currentTime 
	 */
	private getMeasurements(currentTime: number) {
		// Invalidate cache every 1000ms or on first call
		const shouldMeasure = !this._cachedMeasurements.lastMeasureTime ||
			(currentTime - this._cachedMeasurements.lastMeasureTime) > 1000;

		if (shouldMeasure) {
			this._cachedMeasurements = {
				headHeight: this.headElementRef?.nativeElement.clientHeight || 0,
				footHeight: this.footElementRef?.nativeElement.clientHeight || 0,
				containerHeight: this._scrollContainer.offsetHeight,
				lastMeasureTime: currentTime
			};
		}

		return this._cachedMeasurements;
	}

	/**
	 * Batch DOM updates to minimize reflows
	 * @param changes 
	 * @param measurements 
	 * @param scrollPosition 
	 * @param scrollHeight 
	 * @param visibleNodesCount 
	 * @param startNode 
	 */
	private batchDomUpdates(
		changes: any,
		measurements: any,
		scrollPosition: number,
		scrollHeight: number,
		visibleNodesCount: number,
		startNode: number
	): void {
		const config = this._config.virtualScroll!;
		const updates: (() => void)[] = [];

		// Spacer height update
		if (changes.totalHeight) {
			updates.push(() => {
				this.renderer.setStyle(this._scrollSpacer, "height", `${this.totalHeight}px`);
			});
		}

		// Main container transform
		if (changes.offset) {
			updates.push(() => {
				this.renderer.setStyle(
					this.elementRef.nativeElement,
					"transform",
					`translate3d(0, ${this.offsetY}px, 0)`
				);
			});
		}

		// Sticky header
		if (config.stickyHead && this.headElementRef) {
			const headOffsetY = Math.max(scrollPosition - this.offsetY, 0);
			updates.push(() => {
				this.renderer.setStyle(
					this.headElementRef.nativeElement,
					"transform",
					`translate3d(0, ${headOffsetY}px, 0)`
				);
			});
		}

		// Sticky footer
		if (config.stickyFoot && this.footElementRef) {
			const renderedCount = Math.min(visibleNodesCount, (this.data || []).length - startNode);
			const footOffsetY = Math.max(
				0,
				(scrollPosition + scrollHeight) -
				(this.offsetY + measurements.headHeight + measurements.footHeight + renderedCount * config.rowHeight)
			);
			updates.push(() => {
				this.renderer.setStyle(
					this.footElementRef.nativeElement,
					"transform",
					`translate3d(0, ${footOffsetY}px, 0)`
				);
			});
		}

		// Execute all DOM updates in a batch
		if (updates.length > 0) {
			updates.forEach(update => update());
		}
	}

	/**
	 * Update the data slice for virtual scrolling
	 * @param startNode 
	 * @param visibleNodesCount 
	 */
	private updateDataSlice(startNode: number, visibleNodesCount: number): void {
		// Only run inside Angular zone when we need to update the data
		this.ngZone.run(() => {
			// Calculate end index more precisely
			const endIndex = Math.min(startNode + visibleNodesCount, (this.data || []).length);
			const newItems = (this.data || []).slice(startNode, endIndex);

			// Only update if the slice actually changed
			if (!this.arraysEqual(this._items, newItems)) {
				this._items = newItems;
				this.changeDetectorRef.markForCheck();
			}
		});
	}

	/**
	 * Get sort transition
	 * @param direction 
	 */
	private getSortTransition(direction: number): number {
		switch (direction) {
			// NONE
			case TableSortDirection.NONE:
				return TableSortDirection.ASCENDING;
			// ASCENDING
			case TableSortDirection.ASCENDING:
				return TableSortDirection.DESCENDING;
			// DESCENDING
			case TableSortDirection.DESCENDING:
			default:
				return TableSortDirection.ASCENDING;
		}
	}

	/**
	 * Update headers
	 */
	private updateHeaders() {
		this.headers.forEach(h => this.updateHeader(h));
	}

	/**
	 * Update header
	 * @param header 
	 */
	private updateHeader(header: TableHeaderComponent) {
		// Check sorting
		if (!this.config || !this.config.sort || !this.config.sort.allow) {
			return header.sortDirection = TableSortDirection.NONE;
		}

		// Get header index
		let idx = this.headers.indexOf(header);

		// Check index
		if (idx === -1) {
			return;
		}

		// Get identifier
		let identifier = this.outputColumnDefinitions[idx].identifier;

		// Find given column
		if (!(this._sort || []).some((c) => {
			// Check if identifier matches
			if (c.column !== identifier) {
				return false;
			}

			// Set proper direction
			header.sortDirection = c.direction;
			return true;
		})) {
			// Set sort direction to none
			header.sortDirection = TableSortDirection.NONE;
		}
	}

	/**
	 * Build table
	 */
	private build() {
		// Check if there are any column definitions
		if (!this.columnDefinitions) {
			// Reset output only if changed
			if (this.outputColumnDefinitions.length > 0) {
				this.outputColumnDefinitions = [];
				this.changeDetectorRef.markForCheck();
			}
			return;
		}

		// Check columns length
		if (!this._columns || !this._columns.length) {
			// Get new column definitions
			const newOutput = this.columnDefinitions.toArray();

			// Only update if changed
			if (!this.arraysEqual(this.outputColumnDefinitions, newOutput)) {
				this.outputColumnDefinitions = newOutput;
				this.changeDetectorRef.markForCheck();
			}
			return;
		}

		// Init list
		const output: TableColumnDefinitionDirective[] = [];

		// Iterate columns
		this._columns.forEach((column) => {
			// Get definition
			const def = this.columnDefinitions.find(t => t.identifier === column);

			// Check if def is set
			if (def) {
				output.push(def);
			}
		});

		// Only assign output if it changed
		if (!this.arraysEqual(this.outputColumnDefinitions, output)) {
			this.outputColumnDefinitions = output;
			this.changeDetectorRef.markForCheck();
		}
	}

	/**
	 * Check if two arrays are equal (works for both column definitions and items)
	 * @param arr1 
	 * @param arr2 
	 */
	private arraysEqual(arr1: any[], arr2: any[]): boolean {
		if (!arr1 || !arr2) {
			return arr1 === arr2;
		}

		if (arr1.length !== arr2.length) {
			return false;
		}

		return arr1.every((item, index) => item === arr2[index]);
	}
}
