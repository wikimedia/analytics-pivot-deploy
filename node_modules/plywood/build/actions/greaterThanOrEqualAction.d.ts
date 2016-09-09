import { Action, ActionJS, ActionValue } from "./baseAction";
import { PlyType, DatasetFullType, FullType } from "../types";
import { Expression, Indexer, Alterations } from "../expressions/baseExpression";
import { SQLDialect } from "../dialect/baseDialect";
import { ComputeFn } from "../datatypes/dataset";
import { LiteralExpression } from "../expressions/literalExpression";
export declare class GreaterThanOrEqualAction extends Action {
    static fromJS(parameters: ActionJS): GreaterThanOrEqualAction;
    constructor(parameters: ActionValue);
    getNecessaryInputTypes(): PlyType | PlyType[];
    getOutputType(inputType: PlyType): PlyType;
    _fillRefSubstitutions(typeContext: DatasetFullType, inputType: FullType, indexer: Indexer, alterations: Alterations): FullType;
    getUpgradedType(type: PlyType): Action;
    protected _getFnHelper(inputType: PlyType, inputFn: ComputeFn, expressionFn: ComputeFn): ComputeFn;
    protected _getJSHelper(inputType: PlyType, inputJS: string, expressionJS: string): string;
    protected _getSQLHelper(inputType: PlyType, dialect: SQLDialect, inputSQL: string, expressionSQL: string): string;
    protected _specialSimplify(simpleExpression: Expression): Action;
    protected _performOnLiteral(literalExpression: LiteralExpression): Expression;
}
