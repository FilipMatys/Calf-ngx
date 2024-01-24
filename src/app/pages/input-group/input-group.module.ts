// External modules
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

// Component module
import { InputGroupModule } from "input-group";

// Pages
import { InputGroupPage } from "./input-group.page";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        InputGroupModule,
        RouterModule.forChild([
            {
                path: "",
                component: InputGroupPage
            }
        ])
    ],
    declarations: [InputGroupPage]
})
export class InputGroupPageModule { }