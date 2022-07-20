/**
 * Menu context
 * @description Interface for menu context
 */
export interface IMenuContext<TImplicit = any> {
    // Implicit value
    $implicit: TImplicit;

    // Custom values
    [key: string]: any;
}