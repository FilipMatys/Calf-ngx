// External modules
import { Pipe, PipeTransform } from "@angular/core";

// Interfaces
import { IInputGroupConfig } from "../interfaces/config.interface";

// Enums
import { InputGroupMode } from "../enums/mode.enum";

@Pipe({ name: "selected" })
export class InputGroupSelectedPipe implements PipeTransform {

    /**
     * Transform
     * @param option 
     * @param value 
     * @param config 
     */
    public transform(option: any, value: any, config: IInputGroupConfig<any>): boolean {
        // Check if value is set
        if (typeof value === "undefined" || value === null || (value instanceof Array && !value.length)) return false;

        // Check config mode
        switch (config.mode) {
            // Multi
            case InputGroupMode.MULTI:
                // Check if option is one of selected
                return (value as []).some((item) => config.compareFn(item, option));

            // Single or default
            case InputGroupMode.SINGLE:
            default:
                // Compare option with the value
                return config.compareFn(option, value);
        }
    }
}