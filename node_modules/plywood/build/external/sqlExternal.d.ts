/// <reference types="q" />
import * as Q from "q";
import { Expression } from "../expressions/baseExpression";
import { LimitAction, SortAction } from "../actions/index";
import { Attributes } from "../datatypes/attributeInfo";
import { External, ExternalValue, QueryAndPostProcess } from "./baseExternal";
import { SQLDialect } from "../dialect/baseDialect";
export declare abstract class SQLExternal extends External {
    static type: string;
    dialect: SQLDialect;
    constructor(parameters: ExternalValue, dialect: SQLDialect);
    canHandleFilter(ex: Expression): boolean;
    canHandleTotal(): boolean;
    canHandleSplit(ex: Expression): boolean;
    canHandleApply(ex: Expression): boolean;
    canHandleSort(sortAction: SortAction): boolean;
    canHandleLimit(limitAction: LimitAction): boolean;
    canHandleHavingFilter(ex: Expression): boolean;
    getQueryAndPostProcess(): QueryAndPostProcess<string>;
    protected abstract getIntrospectAttributes(): Q.Promise<Attributes>;
}
