/// <reference types="q" />
import * as Q from 'q';
import { Instance } from "immutable-class";
import { PlyType, DatasetFullType } from "../types";
import { Attributes, AttributeJSs } from "./attributeInfo";
import { NumberRange } from "./numberRange";
import { Set } from "./set";
import { StringRange } from "./stringRange";
import { TimeRange } from "./timeRange";
import { External } from "../external/baseExternal";
export declare function foldContext(d: Datum, c: Datum): Datum;
export interface ComputeFn {
    (d: Datum, c: Datum, index?: number): any;
}
export interface SplitFns {
    [name: string]: ComputeFn;
}
export interface ComputePromiseFn {
    (d: Datum, c: Datum): Q.Promise<any>;
}
export interface DirectionFn {
    (a: any, b: any): number;
}
export declare type PlywoodValue = boolean | number | string | Date | NumberRange | TimeRange | StringRange | Set | Dataset | External;
export interface PseudoDatum {
    [attribute: string]: any;
}
export interface Datum {
    [attribute: string]: PlywoodValue;
}
export interface Column {
    name: string;
    type: string;
    columns?: Column[];
}
export interface Formatter extends Lookup<Function> {
    'NULL'?: (v: any) => string;
    'TIME'?: (v: Date) => string;
    'TIME_RANGE'?: (v: TimeRange) => string;
    'SET/TIME'?: (v: Set) => string;
    'SET/TIME_RANGE'?: (v: Set) => string;
    'STRING'?: (v: string) => string;
    'SET/STRING'?: (v: Set) => string;
    'BOOLEAN'?: (v: boolean) => string;
    'NUMBER'?: (v: number) => string;
    'NUMBER_RANGE'?: (v: NumberRange) => string;
    'SET/NUMBER'?: (v: Set) => string;
    'SET/NUMBER_RANGE'?: (v: Set) => string;
    'DATASET'?: (v: Dataset) => string;
}
export interface FlattenOptions {
    prefixColumns?: boolean;
    order?: string;
    nestingName?: string;
    parentName?: string;
}
export declare type FinalLineBreak = 'include' | 'suppress';
export interface TabulatorOptions extends FlattenOptions {
    separator?: string;
    lineBreak?: string;
    finalLineBreak?: FinalLineBreak;
    formatter?: Formatter;
    finalizer?: (v: string) => string;
}
export interface DatasetValue {
    attributeOverrides?: Attributes;
    attributes?: Attributes;
    keys?: string[];
    data?: Datum[];
    suppress?: boolean;
}
export interface DatasetJS {
    attributes?: AttributeJSs;
    keys?: string[];
    data?: Datum[];
}
export declare class Dataset implements Instance<DatasetValue, any> {
    static type: string;
    static isDataset(candidate: any): candidate is Dataset;
    static getAttributesFromData(data: Datum[]): Attributes;
    static parseJSON(text: string): any[];
    static fromJS(parameters: any): Dataset;
    suppress: boolean;
    attributes: Attributes;
    keys: string[];
    data: Datum[];
    constructor(parameters: DatasetValue);
    valueOf(): DatasetValue;
    toJS(): any;
    toString(): string;
    toJSON(): any;
    equals(other: Dataset): boolean;
    hide(): Dataset;
    basis(): boolean;
    hasExternal(): boolean;
    getFullType(): DatasetFullType;
    select(attrs: string[]): Dataset;
    apply(name: string, exFn: ComputeFn, type: PlyType, context: Datum): Dataset;
    applyPromise(name: string, exFn: ComputePromiseFn, type: PlyType, context: Datum): Q.Promise<Dataset>;
    filter(exFn: ComputeFn, context: Datum): Dataset;
    sort(exFn: ComputeFn, direction: string, context: Datum): Dataset;
    limit(limit: number): Dataset;
    count(): int;
    sum(exFn: ComputeFn, context: Datum): number;
    average(exFn: ComputeFn, context: Datum): number;
    min(exFn: ComputeFn, context: Datum): number;
    max(exFn: ComputeFn, context: Datum): number;
    countDistinct(exFn: ComputeFn, context: Datum): number;
    quantile(exFn: ComputeFn, quantile: number, context: Datum): number;
    split(splitFns: SplitFns, datasetName: string, context: Datum): Dataset;
    introspect(): void;
    getExternals(): External[];
    join(other: Dataset): Dataset;
    findDatumByAttribute(attribute: string, value: any): Datum;
    getNestedColumns(): Column[];
    getColumns(options?: FlattenOptions): Column[];
    private _flattenHelper(nestedColumns, prefix, order, nestingName, parentName, nesting, context, flat);
    flatten(options?: FlattenOptions): PseudoDatum[];
    toTabular(tabulatorOptions: TabulatorOptions): string;
    toCSV(tabulatorOptions?: TabulatorOptions): string;
    toTSV(tabulatorOptions?: TabulatorOptions): string;
}
