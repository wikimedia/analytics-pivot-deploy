var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
export var SubtractAction = (function (_super) {
    __extends(SubtractAction, _super);
    function SubtractAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("subtract");
        this._checkExpressionTypes('NUMBER');
    }
    SubtractAction.fromJS = function (parameters) {
        return new SubtractAction(Action.jsToValue(parameters));
    };
    SubtractAction.prototype.getNecessaryInputTypes = function () {
        return 'NUMBER';
    };
    SubtractAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'NUMBER';
    };
    SubtractAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return inputType;
    };
    SubtractAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            return (inputFn(d, c) || 0) - (expressionFn(d, c) || 0);
        };
    };
    SubtractAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        return "(" + inputJS + "-" + expressionJS + ")";
    };
    SubtractAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "(" + inputSQL + "-" + expressionSQL + ")";
    };
    SubtractAction.prototype._removeAction = function () {
        return this.expression.equals(Expression.ZERO);
    };
    return SubtractAction;
}(Action));
Action.register(SubtractAction);
