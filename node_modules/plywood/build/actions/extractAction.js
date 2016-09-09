var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
export var ExtractAction = (function (_super) {
    __extends(ExtractAction, _super);
    function ExtractAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this.regexp = parameters.regexp;
        this._ensureAction("extract");
    }
    ExtractAction.fromJS = function (parameters) {
        var value = Action.jsToValue(parameters);
        value.regexp = parameters.regexp;
        return new ExtractAction(value);
    };
    ExtractAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.regexp = this.regexp;
        return value;
    };
    ExtractAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.regexp = this.regexp;
        return js;
    };
    ExtractAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.regexp === other.regexp;
    };
    ExtractAction.prototype._toStringParameters = function (expressionString) {
        return [this.regexp];
    };
    ExtractAction.prototype.getNecessaryInputTypes = function () {
        return this._stringTransformInputType;
    };
    ExtractAction.prototype.getOutputType = function (inputType) {
        return this._stringTransformOutputType(inputType);
    };
    ExtractAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        return inputType;
    };
    ExtractAction.prototype._getFnHelper = function (inputType, inputFn) {
        var re = new RegExp(this.regexp);
        return function (d, c) {
            return (String(inputFn(d, c)).match(re) || [])[1] || null;
        };
    };
    ExtractAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        return "((''+" + inputJS + ").match(/" + this.regexp + "/) || [])[1] || null";
    };
    ExtractAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return dialect.extractExpression(inputSQL, this.regexp);
    };
    return ExtractAction;
}(Action));
Action.register(ExtractAction);
