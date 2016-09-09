import { Action, ActionJS, ActionValue } from "./baseAction";
import { PlyType, DatasetFullType, FullType } from "../types";
import { Indexer, Alterations } from "../expressions/baseExpression";
import { SQLDialect } from "../dialect/baseDialect";
import { ComputeFn } from "../datatypes/dataset";
export declare class SelectAction extends Action {
    static fromJS(parameters: ActionJS): SelectAction;
    attributes: string[];
    constructor(parameters?: ActionValue);
    valueOf(): ActionValue;
    toJS(): ActionJS;
    equals(other: SelectAction): boolean;
    protected _toStringParameters(expressionString: string): string[];
    getNecessaryInputTypes(): PlyType | PlyType[];
    getOutputType(inputType: PlyType): PlyType;
    _fillRefSubstitutions(typeContext: DatasetFullType, inputType: FullType, indexer: Indexer, alterations: Alterations): FullType;
    protected _getFnHelper(inputType: PlyType, inputFn: ComputeFn, expressionFn: ComputeFn): ComputeFn;
    protected _getSQLHelper(inputType: PlyType, dialect: SQLDialect, inputSQL: string, expressionSQL: string): string;
    protected _foldWithPrevAction(prevAction: Action): Action;
}
