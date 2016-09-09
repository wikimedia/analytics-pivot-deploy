import { Instance } from 'immutable-class';
import { Timezone } from '../timezone/timezone';
export interface DurationValue {
    year?: number;
    month?: number;
    week?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    [span: string]: number | undefined;
}
export declare class Duration implements Instance<DurationValue, string> {
    singleSpan: string;
    spans: DurationValue;
    static fromJS(durationStr: string): Duration;
    static fromCanonicalLength(length: number): Duration;
    static isDuration(candidate: any): boolean;
    constructor(spans: DurationValue);
    constructor(start: Date, end: Date, timezone: Timezone);
    toString(): string;
    add(duration: Duration): Duration;
    subtract(duration: Duration): Duration;
    valueOf(): DurationValue;
    toJS(): string;
    toJSON(): string;
    equals(other: Duration): boolean;
    isSimple(): boolean;
    isFloorable(): boolean;
    floor(date: Date, timezone: Timezone): Date;
    shift(date: Date, timezone: Timezone, step?: number): Date;
    materialize(start: Date, end: Date, timezone: Timezone, step?: number): Date[];
    isAligned(date: Date, timezone: Timezone): boolean;
    dividesBy(smaller: Duration): boolean;
    getCanonicalLength(): number;
    getDescription(capitalize?: boolean): string;
    getSingleSpan(): string | null;
    getSingleSpanValue(): number | null;
}
