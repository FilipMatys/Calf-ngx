// External modules
import { Directive } from "@angular/core";

// Select value context
export interface ISelectValueContext<T> {
    $implicit: T;
}

@Directive({
    selector: '[ngxSelectValue]',
    standalone: false
})
export class SelectValueDirective {}