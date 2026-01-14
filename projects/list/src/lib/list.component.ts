// External modules
import { Component } from '@angular/core';

@Component({
    selector: 'ngx-list',
    template: `<ng-content></ng-content>`,
    styleUrls: ["./list.component.scss"],
    standalone: false
})
export class ListComponent {}
