// External modules
import { Component, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-pagination-summary",
    template: "<ng-content></ng-content>"
})
export class PaginationSummaryComponent {

    @HostBinding("class.ngx-pagination-summary")
    public defaultClass: boolean = true;
}