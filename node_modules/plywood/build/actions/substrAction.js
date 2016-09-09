var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
export var SubstrAction = (function (_super) {
    __extends(SubstrAction, _super);
    function SubstrAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this.position = parameters.position;
        this.length = parameters.length;
        this._ensureAction("substr");
    }
    SubstrAction.fromJS = function (parameters) {
        var value = Action.jsToValue(parameters);
        value.position = parameters.position;
        value.length = parameters.length;
        return new SubstrAction(value);
    };
    SubstrAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.position = this.position;
        value.length = this.length;
        return value;
    };
    SubstrAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.position = this.position;
        js.length = this.length;
        return js;
    };
    SubstrAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.position === other.position &&
            this.length === other.length;
    };
    SubstrAction.prototype._toStringParameters = function (expressionString) {
        return [String(this.position), String(this.length)];
    };
    SubstrAction.prototype.getNecessaryInputTypes = function () {
        return this._stringTransformInputType;
    };
    SubstrAction.prototype.getOutputType = function (inputType) {
        return this._stringTransformOutputType(inputType);
    };
    SubstrAction.prototype._fillRefSubstitutions = function (typeContext, inputType) {
        return inputType;
    };
    SubstrAction.prototype._getFnHelper = function (inputType, inputFn) {
        var _a = this, position = _a.position, length = _a.length;
        return function (d, c) {
            var inV = inputFn(d, c);
            if (inV === null)
                return null;
            return inV.substr(position, length);
        };
    };
    SubstrAction.prototype._getJSHelper = function (inputType, inputJS) {
        var _a = this, position = _a.position, length = _a.length;
        return "(_=" + inputJS + ",_==null?null:(''+_).substr(" + position + "," + length + "))";
    };
    SubstrAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "SUBSTR(" + inputSQL + "," + (this.position + 1) + "," + this.length + ")";
    };
    return SubstrAction;
}(Action));
Action.register(SubstrAction);
