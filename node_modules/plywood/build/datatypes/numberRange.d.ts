import { Instance } from "immutable-class";
import { Range } from "./range";
export interface NumberRangeValue {
    start: number;
    end: number;
    bounds?: string;
}
export interface NumberRangeJS {
    start: any;
    end: any;
    bounds?: string;
}
export declare class NumberRange extends Range<number> implements Instance<NumberRangeValue, NumberRangeJS> {
    static type: string;
    static isNumberRange(candidate: any): candidate is NumberRange;
    static numberBucket(num: number, size: number, offset: number): NumberRange;
    static fromNumber(n: number): NumberRange;
    static fromJS(parameters: NumberRangeJS): NumberRange;
    constructor(parameters: NumberRangeValue);
    valueOf(): NumberRangeValue;
    toJS(): NumberRangeJS;
    toJSON(): NumberRangeJS;
    equals(other: NumberRange): boolean;
    midpoint(): number;
}
