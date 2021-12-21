// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

// Module
import { TabsModule } from "tabs";

// Pages
import { TabsPage } from "./tabs.page";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        TabsModule,
        RouterModule.forChild([
            {
                path: "",
                component: TabsPage
            }
        ])
    ],
    declarations: [TabsPage]
})
export class TabsPageModule { }