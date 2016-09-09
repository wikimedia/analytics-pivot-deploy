import { Action, ActionJS, ActionValue } from "./baseAction";
import { PlyType, PlyTypeSimple, FullType } from "../types";
import { SQLDialect } from "../dialect/baseDialect";
import { ComputeFn } from "../datatypes/dataset";
export declare class CastAction extends Action {
    static fromJS(parameters: ActionJS): CastAction;
    outputType: PlyTypeSimple;
    constructor(parameters: ActionValue);
    valueOf(): ActionValue;
    toJS(): ActionJS;
    equals(other: CastAction): boolean;
    protected _toStringParameters(expressionString: string): string[];
    getNecessaryInputTypes(): PlyTypeSimple[];
    getOutputType(inputType: PlyType): PlyType;
    _fillRefSubstitutions(): FullType;
    protected _removeAction(inputType: PlyType): boolean;
    protected _foldWithPrevAction(prevAction: Action): Action;
    protected _getFnHelper(inputType: PlyType, inputFn: ComputeFn): ComputeFn;
    protected _getJSHelper(inputType: PlyType, inputJS: string): string;
    protected _getSQLHelper(inputType: PlyType, dialect: SQLDialect, inputSQL: string, expressionSQL: string): string;
}
