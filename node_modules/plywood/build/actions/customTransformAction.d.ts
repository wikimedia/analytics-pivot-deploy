import { Action, ActionJS, ActionValue } from "./baseAction";
import { PlyType, DatasetFullType, PlyTypeSingleValue, FullType } from "../types";
import { SQLDialect } from "../dialect/baseDialect";
import { ComputeFn } from "../datatypes/dataset";
export declare class CustomTransformAction extends Action {
    static fromJS(parameters: ActionJS): CustomTransformAction;
    custom: string;
    outputType: PlyTypeSingleValue;
    constructor(parameters: ActionValue);
    getNecessaryInputTypes(): PlyType[];
    valueOf(): ActionValue;
    toJS(): ActionJS;
    equals(other: CustomTransformAction): boolean;
    protected _toStringParameters(expressionString: string): string[];
    getOutputType(inputType: PlyType): PlyType;
    _fillRefSubstitutions(typeContext: DatasetFullType, inputType: FullType): FullType;
    getFn(inputType: PlyType, inputFn: ComputeFn): ComputeFn;
    protected _getSQLHelper(inputType: PlyType, dialect: SQLDialect, inputSQL: string, expressionSQL: string): string;
    protected _getJSHelper(inputType: PlyType, inputJS: string): string;
}
