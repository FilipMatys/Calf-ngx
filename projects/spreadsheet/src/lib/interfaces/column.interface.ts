// Interfaces
import { ISpreadsheetStyle } from "./style.interface";

/**
 * Spreadsheet column
 * @description Interface for spreadsheet
 * column
 */
export interface ISpreadsheetColumn {
    label?: string;
    identifier?: string;
    isReadonly?: boolean;
    isDisabled?: boolean;
    style?: ISpreadsheetStyle;
}