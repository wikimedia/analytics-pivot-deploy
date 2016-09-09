/// <reference types="q" />
import * as Q from 'q';
import { Expression, ExpressionValue, ExpressionJS, Alterations, Indexer, ExpressionMatchFn, ExtractAndRest, SubstitutionFn, BooleanExpressionIterator } from "./baseExpression";
import { PlyType, DatasetFullType, FullType } from "../types";
import { Action } from "../actions/index";
import { PlywoodValue } from "../datatypes/index";
import { SQLDialect } from "../dialect/baseDialect";
import { ComputeFn } from "../datatypes/dataset";
export declare class ChainExpression extends Expression {
    static fromJS(parameters: ExpressionJS): ChainExpression;
    expression: Expression;
    actions: Action[];
    constructor(parameters: ExpressionValue);
    upgradeToType(neededType: PlyType): Expression;
    valueOf(): ExpressionValue;
    toJS(): ExpressionJS;
    toString(indent?: int): string;
    equals(other: ChainExpression): boolean;
    expressionCount(): int;
    getFn(): ComputeFn;
    getJS(datumVar: string): string;
    getSQL(dialect: SQLDialect): string;
    getSingleAction(neededAction?: string): Action;
    foldIntoExternal(): Expression;
    simplify(): Expression;
    _everyHelper(iter: BooleanExpressionIterator, thisArg: any, indexer: Indexer, depth: int, nestDiff: int): boolean;
    _substituteHelper(substitutionFn: SubstitutionFn, thisArg: any, indexer: Indexer, depth: int, nestDiff: int): Expression;
    performAction(action: Action, markSimple?: boolean): ChainExpression;
    _fillRefSubstitutions(typeContext: DatasetFullType, indexer: Indexer, alterations: Alterations): FullType;
    actionize(containingAction: string): Action[];
    firstAction(): Action;
    lastAction(): Action;
    headActions(n: int): Expression;
    popAction(): Expression;
    _computeResolvedSimulate(lastNode: boolean, simulatedQueries: any[]): PlywoodValue;
    _computeResolved(): Q.Promise<PlywoodValue>;
    extractFromAnd(matchFn: ExpressionMatchFn): ExtractAndRest;
    maxPossibleSplitValues(): number;
}
