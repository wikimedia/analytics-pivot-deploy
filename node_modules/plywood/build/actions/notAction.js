var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
import { AndAction } from "./andAction";
export var NotAction = (function (_super) {
    __extends(NotAction, _super);
    function NotAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("not");
        this._checkNoExpression();
    }
    NotAction.fromJS = function (parameters) {
        return new NotAction(Action.jsToValue(parameters));
    };
    NotAction.prototype.getNecessaryInputTypes = function () {
        return 'BOOLEAN';
    };
    NotAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'BOOLEAN';
    };
    NotAction.prototype._fillRefSubstitutions = function (typeContext, inputType) {
        return inputType;
    };
    NotAction.prototype._getFnHelper = function (inputType, inputFn) {
        return function (d, c) {
            return !inputFn(d, c);
        };
    };
    NotAction.prototype._getJSHelper = function (inputType, inputJS) {
        return "!(" + inputJS + ")";
    };
    NotAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "NOT(" + inputSQL + ")";
    };
    NotAction.prototype._foldWithPrevAction = function (prevAction) {
        if (prevAction instanceof NotAction) {
            return new AndAction({ expression: Expression.TRUE });
        }
        return null;
    };
    return NotAction;
}(Action));
Action.register(NotAction);
