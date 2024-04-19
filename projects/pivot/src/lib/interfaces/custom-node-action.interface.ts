// Interfaces
import { ICustomNodeActionFn } from "./custom-node-action-fn.interface";

/**
 * Custom node action
 * @description Interface for Custom node action
 */
export interface ICustomNodeAction<TData> {

    /**
     * Title
     * @description Custom action title
     */
    title?: string;

    /**
     * Custom class
     * @description Custom action class
     */
    actionClass?: string;

    /**
     * Action fn
     * @description Function to be executed on click
     */
    actionFn?: ICustomNodeActionFn<TData>
}