/// <reference types="q" />
import * as Q from 'q';
import { Datum } from "./dataset";
import { PlyType, DatasetFullType, PlyTypeSimple, FullType } from "../types";
export declare function getValueType(value: any): PlyType;
export declare function getFullType(value: any): FullType;
export declare function getFullTypeFromDatum(datum: Datum): DatasetFullType;
export declare function valueFromJS(v: any, typeOverride?: string): any;
export declare function valueToJS(v: any): any;
export declare function valueToJSInlineType(v: any): any;
export declare function datumHasExternal(datum: Datum): boolean;
export declare function introspectDatum(datum: Datum): Q.Promise<Datum>;
export declare function isSetType(type: PlyType): boolean;
export declare function wrapSetType(type: PlyType): PlyType;
export declare function unwrapSetType(type: PlyType): PlyType;
export declare function getAllSetTypes(): PlyTypeSimple[];
