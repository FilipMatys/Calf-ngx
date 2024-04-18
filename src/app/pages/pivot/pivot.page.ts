// External modules
import { Component } from "@angular/core";
import { IPivotColumns, PivotColumnType } from "pivot";

interface IMotorcycle {
    manufacturer?: string;
    model?: string;
    propulsion?: string;
    price?: number;
    year?: string;
}

@Component({
    selector: "page-pivot",
    templateUrl: "./pivot.page.html",
    styleUrls: ["./pivot.page.scss"]
})
export class PivotPage {


    // Columns
    public columns: IPivotColumns = [
        {
            header: "Year",
            key: "year",
            isActive: true,
            type: PivotColumnType.String
        },
        {
            header: "Manufacturer",
            key: "manufacturer",
            isActive: true,
            type: PivotColumnType.String,
        },
        {
            header: "Model",
            key: "model",
            isActive: true,
            type: PivotColumnType.String
        },
        {
            header: "Propulsion",
            key: "propulsion",
            isActive: true,
            type: PivotColumnType.String
        },
        {
            header: "Price",
            key: "price",
            isActive: true,
            type: PivotColumnType.Number,
            cellClass: "gd-text--alignment-right",
            formatFn: (value) => `${value} USD`
        }
    ];

    public data: IMotorcycle[] = [
        {
            manufacturer: "Zero Motorcycles",
            model: "SR/F",
            year: "2024",
            propulsion: "Electric",
            price: 649000
        },
        {
            manufacturer: "Zero Motorcycles",
            model: "SR/S",
            year: "2024",
            propulsion: "Electric",
            price: 659000
        },
        {
            manufacturer: "Zero Motorcycles",
            model: "DSR/X",
            year: "2023",
            propulsion: "Electric",
            price: 679000
        },
        {
            manufacturer: "Honda",
            model: "CBR650R",
            year: "2024",
            propulsion: "Combustion",
            price: 229000
        },
        {
            manufacturer: "Honda",
            model: "CB650R",
            year: "2024",
            propulsion: "Combustion",
            price: 219000
        }
    ];
}