/// <reference types="q" />
import * as Q from 'q';
import { Expression, ExpressionValue, ExpressionJS, Alterations, Indexer } from "./baseExpression";
import { DatasetFullType, FullType } from "../types";
import { SQLDialect } from "../dialect/baseDialect";
import { PlywoodValue } from "../datatypes/index";
import { Action } from "../actions/baseAction";
import { ComputeFn } from "../datatypes/dataset";
import { External } from "../external/baseExternal";
export declare class ExternalExpression extends Expression {
    static fromJS(parameters: ExpressionJS): Expression;
    external: External;
    constructor(parameters: ExpressionValue);
    valueOf(): ExpressionValue;
    toJS(): ExpressionJS;
    toString(): string;
    getFn(): ComputeFn;
    getJS(datumVar: string): string;
    getSQL(dialect: SQLDialect): string;
    equals(other: ExternalExpression): boolean;
    _fillRefSubstitutions(typeContext: DatasetFullType, indexer: Indexer, alterations: Alterations): FullType;
    _computeResolvedSimulate(lastNode: boolean, simulatedQueries: any[]): PlywoodValue;
    _computeResolved(lastNode: boolean): Q.Promise<PlywoodValue>;
    unsuppress(): ExternalExpression;
    addAction(action: Action): ExternalExpression;
    maxPossibleSplitValues(): number;
}
