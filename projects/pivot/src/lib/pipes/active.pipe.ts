// External modules
import { Pipe, PipeTransform } from "@angular/core";

// Interfaces
import { IPivotColumns } from "../interfaces/columns.interface";

@Pipe({
    name: "active",
    standalone: false
})
export class PivotActivePipe implements PipeTransform {

    /**
     * Transform
     * @param columns 
     */
    public transform(columns: IPivotColumns): IPivotColumns {
        // Return active columns
        return columns.filter((x) => x.isActive);
    }
}