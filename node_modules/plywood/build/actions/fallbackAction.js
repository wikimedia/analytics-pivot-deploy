var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
export var FallbackAction = (function (_super) {
    __extends(FallbackAction, _super);
    function FallbackAction(parameters) {
        if (parameters === void 0) { parameters = {}; }
        _super.call(this, parameters, dummyObject);
        this._ensureAction("fallback");
    }
    FallbackAction.fromJS = function (parameters) {
        return new FallbackAction(Action.jsToValue(parameters));
    };
    FallbackAction.prototype.getNecessaryInputTypes = function () {
        return this.expression.type;
    };
    FallbackAction.prototype.getOutputType = function (inputType) {
        var expressionType = this.expression.type;
        if (expressionType && expressionType !== 'NULL')
            this._checkInputTypes(inputType);
        return expressionType;
    };
    FallbackAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return inputType;
    };
    FallbackAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            var val = inputFn(d, c);
            if (val === null) {
                return expressionFn(d, c);
            }
            return val;
        };
    };
    FallbackAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        return "(_ = " + inputJS + ", (_ === null ? " + expressionJS + " : _))";
    };
    FallbackAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "COALESCE(" + inputSQL + ", " + expressionSQL + ")";
    };
    FallbackAction.prototype._removeAction = function () {
        return this.expression.equals(Expression.NULL);
    };
    return FallbackAction;
}(Action));
Action.register(FallbackAction);
