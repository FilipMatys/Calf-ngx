// External modules
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

// Directives
import { InputGroupOptionDirective } from "./directives/option.directive";

// Components
import { InputGroupComponent } from "./input-group.component";

@NgModule({
	imports: [CommonModule, FormsModule],
	declarations: [
		InputGroupComponent,
		InputGroupOptionDirective
	],
	exports: [
		InputGroupComponent,
		InputGroupOptionDirective
	]
})
export class InputGroupModule { }
