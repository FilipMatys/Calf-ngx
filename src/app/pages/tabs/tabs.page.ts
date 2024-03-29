// External modules
import { Component } from "@angular/core";
import { IActiveTabChangeEvent } from "tabs";

@Component({
    selector: "page-tabs",
    templateUrl: "./tabs.page.html",
    styleUrls: ["./tabs.page.scss"]
})
export class TabsPage {

    // Tag visibility toggle
    public isTabVisible: boolean;

    public activeTabIndex: number = 0;

    /**
     * On toggle tab click
     * @param event 
     */
    public onToggleTabClick(event: Event): void {
        // Toggle tab
        this.toggleTab();
    } 

    /**
     * Toggle tab
     */
    private toggleTab(): void {
        // Toggle tab
        this.isTabVisible = !this.isTabVisible;
    }

    public onTabChange(event: IActiveTabChangeEvent): void {
        console.log(event);
    }
}