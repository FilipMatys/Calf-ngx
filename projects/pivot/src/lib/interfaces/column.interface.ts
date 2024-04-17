// Enums
import { PivotColumnType } from "../enums/column-type.enum";

/**
 * Pivot column
 * @description Interface for Pivot column
 */
export interface IPivotColumn {

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
    formatFn?: (value: any) => string;
}