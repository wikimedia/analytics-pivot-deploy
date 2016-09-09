/// <reference types="q" />
import * as Q from 'q';
import { ExternalJS, ExternalValue } from "./baseExternal";
import { SQLExternal } from "./sqlExternal";
import { Attributes } from "../datatypes/attributeInfo";
export interface MySQLDescribeRow {
    Field: string;
    Type: string;
}
export declare class MySQLExternal extends SQLExternal {
    static type: string;
    static fromJS(parameters: ExternalJS, requester: Requester.PlywoodRequester<any>): MySQLExternal;
    static postProcessIntrospect(columns: MySQLDescribeRow[]): Attributes;
    static getSourceList(requester: Requester.PlywoodRequester<any>): Q.Promise<string[]>;
    static getVersion(requester: Requester.PlywoodRequester<any>): Q.Promise<string>;
    constructor(parameters: ExternalValue);
    protected getIntrospectAttributes(): Q.Promise<Attributes>;
}
