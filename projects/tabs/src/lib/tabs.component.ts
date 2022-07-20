// External modules
import { Component, ContentChildren, QueryList, AfterContentInit, Input, ViewChild, HostBinding, EventEmitter, Output } from '@angular/core';

// Directives
import { TabDirective } from "./directives/tab/tab.directive";
import { IActiveTabChangeEvent } from "./interfaces/active-tab-change-event.interface";

// Outlets
import { TabContentOutlet } from "./outlets/content/content.outlet";

@Component({
	selector: 'ngx-tabs',
	templateUrl: "./tabs.component.html"
})
export class TabsComponent implements AfterContentInit {

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
	private _tabIdentifiers: string[];

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
	public contentOutlet: TabContentOutlet;

	// List of tab definitions
	@ContentChildren(TabDirective)
	public tabDefinitions: QueryList<TabDirective>;

	// List of tabs
	public tabs: TabDirective[] = [];

	/**
	 * After content init hook
	 */
	public ngAfterContentInit() {
		//Rebuild
		this.rebuild();
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
		this.activateTab(tab, index);

		// Emit change
		this.activeIndexChange.next(index);
	}

	/**
	 * Activate tab
	 * @param tab 
	 * @param index 
	 */
	private async activateTab(tab: TabDirective, index: number): Promise<void> {
		// Check if tab is disabled
		if (tab.isDisabled) {
			// Do nothing
			return;
		}

		// Check if selected index is the same 
		if (this._activeIndex === index) {
			// Do nothing
			return;
		}

		// Keep from index
		const fromIndex = this._activeIndex;

		// Set active index
		this._activeIndex = index;

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
	}

	/**
	 * Rebuild tabs
	 */
	private rebuild() {
		// Check if tabs are defined
		if (!this.tabDefinitions) {
			return;
		}

		// Reset tabs
		this.tabs = [];

		// Check if tab identifiers are set
		if (this._tabIdentifiers) {
			// Add tab definitions based on identifiers
			this._tabIdentifiers.forEach((identifier) => {
				// Add tab to list
				this.tabs.push(this.tabDefinitions.find(td => td.name === identifier));
			});
		}
		else {
			// Assign tab definitions
			this.tabs = this.tabDefinitions.toArray();
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
		const content = this.tabs[this._activeIndex].content;

		// Create view
		content && cVRef.createEmbeddedView(content);
	}
}
