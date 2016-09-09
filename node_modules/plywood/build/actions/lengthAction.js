var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
export var LengthAction = (function (_super) {
    __extends(LengthAction, _super);
    function LengthAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("length");
        this._checkNoExpression();
    }
    LengthAction.fromJS = function (parameters) {
        return new LengthAction(Action.jsToValue(parameters));
    };
    LengthAction.prototype.getNecessaryInputTypes = function () {
        return 'STRING';
    };
    LengthAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'NUMBER';
    };
    LengthAction.prototype._fillRefSubstitutions = function (typeContext, inputType) {
        return inputType;
    };
    LengthAction.prototype._getFnHelper = function (inputType, inputFn) {
        return function (d, c) {
            var inV = inputFn(d, c);
            if (inV === null)
                return null;
            return inV.length;
        };
    };
    LengthAction.prototype._getJSHelper = function (inputType, inputJS) {
        return Expression.jsNullSafetyUnary(inputJS, function (input) { return (input + ".length"); });
    };
    LengthAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return dialect.lengthExpression(inputSQL);
    };
    return LengthAction;
}(Action));
Action.register(LengthAction);
