var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
export var LookupAction = (function (_super) {
    __extends(LookupAction, _super);
    function LookupAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this.lookup = parameters.lookup;
        this._ensureAction("lookup");
    }
    LookupAction.fromJS = function (parameters) {
        var value = Action.jsToValue(parameters);
        value.lookup = parameters.lookup;
        return new LookupAction(value);
    };
    LookupAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.lookup = this.lookup;
        return value;
    };
    LookupAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.lookup = this.lookup;
        return js;
    };
    LookupAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.lookup === other.lookup;
    };
    LookupAction.prototype._toStringParameters = function (expressionString) {
        return [String(this.lookup)];
    };
    LookupAction.prototype.getNecessaryInputTypes = function () {
        return this._stringTransformInputType;
    };
    LookupAction.prototype.getOutputType = function (inputType) {
        return this._stringTransformOutputType(inputType);
    };
    LookupAction.prototype._fillRefSubstitutions = function (typeContext, inputType) {
        return inputType;
    };
    LookupAction.prototype.fullyDefined = function () {
        return false;
    };
    LookupAction.prototype._getFnHelper = function (inputType, inputFn) {
        throw new Error('can not express as JS');
    };
    LookupAction.prototype._getJSHelper = function (inputType, inputJS) {
        throw new Error('can not express as JS');
    };
    LookupAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        throw new Error('can not express as SQL');
    };
    return LookupAction;
}(Action));
Action.register(LookupAction);
