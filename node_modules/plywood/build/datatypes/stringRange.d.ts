import { Instance } from "immutable-class";
import { Range } from "./range";
export interface StringRangeValue {
    start: string;
    end: string;
    bounds?: string;
}
export interface StringRangeJS {
    start: string;
    end: string;
    bounds?: string;
}
export declare class StringRange extends Range<string> implements Instance<StringRangeValue, StringRangeJS> {
    static type: string;
    static isStringRange(candidate: any): candidate is StringRange;
    static fromString(s: string): StringRange;
    static fromJS(parameters: StringRangeJS): StringRange;
    constructor(parameters: StringRangeValue);
    valueOf(): StringRangeValue;
    toJS(): StringRangeJS;
    toJSON(): StringRangeJS;
    equals(other: StringRange): boolean;
    midpoint(): string;
    protected _zeroEndpoint(): string;
}
