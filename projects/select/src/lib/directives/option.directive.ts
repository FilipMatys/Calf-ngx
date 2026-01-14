// External modules
import { Directive } from "@angular/core";

// Select option context
export interface ISelectOptionContext<T> {
    $implicit: T;
    index?: number;
}

@Directive({
    selector: '[ngxSelectOption]',
    standalone: false
})
export class SelectOptionDirective {}