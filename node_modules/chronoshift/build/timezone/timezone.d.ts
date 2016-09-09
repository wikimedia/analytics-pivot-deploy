import { Instance } from 'immutable-class';
export declare class Timezone implements Instance<string, string> {
    static UTC: Timezone;
    private timezone;
    static isTimezone(candidate: any): boolean;
    static fromJS(spec: string): Timezone;
    constructor(timezone: string);
    valueOf(): string;
    toJS(): string;
    toJSON(): string;
    toString(): string;
    equals(other: Timezone): boolean;
    isUTC(): boolean;
}
