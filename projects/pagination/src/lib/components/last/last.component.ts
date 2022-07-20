// External modules
import { Component, EventEmitter, Output, HostListener, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-pagination-last",
    template: "<ng-content></ng-content>"
})
export class PaginationLastComponent {

    @HostListener("click", ["$event"])
    public onLastClick(event: Event) {
        // Emit last click
        this.lastClick.emit(event);
    }

    @HostBinding("class.ngx-pagination-item")
    public defaultClass: boolean = true;

    @HostBinding("class.ngx-pagination-item--last")
    public modifierClass: boolean = true;

    @Output("lastClick")
    public lastClick: EventEmitter<Event> = new EventEmitter();
}