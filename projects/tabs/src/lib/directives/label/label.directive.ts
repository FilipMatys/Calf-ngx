// External modules
import { Directive, Input } from "@angular/core";

@Directive({
    selector: "[ngxTabLabel]",
    standalone: false
})
export class TabLabelDirective {

    @Input("active")
    public isActive: boolean = false;
}