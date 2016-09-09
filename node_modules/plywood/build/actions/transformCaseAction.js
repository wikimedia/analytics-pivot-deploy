var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
export var TransformCaseAction = (function (_super) {
    __extends(TransformCaseAction, _super);
    function TransformCaseAction(parameters) {
        _super.call(this, parameters, dummyObject);
        var transformType = parameters.transformType;
        if (transformType !== TransformCaseAction.UPPER_CASE && transformType !== TransformCaseAction.LOWER_CASE) {
            throw new Error("Must supply transform type of '" + TransformCaseAction.UPPER_CASE + "' or '" + TransformCaseAction.LOWER_CASE + "'");
        }
        this.transformType = transformType;
        this._ensureAction("transformCase");
    }
    TransformCaseAction.fromJS = function (parameters) {
        var value = Action.jsToValue(parameters);
        value.transformType = parameters.transformType;
        return new TransformCaseAction(value);
    };
    TransformCaseAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.transformType = this.transformType;
        return value;
    };
    TransformCaseAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.transformType = this.transformType;
        return js;
    };
    TransformCaseAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.transformType === other.transformType;
    };
    TransformCaseAction.prototype.getNecessaryInputTypes = function () {
        return 'STRING';
    };
    TransformCaseAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'STRING';
    };
    TransformCaseAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        return inputType;
    };
    TransformCaseAction.prototype._foldWithPrevAction = function (prevAction) {
        if (prevAction instanceof TransformCaseAction) {
            return this;
        }
        return null;
    };
    TransformCaseAction.prototype._getFnHelper = function (inputType, inputFn) {
        var transformType = this.transformType;
        return function (d, c) {
            return transformType === TransformCaseAction.UPPER_CASE ? inputFn(d, c).toLocaleUpperCase() : inputFn(d, c).toLocaleLowerCase();
        };
    };
    TransformCaseAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        var transformType = this.transformType;
        return transformType === TransformCaseAction.UPPER_CASE ? inputJS + ".toLocaleUpperCase()" : inputJS + ".toLocaleLowerCase()";
    };
    TransformCaseAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL) {
        var transformType = this.transformType;
        return transformType === TransformCaseAction.UPPER_CASE ? "UPPER(" + inputSQL + ")" : "LOWER(" + inputSQL + ")";
    };
    TransformCaseAction.UPPER_CASE = 'upperCase';
    TransformCaseAction.LOWER_CASE = 'lowerCase';
    return TransformCaseAction;
}(Action));
Action.register(TransformCaseAction);
