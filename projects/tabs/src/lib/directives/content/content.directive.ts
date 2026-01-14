// External modules
import { Directive, Input } from "@angular/core";

@Directive({
    selector: "[ngxTabContent]",
    standalone: false
})
export class TabContentDirective {

    @Input("active")
    public isActive: boolean = false;
}