// Directives
import { TabDirective } from "../directives/tab/tab.directive";

/**
 * Tabs change event
 * @description 
 */
export interface IActiveTabChangeEvent {
    fromIndex?: number;
    fromTab?: TabDirective;
    toIndex?: number;
    toTab?: TabDirective;
}