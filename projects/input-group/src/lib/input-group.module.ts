// External modules
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

// Pipes
import { InputGroupSelectedPipe } from "./pipes/selected.pipe";

// Directives
import { InputGroupOptionDirective } from "./directives/option.directive";

// Components
import { InputGroupComponent } from "./input-group.component";

@NgModule({
	imports: [CommonModule, FormsModule],
	declarations: [
		InputGroupComponent,
		InputGroupSelectedPipe,
		InputGroupOptionDirective
	],
	exports: [
		InputGroupComponent,
		InputGroupOptionDirective
	]
})
export class InputGroupModule { }
