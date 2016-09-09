var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
export var PowerAction = (function (_super) {
    __extends(PowerAction, _super);
    function PowerAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("power");
        this._checkExpressionTypes('NUMBER');
    }
    PowerAction.fromJS = function (parameters) {
        return new PowerAction(Action.jsToValue(parameters));
    };
    PowerAction.prototype.getNecessaryInputTypes = function () {
        return 'NUMBER';
    };
    PowerAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'NUMBER';
    };
    PowerAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return inputType;
    };
    PowerAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            return Math.pow((inputFn(d, c) || 0), (expressionFn(d, c) || 0));
        };
    };
    PowerAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        return "Math.pow(" + inputJS + "," + expressionJS + ")";
    };
    PowerAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "POW(" + inputSQL + "," + expressionSQL + ")";
    };
    PowerAction.prototype._removeAction = function () {
        return this.expression.equals(Expression.ONE);
    };
    PowerAction.prototype._performOnRef = function (simpleExpression) {
        if (this.expression.equals(Expression.ZERO))
            return simpleExpression;
        return null;
    };
    return PowerAction;
}(Action));
Action.register(PowerAction);
