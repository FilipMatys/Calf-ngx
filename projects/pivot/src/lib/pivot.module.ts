// External modules
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// Components
import { PivotComponent } from "./pivot.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PivotComponent],
    exports: [PivotComponent]
})
export class PivotModule { }
