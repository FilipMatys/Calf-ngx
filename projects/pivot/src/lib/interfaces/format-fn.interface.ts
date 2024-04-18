/**
 * Pivot format function
 * @description Interface for Pivot format function
 */
export interface IPivotFormatFn<TValue> {
    (value: TValue): string | number
}