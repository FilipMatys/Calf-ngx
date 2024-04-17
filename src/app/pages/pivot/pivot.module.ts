// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

// Module
import { PivotModule } from "pivot";

// Pages
import { PivotPage } from "./pivot.page";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        PivotModule,
        RouterModule.forChild([
            {
                path: "",
                component: PivotPage
            }
        ])
    ],
    declarations: [PivotPage]
})
export class PivotPageModule { }