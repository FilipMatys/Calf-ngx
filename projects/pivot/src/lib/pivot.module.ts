// External modules
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// Pipes
import { PivotFormatPipe } from "./pipes/format.pipe";

// Components
import { PivotComponent } from "./pivot.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PivotComponent,
        PivotFormatPipe
    ],
    exports: [PivotComponent]
})
export class PivotModule { }
