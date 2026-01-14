// External modules
import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: "[ngxTabContentOutlet]", exportAs: "ngxTabContentOutlet",
    standalone: false
})
export class TabContentOutlet {
    
    /**
     * Constructor
     * @param viewContainerRef 
     */
    constructor(public viewContainerRef: ViewContainerRef) {}
}