import { Action, ActionJS, ActionValue } from "./baseAction";
import { PlyType, DatasetFullType, FullType } from "../types";
import { Indexer, Alterations } from "../expressions/baseExpression";
import { SQLDialect } from "../dialect/baseDialect";
import { ComputeFn } from "../datatypes/dataset";
export declare class ApplyAction extends Action {
    static fromJS(parameters: ActionJS): ApplyAction;
    name: string;
    constructor(parameters?: ActionValue);
    valueOf(): ActionValue;
    toJS(): ActionJS;
    getNecessaryInputTypes(): PlyType | PlyType[];
    getOutputType(inputType: PlyType): PlyType;
    _fillRefSubstitutions(typeContext: DatasetFullType, inputType: FullType, indexer: Indexer, alterations: Alterations): FullType;
    protected _toStringParameters(expressionString: string): string[];
    equals(other: ApplyAction): boolean;
    protected _getFnHelper(inputType: PlyType, inputFn: ComputeFn, expressionFn: ComputeFn): ComputeFn;
    protected _getSQLHelper(inputType: PlyType, dialect: SQLDialect, inputSQL: string, expressionSQL: string): string;
    isSimpleAggregate(): boolean;
    isNester(): boolean;
    protected _removeAction(): boolean;
    protected _putBeforeLastAction(lastAction: Action): Action;
}
