// External modules
import { Directive, Input, ViewContainerRef } from "@angular/core";

@Directive({
    selector: "[ngxFormMessagesOutlet]",
    standalone: false
})
export class FormMessagesOutletDirective {

    @Input("id")
    public identifier: string;

    /**
     * Constructor
     * @param viewContainerRef 
     */
    constructor(public readonly viewContainerRef: ViewContainerRef) { }
}