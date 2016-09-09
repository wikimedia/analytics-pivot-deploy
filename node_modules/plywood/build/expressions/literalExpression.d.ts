/// <reference types="q" />
import * as Q from 'q';
import { PlyType, DatasetFullType, FullType } from "../types";
import { Expression, ExpressionValue, ExpressionJS, Alterations, Indexer } from "./baseExpression";
import { SQLDialect } from "../dialect/baseDialect";
import { PlywoodValue } from "../datatypes/index";
import { ComputeFn } from "../datatypes/dataset";
export declare class LiteralExpression extends Expression {
    static fromJS(parameters: ExpressionJS): LiteralExpression;
    value: any;
    constructor(parameters: ExpressionValue);
    valueOf(): ExpressionValue;
    toJS(): ExpressionJS;
    toString(): string;
    getFn(): ComputeFn;
    getJS(datumVar: string): string;
    getSQL(dialect: SQLDialect): string;
    equals(other: LiteralExpression): boolean;
    _fillRefSubstitutions(typeContext: DatasetFullType, indexer: Indexer, alterations: Alterations): FullType;
    getLiteralValue(): any;
    _computeResolvedSimulate(): PlywoodValue;
    _computeResolved(): Q.Promise<PlywoodValue>;
    maxPossibleSplitValues(): number;
    bumpStringLiteralToTime(): Expression;
    bumpStringLiteralToSetString(): Expression;
    upgradeToType(targetType: PlyType): Expression;
}
