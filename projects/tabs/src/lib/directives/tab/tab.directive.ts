// External modules
import { Directive, Input, ContentChild, TemplateRef } from "@angular/core";

// Directives
import { TabLabelDirective } from "../label/label.directive";
import { TabContentDirective } from "../content/content.directive";

@Directive({
    selector: "[ngxTab]",
    standalone: false
})
export class TabDirective {

    // Tab
    @Input("ngxTab")
    public name: string;

    @Input("disabled")
    public isDisabled: boolean = false;

    @Input("visible")
    public isVisible: boolean = true;

    @ContentChild(TabLabelDirective, { read: TemplateRef })
    public label: TemplateRef<any>;

    @ContentChild(TabContentDirective, { read: TemplateRef })
    public content: TemplateRef<any>;
}