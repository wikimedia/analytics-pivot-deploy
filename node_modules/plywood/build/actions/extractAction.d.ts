import { Action, ActionJS, ActionValue } from "./baseAction";
import { PlyType, DatasetFullType, FullType } from "../types";
import { Indexer, Alterations } from "../expressions/baseExpression";
import { SQLDialect } from "../dialect/baseDialect";
import { ComputeFn } from "../datatypes/dataset";
import { MatchAction } from "./matchAction";
export declare class ExtractAction extends Action {
    static fromJS(parameters: ActionJS): ExtractAction;
    regexp: string;
    constructor(parameters: ActionValue);
    valueOf(): ActionValue;
    toJS(): ActionJS;
    equals(other: MatchAction): boolean;
    protected _toStringParameters(expressionString: string): string[];
    getNecessaryInputTypes(): PlyType | PlyType[];
    getOutputType(inputType: PlyType): PlyType;
    _fillRefSubstitutions(typeContext: DatasetFullType, inputType: FullType, indexer: Indexer, alterations: Alterations): FullType;
    protected _getFnHelper(inputType: PlyType, inputFn: ComputeFn): ComputeFn;
    protected _getJSHelper(inputType: PlyType, inputJS: string, expressionJS: string): string;
    protected _getSQLHelper(inputType: PlyType, dialect: SQLDialect, inputSQL: string, expressionSQL: string): string;
}
