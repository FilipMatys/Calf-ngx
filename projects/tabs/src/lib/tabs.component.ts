// External modules
import { Component, ContentChildren, QueryList, AfterContentInit, OnDestroy, Input, HostBinding, EventEmitter, Output } from "@angular/core";
import { Subscription } from "rxjs";

// Directives
import { TabDirective } from "./directives/tab/tab.directive";

// Interfaces
import { IActiveTabChangeEvent } from "./interfaces/active-tab-change-event.interface";

// Outlets
import { TabContentOutlet } from "./outlets/content/content.outlet";

@Component({
	selector: "ngx-tabs",
	templateUrl: "./tabs.component.html",
	standalone: false
})
export class TabsComponent implements AfterContentInit, OnDestroy {

	@HostBinding("class.ngx-tabs")
	public ngxTabs: boolean = true;

	@Output("tabChange")
	public activeTabChange: EventEmitter<IActiveTabChangeEvent> = new EventEmitter<IActiveTabChangeEvent>();

	@Input("tabs")
	public set tabIdentifiers(tabs: string[]) {
		// Set tabs
		this._tabIdentifiers = tabs;

		// Rebuild
		this.rebuild();
	}

	// Tab identifiers
	private _tabIdentifiers!: string[];

	// Tab definitions changes subscription
	private tabDefinitionsChangesSubscription!: Subscription;

	// Active index
	@Input("index")
	public set activeIndex(index: number) {
		// Check if index changed
		if (this._activeIndex === index) {
			// There is nothing to be done
			return;
		}

		// Check for tabs
		if (!(this.tabs || []).length) {
			// Set active index
			this._activeIndex = index;

			// Do nothing else
			return;
		}

		// Check if index is valid
		if (index < 0 || index >= this.tabs.length) {
			// Do nothing
			return;
		}

		// Activate tab
		this.activateTab(this.tabs[index], index);
	}

	@Output("indexChange")
	public activeIndexChange: EventEmitter<number> = new EventEmitter<number>();

	/**
	 * Active index getter
	 */
	public get activeIndex(): number {
		return this._activeIndex;
	}

	// Active index
	private _activeIndex: number = 0;

	// Content outlet
	@Input("outlet")
	public contentOutlet!: TabContentOutlet;

	// List of tab definitions
	@ContentChildren(TabDirective)
	public tabDefinitions!: QueryList<TabDirective>;

	// List of tabs
	public tabs: TabDirective[] = [];

	/**
	 * After content init hook
	 */
	public ngAfterContentInit() {
		// Rebuild
		this.rebuild();

		// Rebuild whenever the projected tabs change
		this.tabDefinitionsChangesSubscription = this.tabDefinitions.changes.subscribe(() => this.rebuild());
	}

	/**
	 * On destroy hook
	 */
	public ngOnDestroy(): void {
		// Clean up subscription
		this.tabDefinitionsChangesSubscription && this.tabDefinitionsChangesSubscription.unsubscribe();
	}

	/**
	 * On tab click
	 * @param event 
	 * @param tab 
	 * @param index 
	 */
	public onTabClick(event: Event, tab: TabDirective, index: number) {
		// Prevent event propagation
		event.stopPropagation();

		// Activate tab
		this.activateTab(tab, index, true);
	}

	/**
	 * Activate tab
	 * @param tab 
	 * @param index 
	 */
	private activateTab(tab: TabDirective, index: number, emitIndexChange: boolean = false): boolean {
		// Check if tab is valid
		if (!tab) {
			// Do nothing
			return false;
		}

		// Check if tab is disabled
		if (tab.isDisabled) {
			// Do nothing
			return false;
		}

		// Check if selected index is the same 
		if (this._activeIndex === index) {
			// Do nothing
			return false;
		}

		// Check if index is valid
		if (index < 0) {
			// Do nothing
			return false;
		}

		// Keep from index
		const fromIndex = this._activeIndex;

		// Set active index
		this._activeIndex = index;

		// Check if outlet is set
		if (!this.contentOutlet) {
			// Emit change without updating the outlet
			this.activeTabChange.emit({
				fromIndex: fromIndex,
				fromTab: this.tabDefinitions.find((_, tIndex) => tIndex === fromIndex),
				toIndex: index,
				toTab: tab
			});

			// Emit index change if requested
			emitIndexChange && this.activeIndexChange.next(index);

			// Nothing else to do
			return true;
		}

		// Get content view ref
		const cVRef = this.contentOutlet.viewContainerRef;

		// Clear
		cVRef.clear();

		// Create view for given tab if content is set
		tab.content && cVRef.createEmbeddedView(tab.content);

		// Emit change
		this.activeTabChange.emit({
			fromIndex: fromIndex,
			fromTab: this.tabDefinitions.find((_, tIndex) => tIndex === fromIndex),
			toIndex: index,
			toTab: tab
		});

		// Emit index change if requested
		emitIndexChange && this.activeIndexChange.next(index);

		return true;
	}

	/**
	 * Rebuild tabs
	 */
	private rebuild() {
		// Check if tabs are defined
		if (!this.tabDefinitions) {
			return;
		}

		// Get tab definitions
		const tabDefinitions = this.tabDefinitions.toArray();

		// Reset tabs
		this.tabs = [];

		// Check if tab identifiers are set
		if (this._tabIdentifiers) {
			// Add tab definitions based on identifiers
			this.tabs = this._tabIdentifiers
				.map((identifier) => tabDefinitions.find(td => td.name === identifier))
				.filter((tab): tab is TabDirective => !!tab);
		}
		else {
			// Assign tab definitions
			this.tabs = tabDefinitions;
		}

		// Normalize active index
		if (this.tabs.length && (this._activeIndex < 0 || this._activeIndex >= this.tabs.length)) {
			this._activeIndex = 0;
		}

		// Check if outlet is set
		if (!this.contentOutlet) {
			// Nothing to do
			return;
		}

		// Get content view ref
		const cVRef = this.contentOutlet.viewContainerRef;

		// Create view
		cVRef.clear();

		// Check length of tabs
		if (!this.tabs.length) {
			return;
		}

		// Get tab content
		const activeTab = this.tabs[this._activeIndex];
		const content = activeTab && activeTab.content;

		// Create view
		content && cVRef.createEmbeddedView(content);
	}
}
