import { Timezone } from "chronoshift";
import { Action, ActionJS, ActionValue, Environment } from "./baseAction";
import { PlyType, FullType } from "../types";
import { SQLDialect } from "../dialect/baseDialect";
import { ComputeFn } from "../datatypes/dataset";
export declare class TimePartAction extends Action {
    static fromJS(parameters: ActionJS): TimePartAction;
    part: string;
    timezone: Timezone;
    constructor(parameters: ActionValue);
    valueOf(): ActionValue;
    toJS(): ActionJS;
    equals(other: TimePartAction): boolean;
    protected _toStringParameters(expressionString: string): string[];
    getNecessaryInputTypes(): PlyType | PlyType[];
    getOutputType(inputType: PlyType): PlyType;
    _fillRefSubstitutions(): FullType;
    protected _getFnHelper(inputType: PlyType, inputFn: ComputeFn): ComputeFn;
    protected _getJSHelper(inputType: PlyType, inputJS: string): string;
    protected _getSQLHelper(inputType: PlyType, dialect: SQLDialect, inputSQL: string, expressionSQL: string): string;
    maxPossibleSplitValues(): number;
    needsEnvironment(): boolean;
    defineEnvironment(environment: Environment): Action;
    getTimezone(): Timezone;
}
