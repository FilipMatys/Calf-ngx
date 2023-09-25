// External modules
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

// Components
import { ToggleComponent } from "./toggle.component";

// Directives
import { ToggleInactiveDirective } from "./directives/inactive.directive";
import { ToggleActiveDirective } from "./directives/active.directive";
import { ToggleIndeterminateDirective } from "./directives/indeterminate.directive";

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		ToggleComponent,
		ToggleInactiveDirective,
		ToggleIndeterminateDirective,
		ToggleActiveDirective
	],
	exports: [
		ToggleComponent,
		ToggleInactiveDirective,
		ToggleIndeterminateDirective,
		ToggleActiveDirective
	]
})
export class ToggleModule { }
