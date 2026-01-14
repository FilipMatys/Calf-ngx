// External modules
import { Component, EventEmitter, Output, HostListener, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-pagination-first",
    template: "<ng-content></ng-content>",
    standalone: false
})
export class PaginationFirstComponent {

    @HostListener("click", ["$event"])
    public onFirstClick(event: Event) {
        // Emit first click
        this.firstClick.emit(event);
    }

    @HostBinding("class.ngx-pagination-item")
    public defaultClass: boolean = true;

    @HostBinding("class.ngx-pagination-item--first")
    public modifierClass: boolean = true;

    @Output("firstClick")
    public firstClick: EventEmitter<Event> = new EventEmitter();
}