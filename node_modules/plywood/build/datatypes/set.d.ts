import { Instance } from "immutable-class";
import { PlywoodRange } from "../datatypes/range";
export interface SetValue {
    setType: string;
    elements: Array<any>;
}
export interface SetJS {
    setType: string;
    elements: Array<any>;
}
export declare class Set implements Instance<SetValue, SetJS> {
    static type: string;
    static EMPTY: Set;
    static isSet(candidate: any): candidate is Set;
    static convertToSet(thing: any): Set;
    static generalUnion(a: any, b: any): any;
    static generalIntersect(a: any, b: any): any;
    static fromJS(parameters: Array<any>): Set;
    static fromJS(parameters: SetJS): Set;
    setType: string;
    elements: Array<any>;
    private keyFn;
    private hash;
    constructor(parameters: SetValue);
    valueOf(): SetValue;
    toJS(): SetJS;
    toJSON(): SetJS;
    toString(): string;
    equals(other: Set): boolean;
    cardinality(): int;
    size(): int;
    empty(): boolean;
    simplify(): any;
    getType(): string;
    upgradeType(): Set;
    downgradeType(): Set;
    extent(): PlywoodRange;
    union(other: Set): Set;
    intersect(other: Set): Set;
    overlap(other: Set): boolean;
    contains(value: any): boolean;
    containsWithin(value: any): boolean;
    add(value: any): Set;
    remove(value: any): Set;
    toggle(value: any): Set;
}
