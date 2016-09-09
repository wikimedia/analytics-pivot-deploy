import { Action, ActionJS, ActionValue } from "./baseAction";
import { PlyType, FullType } from "../types";
import { SQLDialect } from "../dialect/baseDialect";
import { ComputeFn } from "../datatypes/dataset";
export declare class MatchAction extends Action {
    static likeToRegExp(like: string, escapeChar?: string): string;
    static fromJS(parameters: ActionJS): MatchAction;
    regexp: string;
    constructor(parameters: ActionValue);
    valueOf(): ActionValue;
    toJS(): ActionJS;
    equals(other: MatchAction): boolean;
    protected _toStringParameters(expressionString: string): string[];
    getNecessaryInputTypes(): PlyType | PlyType[];
    getOutputType(inputType: PlyType): PlyType;
    _fillRefSubstitutions(): FullType;
    protected _getFnHelper(inputType: PlyType, inputFn: ComputeFn): ComputeFn;
    protected _getJSHelper(inputType: PlyType, inputJS: string, expressionJS: string): string;
    protected _getSQLHelper(inputType: PlyType, dialect: SQLDialect, inputSQL: string, expressionSQL: string): string;
}
