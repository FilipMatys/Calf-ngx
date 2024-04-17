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
     * Key
     * @description Key used to access column value
     */
    key?: string;

    /**
     * Active flag
     * @description Whether column is active
     */
    isActive?: boolean;
}