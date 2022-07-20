// External modules
import { Component, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-pagination-page",
    template: "<ng-content></ng-content>"
})
export class PaginationPageComponent {

    @HostBinding("class.ngx-pagination-item")
    public defaultClass: boolean = true;

    @HostBinding("class.ngx-pagination-item--page")
    public modifierClass: boolean = true;
}