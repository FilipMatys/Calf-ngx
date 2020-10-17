// External modules
import { Directive, TemplateRef, ViewContainerRef, Input, Renderer2 } from "@angular/core";

// Services
import { CollapsibleService } from "../../collapsible.service";

@Directive({
    selector: "[ngxCollapsibleToggle]"
})
export class ToggleDirective {

    @Input("ngxCollapsibleToggle")
    public identifier: string = "default";

    /**
     * Constructor
     * @param collapsibeService 
     * @param templateRef 
     * @param viewContainerRef 
     * @param renderer
     */
    constructor(
        private collapsibeService: CollapsibleService,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer2
    ) {
        // Create view
        const element = this.viewContainerRef.createEmbeddedView(this.templateRef).rootNodes[0];

        // Listen to click event
        this.renderer.listen(element, "click", (e) => this.onClick(e));
    }

    /**
     * On click
     * @param event 
     */
    private onClick(event: Event) {
        // Emit toggle
        this.collapsibeService.toggle(this.identifier);
    }
}