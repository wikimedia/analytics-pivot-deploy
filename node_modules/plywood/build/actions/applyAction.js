var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { foldContext } from "../datatypes/dataset";
import { RefExpression } from "../expressions/refExpression";
import { ChainExpression } from "../expressions/chainExpression";
export var ApplyAction = (function (_super) {
    __extends(ApplyAction, _super);
    function ApplyAction(parameters) {
        if (parameters === void 0) { parameters = {}; }
        _super.call(this, parameters, dummyObject);
        this.name = parameters.name;
        this._ensureAction("apply");
    }
    ApplyAction.fromJS = function (parameters) {
        var value = Action.jsToValue(parameters);
        value.name = parameters.name;
        return new ApplyAction(value);
    };
    ApplyAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.name = this.name;
        return value;
    };
    ApplyAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.name = this.name;
        return js;
    };
    ApplyAction.prototype.getNecessaryInputTypes = function () {
        return 'DATASET';
    };
    ApplyAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'DATASET';
    };
    ApplyAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        typeContext.datasetType[this.name] = this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return typeContext;
    };
    ApplyAction.prototype._toStringParameters = function (expressionString) {
        var name = this.name;
        if (!RefExpression.SIMPLE_NAME_REGEXP.test(name))
            name = JSON.stringify(name);
        return [name, expressionString];
    };
    ApplyAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.name === other.name;
    };
    ApplyAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        var name = this.name;
        var type = this.expression.type;
        return function (d, c) {
            var inV = inputFn(d, c);
            return inV ? inV.apply(name, expressionFn, type, foldContext(d, c)) : null;
        };
    };
    ApplyAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return expressionSQL + " AS " + dialect.escapeName(this.name);
    };
    ApplyAction.prototype.isSimpleAggregate = function () {
        var expression = this.expression;
        if (expression instanceof ChainExpression) {
            var actions = expression.actions;
            return actions.length === 1 && actions[0].isAggregate();
        }
        return false;
    };
    ApplyAction.prototype.isNester = function () {
        return true;
    };
    ApplyAction.prototype._removeAction = function () {
        var _a = this, name = _a.name, expression = _a.expression;
        if (expression instanceof RefExpression) {
            return expression.name === name && expression.nest === 0;
        }
        return false;
    };
    ApplyAction.prototype._putBeforeLastAction = function (lastAction) {
        if (this.isSimpleAggregate() &&
            lastAction instanceof ApplyAction &&
            !lastAction.isSimpleAggregate() &&
            this.expression.getFreeReferences().indexOf(lastAction.name) === -1) {
            return this;
        }
        return null;
    };
    return ApplyAction;
}(Action));
Action.register(ApplyAction);
