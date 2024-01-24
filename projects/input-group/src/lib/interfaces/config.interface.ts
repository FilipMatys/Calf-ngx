// Enums
import { InputGroupMode } from "../enums/mode.enum";

/**
 * Input group config
 * @description Interface for Input group config
 */
export interface IInputGroupConfig<TOption> {
    mode: InputGroupMode;
    compareFn: (a: TOption, b: TOption) => boolean;
    trackOptionByFn: (index: number, item: TOption) => any;
}