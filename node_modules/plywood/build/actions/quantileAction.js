var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { foldContext } from "../datatypes/dataset";
export var QuantileAction = (function (_super) {
    __extends(QuantileAction, _super);
    function QuantileAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this.quantile = parameters.quantile;
        this._ensureAction("quantile");
        this._checkExpressionTypes('NUMBER');
    }
    QuantileAction.fromJS = function (parameters) {
        var value = Action.jsToValue(parameters);
        value.quantile = parameters.quantile;
        return new QuantileAction(value);
    };
    QuantileAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.quantile = this.quantile;
        return value;
    };
    QuantileAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.quantile = this.quantile;
        return js;
    };
    QuantileAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.quantile === other.quantile;
    };
    QuantileAction.prototype._toStringParameters = function (expressionString) {
        return [expressionString, String(this.quantile)];
    };
    QuantileAction.prototype.getNecessaryInputTypes = function () {
        return 'DATASET';
    };
    QuantileAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'NUMBER';
    };
    QuantileAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return {
            type: 'NUMBER'
        };
    };
    QuantileAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        var quantile = this.quantile;
        return function (d, c) {
            var inV = inputFn(d, c);
            return inV ? inV.quantile(expressionFn, quantile, foldContext(d, c)) : null;
        };
    };
    QuantileAction.prototype.isAggregate = function () {
        return true;
    };
    QuantileAction.prototype.isNester = function () {
        return true;
    };
    return QuantileAction;
}(Action));
Action.register(QuantileAction);
