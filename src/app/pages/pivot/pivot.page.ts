// External modules
import { Component, ViewChild } from "@angular/core";
import { IPivotColumns, IPivotConfig, PivotCalculateType, PivotColumnType, PivotComponent } from "pivot";

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

    @ViewChild(PivotComponent)
    public pivot: PivotComponent;

    // Config
    public config: IPivotConfig = { nodesExpandedAsDefault: false };

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
            type: PivotColumnType.String,
            customNodeHandlerFn: (node) => console.log(node.data)
        },
        {
            header: "Price",
            key: "price",
            isActive: true,
            type: PivotColumnType.Number,
            cellClass: "gd-text--alignment-right",
            formatFn: (value) => `${value} USD`,
            footerCalcType: PivotCalculateType.Minimum
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

    public expand() { this.pivot.expandAll(); }

    public collapse() { this.pivot.collapseAll() }
}