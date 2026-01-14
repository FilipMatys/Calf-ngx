// External modules
import { Directive, HostBinding } from "@angular/core";

@Directive({
    selector: "[ngxToggleInactive]",
    standalone: false
})
export class ToggleInactiveDirective {

    @HostBinding("class.ngx-toggle-inactive")
    public isNgxToggleInactive: boolean = true;
}