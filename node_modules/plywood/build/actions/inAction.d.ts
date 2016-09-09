import { Action, ActionJS, ActionValue } from "./baseAction";
import { PlyType, DatasetFullType, FullType } from "../types";
import { Expression, Indexer, Alterations } from "../expressions/baseExpression";
import { SQLDialect } from "../dialect/baseDialect";
import { ComputeFn } from "../datatypes/dataset";
import { LiteralExpression } from "../expressions/literalExpression";
import { RefExpression } from "../expressions/refExpression";
import { ChainExpression } from "../expressions/chainExpression";
export declare class InAction extends Action {
    static fromJS(parameters: ActionJS): InAction;
    constructor(parameters: ActionValue);
    getNecessaryInputTypes(): PlyType | PlyType[];
    getOutputType(inputType: PlyType): PlyType;
    _fillRefSubstitutions(typeContext: DatasetFullType, inputType: FullType, indexer: Indexer, alterations: Alterations): FullType;
    getUpgradedType(type: PlyType): Action;
    protected _getFnHelper(inputType: PlyType, inputFn: ComputeFn, expressionFn: ComputeFn): ComputeFn;
    protected _getJSHelper(inputType: PlyType, inputJS: string, expressionJS: string): string;
    protected _getSQLHelper(inputType: PlyType, dialect: SQLDialect, inputSQL: string, expressionSQL: string): string;
    protected _nukeExpression(): Expression;
    private _performOnSimpleWhatever(ex);
    protected _performOnLiteral(literalExpression: LiteralExpression): Expression;
    protected _performOnRef(refExpression: RefExpression): Expression;
    protected _performOnSimpleChain(chainExpression: ChainExpression): Expression;
}
