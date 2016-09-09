var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { r, Expression } from "../expressions/baseExpression";
export var AddAction = (function (_super) {
    __extends(AddAction, _super);
    function AddAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("add");
        this._checkExpressionTypes('NUMBER');
    }
    AddAction.fromJS = function (parameters) {
        return new AddAction(Action.jsToValue(parameters));
    };
    AddAction.prototype.getNecessaryInputTypes = function () {
        return 'NUMBER';
    };
    AddAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'NUMBER';
    };
    AddAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return inputType;
    };
    AddAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            return (inputFn(d, c) || 0) + (expressionFn(d, c) || 0);
        };
    };
    AddAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        return "(" + inputJS + "+" + expressionJS + ")";
    };
    AddAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "(" + inputSQL + "+" + expressionSQL + ")";
    };
    AddAction.prototype._removeAction = function () {
        return this.expression.equals(Expression.ZERO);
    };
    AddAction.prototype._distributeAction = function () {
        return this.expression.actionize(this.action);
    };
    AddAction.prototype._performOnLiteral = function (literalExpression) {
        if (literalExpression.equals(Expression.ZERO)) {
            return this.expression;
        }
        return null;
    };
    AddAction.prototype._foldWithPrevAction = function (prevAction) {
        if (prevAction instanceof AddAction) {
            var prevValue = prevAction.expression.getLiteralValue();
            var myValue = this.expression.getLiteralValue();
            if (typeof prevValue === 'number' && typeof myValue === 'number') {
                return new AddAction({
                    expression: r(prevValue + myValue)
                });
            }
        }
        return null;
    };
    return AddAction;
}(Action));
Action.register(AddAction);
