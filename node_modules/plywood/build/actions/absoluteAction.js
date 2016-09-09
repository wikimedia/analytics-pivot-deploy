var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
export var AbsoluteAction = (function (_super) {
    __extends(AbsoluteAction, _super);
    function AbsoluteAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("absolute");
        this._checkNoExpression();
    }
    AbsoluteAction.fromJS = function (parameters) {
        return new AbsoluteAction(Action.jsToValue(parameters));
    };
    AbsoluteAction.prototype.getNecessaryInputTypes = function () {
        return 'NUMBER';
    };
    AbsoluteAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'NUMBER';
    };
    AbsoluteAction.prototype._fillRefSubstitutions = function (typeContext, inputType) {
        return inputType;
    };
    AbsoluteAction.prototype._getFnHelper = function (inputType, inputFn) {
        return function (d, c) {
            var inV = inputFn(d, c);
            if (inV === null)
                return null;
            return Math.abs(inV);
        };
    };
    AbsoluteAction.prototype._foldWithPrevAction = function (prevAction) {
        if (prevAction.equals(this)) {
            return this;
        }
        return null;
    };
    AbsoluteAction.prototype._getJSHelper = function (inputType, inputJS) {
        return "Math.abs(" + inputJS + ")";
    };
    AbsoluteAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "ABS(" + inputSQL + ")";
    };
    return AbsoluteAction;
}(Action));
Action.register(AbsoluteAction);
