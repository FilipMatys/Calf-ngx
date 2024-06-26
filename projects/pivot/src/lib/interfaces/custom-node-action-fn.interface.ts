// Interfaces
import { IPivotNode } from "./node.interface";

/**
 * Custom node handler fn
 * @description Interface for Custom node handler function
 */
export interface ICustomNodeActionFn<TData> {
    (node: IPivotNode<TData>): void | Promise<void>;
}