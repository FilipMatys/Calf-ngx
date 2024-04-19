// External modules
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// Pipes
import { PivotFormatPipe } from "./pipes/format.pipe";
import { PivotCalculatePipe } from "./pipes/calculate.pipe";
import { PivotActivePipe } from "./pipes/active.pipe";

// Components
import { PivotComponent } from "./pivot.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PivotComponent,
        PivotFormatPipe,
        PivotActivePipe,
        PivotCalculatePipe
    ],
    exports: [PivotComponent]
})
export class PivotModule { }
