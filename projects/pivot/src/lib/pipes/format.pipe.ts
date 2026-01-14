// External modules
import { Pipe, PipeTransform } from "@angular/core";

// Interfaces
import { IPivotFormatFn } from "../interfaces/format-fn.interface";

@Pipe({
    name: "format",
    standalone: false
})
export class PivotFormatPipe implements PipeTransform {

    /**
     * Format value
     * @param value 
     * @param fn 
     */
    public transform(value: any, fn?: IPivotFormatFn<any>): string | number {
        // Format value if function is present
        return fn ? (fn(value)) : value;
    }
}