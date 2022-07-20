// External modules
import { Directive, HostListener, Input, TemplateRef, ViewContainerRef } from "@angular/core";

// Interfaces
import { IMenuContext } from "../interfaces/context.interface";

// Services
import { MenuService } from "../services/menu.service";

@Directive({ selector: "ngxMenu" })
export class MenuDirective {

    @Input("ngxMenu")
    public template: TemplateRef<any>;

    @Input("ngxMenuContext")
    public context: IMenuContext;

    /**
     * On click
     * @param event 
     */
    @HostListener("click", ["$event"])
    public onClick(event: MouseEvent): void {
        // Open menu
        this.service.open(this.viewContainerRef, event, this.template, this.context);
    }

    /**
     * Constructor
     * @param service 
     * @param viewContainerRef 
     */
    constructor(
        private readonly service: MenuService,
        private readonly viewContainerRef: ViewContainerRef
    ) { }
}