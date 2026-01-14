// External modules
import { ChangeDetectionStrategy, Component, ContentChild, HostBinding, Input, TemplateRef, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

// Interfaces
import { IInputGroupConfig } from "./interfaces/config.interface";

// Enums
import { InputGroupMode } from "./enums/mode.enum";

// Directives
import { InputGroupOptionDirective } from "./directives/option.directive";

@Component({
    selector: "ngx-input-group",
    templateUrl: "./input-group.component.html",
    styleUrls: ["./input-group.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputGroupComponent),
            multi: true
        }
    ],
    standalone: false
})
export class InputGroupComponent implements ControlValueAccessor {

	@HostBinding("class.ngx-input-group")
	public isNgxInputGroup: boolean = true;

	// Readonly flag
	@Input("readonly")
	@HostBinding("class.ngx-toggle--readonly")
	public isReadonly: boolean = false;

	// Disabled flag
	@Input("disabled")
	@HostBinding("class.ngx-toggle--disabled")
	public isDisabled: boolean = false;

	@Input("options")
	public options: any[] = [];

	@Input("config")
	public config: IInputGroupConfig<any> = { mode: InputGroupMode.SINGLE, compareFn: (a, b) => a === b, trackOptionByFn: (index) => index };

	@Input("value")
	private _value: any | any[];

	// Value getter
	public get value(): any | any[] { return this._value }

	// Value setter
	public set value(value: any) {
		// Assign value
		this._value = value;

		// Propagate change
		this.propagateChange(this._value);
	}

	// Option template
	@ContentChild(InputGroupOptionDirective, { read: TemplateRef })
	public inputGroupOptionTemplate: TemplateRef<any>;

	/**
	 * Write value
	 * @param value 
	 */
	public writeValue(value: any) {
		// Assign value
		this._value = value;
	}

	/** Propagate change */
	public propagateChange = (_: any) => { };

	/**
	 * Register on change
	 * @param fn 
	 */
	public registerOnChange(fn) {
		this.propagateChange = fn;
	}

	/** Register on touched */
	public registerOnTouched() { }

	/**
	 * On option click
	 * @param event 
	 * @param option 
	 * @param index 
	 */
	public onOptionClick(event: Event, option: any, index: number): void {
		// Prevent event propagation
		event.stopPropagation();

		// Select option
		this.selectOption(option, index);
	}

	/**
	 * Select option
	 * @param option 
	 * @param index 
	 */
	private async selectOption(option: any, index: number): Promise<void> {
		// Check mode
		switch (this.config.mode) {
			// Single
			case InputGroupMode.SINGLE:
				// Assign option
				this.value = option;
				break;

			// Multi
			case InputGroupMode.MULTI:
				// Check if value is empty
				if (!(this._value || []).length) {
					// Set value with the one option
					this.value = [option];

					// Nothing else to do
					break;
				}

				// Copy value
				const value: any[] = this._value.slice();
				let vIndex = -1;

				// Try to find the option in value
				if (!(value.some((item, idx) => {
					// Check whether they are the same
					const found = this.config.compareFn(item, option);

					// Set index if was found
					found && (vIndex = idx);

					// Return found flag
					return found;
				}))) {
					// Add option
					value.push(option);
				}
				else {
					// Remove option from value
					value.splice(vIndex, 1);
				}

				// Update value
				this.value = value;
				break;
		}
	}
}
