// External modules
import { Component, ElementRef, HostBinding, Input } from "@angular/core";

// Enums
import { SpreadsheetFontWeight } from "../../enums/font-weight.enum";
import { SpreadsheetTextAlign } from "../../enums/text-align.enum";
import { SpreadsheetVerticalAlign } from "../../enums/vertical-align.enum";

// Interfaces
import { ISpreadsheetRow } from "../../interfaces/row.interface";
import { ISpreadsheetColumn } from "../../interfaces/column.interface";
import { ISpreadsheetFormatterFunction } from "../../interfaces/formatter-function.interface";
import { ISpreadsheetStyle } from "../../interfaces/style.interface";

@Component({
    selector: "[ngxSpreadsheetCell]",
    templateUrl: "./cell.component.html",
    styleUrls: ["./cell.component.scss"]
})
export class SpreadsheetCellComponent<TRecord = any> {

    @Input("rowIndex")
    private _rowIndex: number;

    @Input("columnIndex")
    private _columnIndex: number;

    @Input("column")
    private _column: ISpreadsheetColumn;

    @Input("row")
    private _row: ISpreadsheetRow;

    @Input("record")
    private _record: TRecord;

    @HostBinding("class.ngx-spreadsheet-cell--font-weight-normal")
    public get isFontWeightNormal(): boolean {
        return !this.style.fontWeight || this.style.fontWeight === SpreadsheetFontWeight.NORMAL;
    }

    @HostBinding("class.ngx-spreadsheet-cell--font-weight-bold")
    public get isFontWeightBold(): boolean {
        return this.style.fontWeight === SpreadsheetFontWeight.BOLD;
    }

    @HostBinding("class.ngx-spreadsheet-cell--font-weight-bolder")
    public get isFontWeightBolder(): boolean {
        return this.style.fontWeight === SpreadsheetFontWeight.BOLDER;
    }

    @HostBinding("class.ngx-spreadsheet-cell--font-weight-lighter")
    public get isFontWeightLighter(): boolean {
        return this.style.fontWeight === SpreadsheetFontWeight.LIGHTER;
    }

    @HostBinding("class.ngx-spreadsheet-cell--text-align-left")
    public get isTextAlignLeft(): boolean {
        return !this.style.textAlign || this.style.textAlign === SpreadsheetTextAlign.LEFT;
    }

    @HostBinding("class.ngx-spreadsheet-cell--text-align-right")
    public get isTextAlignRight(): boolean {
        return this.style.textAlign === SpreadsheetTextAlign.RIGHT;
    }

    @HostBinding("class.ngx-spreadsheet-cell--text-align-start")
    public get isTextAlignStart(): boolean {
        return this.style.textAlign === SpreadsheetTextAlign.START;
    }

    @HostBinding("class.ngx-spreadsheet-cell--text-align-end")
    public get isTextAlignEnd(): boolean {
        return this.style.textAlign === SpreadsheetTextAlign.END;
    }

    @HostBinding("class.ngx-spreadsheet-cell--text-align-center")
    public get isTextAlignCenter(): boolean {
        return this.style.textAlign === SpreadsheetTextAlign.CENTER;
    }

    @HostBinding("class.ngx-spreadsheet-cell--vertical-align-middle")
    public get isVerticalAlignMiddle(): boolean {
        return !this.style.verticalAlign || this.style.verticalAlign === SpreadsheetVerticalAlign.MIDDLE;
    }

    @HostBinding("class.ngx-spreadsheet-cell--vertical-align-baseline")
    public get isVerticalAlignBaseline(): boolean {
        return this.style.verticalAlign === SpreadsheetVerticalAlign.BASELINE;
    }

    @HostBinding("class.ngx-spreadsheet-cell--vertical-align-bottom")
    public get isVerticalAlignBottom(): boolean {
        return this.style.verticalAlign === SpreadsheetVerticalAlign.BOTTOM;
    }

    @HostBinding("class.ngx-spreadsheet-cell--vertical-align-top")
    public get isVerticalAlignTop(): boolean {
        return this.style.verticalAlign === SpreadsheetVerticalAlign.TOP;
    }

    /**
     * Is disabled
     * @description Disabled flag
     */
    @HostBinding("ngx-spreadsheet-cell--disabled")
    public get isDisabled(): boolean {
        return this._column.isDisabled || this._row.isDisabled;
    }

    /**
     * Is readonly
     * @description Readonly flag
     */
     @HostBinding("ngx-spreadsheet-cell--readonly")
    public get isReadonly(): boolean {
        return this._column.isReadonly || this._row.isReadonly;
    }

    /**
     * Formatter fn
     * @description Formatter function getter
     */
    public get formatterFn(): ISpreadsheetFormatterFunction<any> {
        return this._column.formatterFn;
    }

    /**
     * Style
     * @description Style getter
     */
    private get style(): ISpreadsheetStyle {
        // Get set or default style
        return this._column.style || {
            fontWeight: SpreadsheetFontWeight.NORMAL,
            textAlign: SpreadsheetTextAlign.LEFT,
            verticalAlign: SpreadsheetVerticalAlign.MIDDLE
        };
    }

    /**
     * Value
     * @description Cell value getter
     */
    public get value(): any {
        // Check if record is defined
        if (!this._record) {
            return "";
        }

        // Check if column value is defined
        if (!(this._column.identifier in this._record) && !(this._column.label in this._record)) {
            return "";
        }

        // Try to get value
        const value = this._record[(typeof this._column.identifier === "undefined") ? this._column.label : this._column.identifier];

        // Check for undefined
        if (typeof value === "undefined") {
            return "";
        }

        // Return value
        return value;
    }

    /**
     * Constructor
     * @param elementRef
     */
    constructor(private elementRef: ElementRef) { }

    /**
     * Get native element
     */
    public getNativeElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }
}