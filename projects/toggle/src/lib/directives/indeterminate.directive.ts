// External modules
import { Directive, HostBinding } from "@angular/core";

@Directive({ 
    selector: "[ngxToggleIndeterminate]" 
})
export class ToggleIndeterminateDirective {

    @HostBinding("class.ngx-toggle-indeterminate")
    public isNgxToggleIndeterminate: boolean = true;
}