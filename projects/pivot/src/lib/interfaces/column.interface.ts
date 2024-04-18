// Enums
import { PivotColumnType } from "../enums/column-type.enum";

// Interfaces
import { IPivotFormatFn } from "./format-fn.interface";

/**
 * Pivot column
 * @description Interface for Pivot column
 */
export interface IPivotColumn<TValue = any> {

    /**
     * Type
     * @description Type of pivot column
     */
    type?: PivotColumnType;

    /**
     * Header
     * @description Table header of the column
     */
    header?: string;

    /**
     * Header class
     * @description Custom header class
     */
    headerClass?: string;

    /**
     * Cell class
     * @description Custom cell class
     */
    cellClass?: string;

    /**
     * Key
     * @description Key used to access column value
     */
    key?: string;

    /**
     * Active flag
     * @description Whether column is active
     */
    isActive?: boolean;

    /**
     * Format fn
     * @description Function to format value
     * @param value 
     * @returns 
     */
    formatFn?: IPivotFormatFn<TValue>;
}