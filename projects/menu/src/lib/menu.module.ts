// External modules
import { NgModule } from "@angular/core";

// Directives
import { MenuDirective } from "./directives/menu.directive";

@NgModule({
	declarations: [MenuDirective],
	exports: [MenuDirective]
})
export class MenuModule { }
