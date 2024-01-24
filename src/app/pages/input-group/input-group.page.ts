// External modules
import { Component } from "@angular/core";

import { IInputGroupConfig, InputGroupMode } from "input-group";

@Component({
    selector: "page-input-group",
    templateUrl: "./input-group.page.html",
    styleUrls: ["./input-group.page.scss"]
})
export class InputGroupPage {

    public options: string[] = ["Hyundai", "KIA", "Ssangyong"];
    public single: string = this.options[0];
    public multi: string[] = [this.options[0], this.options[1]];

    public singleConfig: IInputGroupConfig<string> = {
        mode: InputGroupMode.SINGLE,
        compareFn: (a, b) => a === b,
        trackOptionByFn: (_, item) => item
    };

    public multiConfig: IInputGroupConfig<string> = {
        mode: InputGroupMode.MULTI,
        compareFn: (a, b) => a === b,
        trackOptionByFn: (_, item) => item
    };
}