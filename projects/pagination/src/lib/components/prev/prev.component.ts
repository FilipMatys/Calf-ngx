// External modules
import { Component, HostListener, Output, EventEmitter, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-pagination-prev",
    template: "<ng-content></ng-content>",
    standalone: false
})
export class PaginationPrevComponent {

    // Click event listener
    @HostListener("click", ["$event"])
    public onPrevClick(event: Event) {
        // Propagate event
        this.prevClick.emit(event);
    }

    @HostBinding("class.ngx-pagination-item")
    public defaultClass: boolean = true;

    @HostBinding("class.ngx-pagination-item--prev")
    public modifierClass: boolean = true;

    @Output("prevClick")
    public prevClick: EventEmitter<Event> = new EventEmitter<Event>();
}