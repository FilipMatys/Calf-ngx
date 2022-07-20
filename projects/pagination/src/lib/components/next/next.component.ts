// External components
import { Component, HostListener, EventEmitter, Output, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-pagination-next",
    template: "<ng-content></ng-content>"
})
export class PaginationNextComponent {

    // Click event listener
    @HostListener("click", ["$event"])
    public onNextClick(event: Event) {
        // Propagate event
        this.nextClick.emit(event);
    }

    @HostBinding("class.ngx-pagination-item")
    public defaultClass: boolean = true;

    @HostBinding("class.ngx-pagination-item--next")
    public modifierClass: boolean = true;

    @Output("nextClick")
    public nextClick: EventEmitter<Event> = new EventEmitter<Event>();
}