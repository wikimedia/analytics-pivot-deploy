var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
import { getAllSetTypes } from "../datatypes/common";
export var CardinalityAction = (function (_super) {
    __extends(CardinalityAction, _super);
    function CardinalityAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("cardinality");
        this._checkNoExpression();
    }
    CardinalityAction.fromJS = function (parameters) {
        return new CardinalityAction(Action.jsToValue(parameters));
    };
    CardinalityAction.prototype.getNecessaryInputTypes = function () {
        return getAllSetTypes();
    };
    CardinalityAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'NUMBER';
    };
    CardinalityAction.prototype._fillRefSubstitutions = function (typeContext, inputType) {
        return inputType;
    };
    CardinalityAction.prototype._getFnHelper = function (inputType, inputFn) {
        return function (d, c) {
            var inV = inputFn(d, c);
            if (inV === null)
                return null;
            if (Array.isArray(inV))
                return inV.length;
            return inV.cardinality();
        };
    };
    CardinalityAction.prototype._getJSHelper = function (inputType, inputJS) {
        return Expression.jsNullSafetyUnary(inputJS, function (input) { return (input + ".length"); });
    };
    CardinalityAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "cardinality(" + inputSQL + ")";
    };
    return CardinalityAction;
}(Action));
Action.register(CardinalityAction);
