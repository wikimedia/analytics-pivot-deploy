var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
export var CustomTransformAction = (function (_super) {
    __extends(CustomTransformAction, _super);
    function CustomTransformAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this.custom = parameters.custom;
        if (parameters.outputType)
            this.outputType = parameters.outputType;
        this._ensureAction("customTransform");
    }
    CustomTransformAction.fromJS = function (parameters) {
        var value = Action.jsToValue(parameters);
        value.custom = parameters.custom;
        if (parameters.outputType)
            value.outputType = parameters.outputType;
        return new CustomTransformAction(value);
    };
    CustomTransformAction.prototype.getNecessaryInputTypes = function () {
        return ['NULL', 'BOOLEAN', 'NUMBER', 'TIME', 'STRING'];
    };
    CustomTransformAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.custom = this.custom;
        if (this.outputType)
            value.outputType = this.outputType;
        return value;
    };
    CustomTransformAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.custom = this.custom;
        if (this.outputType)
            js.outputType = this.outputType;
        return js;
    };
    CustomTransformAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.custom === other.custom &&
            this.outputType === other.outputType;
    };
    CustomTransformAction.prototype._toStringParameters = function (expressionString) {
        var param = [(this.custom + " }")];
        if (this.outputType)
            param.push(this.outputType);
        return param;
    };
    CustomTransformAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return this.outputType || inputType;
    };
    CustomTransformAction.prototype._fillRefSubstitutions = function (typeContext, inputType) {
        return inputType;
    };
    CustomTransformAction.prototype.getFn = function (inputType, inputFn) {
        throw new Error('can not getFn on custom transform action');
    };
    CustomTransformAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        throw new Error("Custom transform not supported in SQL");
    };
    CustomTransformAction.prototype._getJSHelper = function (inputType, inputJS) {
        throw new Error("Custom transform can't yet be expressed as JS");
    };
    return CustomTransformAction;
}(Action));
Action.register(CustomTransformAction);
