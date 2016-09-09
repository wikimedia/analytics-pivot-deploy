var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
export var MultiplyAction = (function (_super) {
    __extends(MultiplyAction, _super);
    function MultiplyAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("multiply");
        this._checkExpressionTypes('NUMBER');
    }
    MultiplyAction.fromJS = function (parameters) {
        return new MultiplyAction(Action.jsToValue(parameters));
    };
    MultiplyAction.prototype.getNecessaryInputTypes = function () {
        return 'NUMBER';
    };
    MultiplyAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'NUMBER';
    };
    MultiplyAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return inputType;
    };
    MultiplyAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            return (inputFn(d, c) || 0) * (expressionFn(d, c) || 0);
        };
    };
    MultiplyAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        return "(" + inputJS + "*" + expressionJS + ")";
    };
    MultiplyAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "(" + inputSQL + "*" + expressionSQL + ")";
    };
    MultiplyAction.prototype._removeAction = function () {
        return this.expression.equals(Expression.ONE);
    };
    MultiplyAction.prototype._nukeExpression = function () {
        if (this.expression.equals(Expression.ZERO))
            return Expression.ZERO;
        return null;
    };
    MultiplyAction.prototype._distributeAction = function () {
        return this.expression.actionize(this.action);
    };
    MultiplyAction.prototype._performOnLiteral = function (literalExpression) {
        if (literalExpression.equals(Expression.ONE)) {
            return this.expression;
        }
        else if (literalExpression.equals(Expression.ZERO)) {
            return Expression.ZERO;
        }
        return null;
    };
    return MultiplyAction;
}(Action));
Action.register(MultiplyAction);
