import { Action, ActionJS, ActionValue } from "./baseAction";
import { PlyType, DatasetFullType, FullType } from "../types";
import { Expression, Indexer, Alterations } from "../expressions/baseExpression";
import { ComputeFn } from "../datatypes/dataset";
import { LiteralExpression } from "../expressions/literalExpression";
import { RefExpression } from "../expressions/refExpression";
import { ChainExpression } from "../expressions/chainExpression";
export declare class OverlapAction extends Action {
    static fromJS(parameters: ActionJS): OverlapAction;
    constructor(parameters: ActionValue);
    getNecessaryInputTypes(): PlyType[];
    getOutputType(inputType: PlyType): PlyType;
    _fillRefSubstitutions(typeContext: DatasetFullType, inputType: FullType, indexer: Indexer, alterations: Alterations): FullType;
    protected _getFnHelper(inputType: PlyType, inputFn: ComputeFn, expressionFn: ComputeFn): ComputeFn;
    protected _nukeExpression(): Expression;
    private _performOnSimpleWhatever(ex);
    protected _performOnLiteral(literalExpression: LiteralExpression): Expression;
    protected _performOnRef(refExpression: RefExpression): Expression;
    protected _performOnSimpleChain(chainExpression: ChainExpression): Expression;
}
