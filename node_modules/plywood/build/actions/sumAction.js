var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
import { LiteralExpression } from "../expressions/literalExpression";
export var SumAction = (function (_super) {
    __extends(SumAction, _super);
    function SumAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("sum");
        this._checkExpressionTypes('NUMBER');
    }
    SumAction.fromJS = function (parameters) {
        return new SumAction(Action.jsToValue(parameters));
    };
    SumAction.prototype.getNecessaryInputTypes = function () {
        return 'DATASET';
    };
    SumAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'NUMBER';
    };
    SumAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return {
            type: 'NUMBER'
        };
    };
    SumAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "SUM(" + dialect.aggregateFilterIfNeeded(inputSQL, expressionSQL) + ")";
    };
    SumAction.prototype.isAggregate = function () {
        return true;
    };
    SumAction.prototype.isNester = function () {
        return true;
    };
    SumAction.prototype.canDistribute = function () {
        var expression = this.expression;
        return expression instanceof LiteralExpression ||
            Boolean(expression.getExpressionPattern('add') || expression.getExpressionPattern('subtract'));
    };
    SumAction.prototype.distribute = function (preEx) {
        var expression = this.expression;
        if (expression instanceof LiteralExpression) {
            var value = expression.value;
            if (value === 0)
                return Expression.ZERO;
            return expression.multiply(preEx.count()).simplify();
        }
        var pattern;
        if (pattern = expression.getExpressionPattern('add')) {
            return Expression.add(pattern.map(function (ex) { return preEx.sum(ex).distribute(); }));
        }
        if (pattern = expression.getExpressionPattern('subtract')) {
            return Expression.subtract(pattern.map(function (ex) { return preEx.sum(ex).distribute(); }));
        }
        return null;
    };
    return SumAction;
}(Action));
Action.register(SumAction);
