// External modules
import { Component, Inject, Input, OnInit, OnDestroy, HostListener, HostBinding } from "@angular/core";
import { TableColumnDefinitionDirective } from "../../directives/column/column-definition.directive";

// Data
import { TableSortDirection } from "../../enums/sort-direction.enum";

// Components
import { TableComponent } from "../../table.component";

@Component({
    selector: ".ngx-table-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class TableHeaderComponent implements OnInit, OnDestroy {

    // Is sortable flag
    @Input("sortable")
    @HostBinding("class.ngx-table-header--sortable")
    public isSortable: boolean = false;

    @HostBinding("class.ngx-table-header--ascending")
    public get isAscending(): boolean {
        return this.sortDirection === TableSortDirection.ASCENDING;
    }

    @HostBinding("class.ngx-table-header--descending")
    public get isDescending(): boolean {
        return this.sortDirection === TableSortDirection.DESCENDING;
    }

    // Sort direction
    public sortDirection: number = TableSortDirection.NONE;

    @HostListener("click", ["$event"])
    public onClick(event: Event) {
        // On header click
        this._table.onHeaderClick(event, this);
    }

    /**
     * Column getter
     * @description Get column in which this header is defined
     */
    public get column(): TableColumnDefinitionDirective { return this._column }

    /**
     * Constructor
     * @param _table 
     * @param _column 
     */
    constructor(
        @Inject(TableComponent) private _table: TableComponent,
        @Inject(TableColumnDefinitionDirective) private _column: TableColumnDefinitionDirective
    ) { }

    /**
     * On init hook
     */
    public ngOnInit() {
        this._table.registerHeader(this);
    }

    /**
     * On destroy hook
     */
    public ngOnDestroy() {
        this._table.unregisterHeader(this);
    }
}