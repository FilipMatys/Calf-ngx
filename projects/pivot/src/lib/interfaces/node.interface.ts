/**
 * Pivot node
 * @description Interface for Pivot node
 */
export interface IPivotNode<TData = any> {

    /**
     * Is expanded
     * @description Whether the node is expanded
     */
    isExpanded?: boolean;

    /**
     * Data
     * @description Data of given node
     */
    data?: TData;

    /**
     * Nodes
     * @description Nested nodes of given node
     */
    nodes?: Array<IPivotNode<TData>>;
}