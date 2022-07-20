// External modules
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

// Components
import { TabsComponent } from './tabs.component';
import { TabsLabelComponent } from "./components/label/label.component";
import { TabsLabelsComponent } from "./components/labels/labels.component";

// Directives
import { TabDirective } from "./directives/tab/tab.directive";
import { TabLabelDirective } from "./directives/label/label.directive";
import { TabContentDirective } from "./directives/content/content.directive";

// Outlets
import { TabContentOutlet } from "./outlets/content/content.outlet";

// List of components
const TABS_COMPONENTS = [
	TabsComponent,
	TabsLabelsComponent,
	TabsLabelComponent,
];

// List of directives
const TABS_DIRECTIVES = [
	TabDirective,
	TabLabelDirective,
	TabContentDirective
];

// List of outlets
const TABS_OUTLETS = [
	TabContentOutlet
];

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		TABS_COMPONENTS,
		TABS_DIRECTIVES,
		TABS_OUTLETS
	],
	exports: [
		TABS_COMPONENTS,
		TABS_DIRECTIVES,
		TABS_OUTLETS
	]
})
export class TabsModule { }
