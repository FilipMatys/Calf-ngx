// Interfaces
import { IDatepickerFormatters } from "./formatters.interface";

/**
 * Datepicker config interface
 * @description Configuration for datepicker
 */
export interface IDatepickerConfig {
    /**
     * Formatters
     * @description Functions to format date
     * and time values
     */
    formatters?: IDatepickerFormatters;

    /**
     * Is dialog always rendered
     * @description Is dialog always rendered flag
     */
    isDialogAlwaysRendered?: boolean;

    /**
     * Allow clear
     * @description Allow user to clear
     * selected date
     */
    allowClear?: boolean;

    /**
     * Allow time
     * @description Allow user to set time
     */
    allowTime?: boolean;

    /**
     * Disable date
     * @description Disable date pick
     */
    disableDate?: boolean;
}