// External modules
import { Pipe, PipeTransform } from "@angular/core";

// Interfaces
import { PivotCalculateType } from "../enums/calculate-type.enum";

@Pipe({
    name: "calculate",
    standalone: false
})
export class PivotCalculatePipe implements PipeTransform {

    /**
     * Transform
     * @param data 
     * @param key
     * @param type 
     */
    public transform(data: any[], key: string, type: PivotCalculateType): number {
        // Check if any data were passed
        if (!(data || []).length) return 0;

        // Check type
        switch (type) {
            // Average
            case PivotCalculateType.Average:
                // Get sum
                const sum = data.reduce((prev, next) => prev + next[key] || 0, 0);

                // Return average
                return sum / data.length;

            // Maximum
            case PivotCalculateType.Maximum:
                // Get maximum
                return data.reduce((prev, next) => Math.max(prev, next[key] || 0), 0);

            // Minimum
            case PivotCalculateType.Minimum:
                // Get minimum
                return data.reduce((prev, next) => Math.min(prev, next[key] || 0), data[0][key]);

            // Default
            case PivotCalculateType.Sum:
            default:
                // Sum data
                return data.reduce((prev, next) => prev + next[key] || 0, 0);
        }
    }
}