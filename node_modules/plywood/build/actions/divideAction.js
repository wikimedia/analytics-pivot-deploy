var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
export var DivideAction = (function (_super) {
    __extends(DivideAction, _super);
    function DivideAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("divide");
        this._checkExpressionTypes('NUMBER');
    }
    DivideAction.fromJS = function (parameters) {
        return new DivideAction(Action.jsToValue(parameters));
    };
    DivideAction.prototype.getNecessaryInputTypes = function () {
        return 'NUMBER';
    };
    DivideAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'NUMBER';
    };
    DivideAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return inputType;
    };
    DivideAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            var v = (inputFn(d, c) || 0) / (expressionFn(d, c) || 0);
            return isNaN(v) ? null : v;
        };
    };
    DivideAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        return "(" + inputJS + "/" + expressionJS + ")";
    };
    DivideAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "(" + inputSQL + "/" + expressionSQL + ")";
    };
    DivideAction.prototype._removeAction = function () {
        return this.expression.equals(Expression.ONE);
    };
    return DivideAction;
}(Action));
Action.register(DivideAction);
