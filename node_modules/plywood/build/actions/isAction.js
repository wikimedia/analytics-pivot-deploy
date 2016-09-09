var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
import { InAction } from "./inAction";
import { TimeBucketAction } from "./timeBucketAction";
import { TimeRange } from "../datatypes/timeRange";
import { NumberBucketAction } from "./numberBucketAction";
import { NumberRange } from "../datatypes/numberRange";
import { IndexOfAction } from "./indexOfAction";
import { FallbackAction } from "./fallbackAction";
export var IsAction = (function (_super) {
    __extends(IsAction, _super);
    function IsAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("is");
    }
    IsAction.fromJS = function (parameters) {
        return new IsAction(Action.jsToValue(parameters));
    };
    IsAction.prototype.getNecessaryInputTypes = function () {
        return this.expression.type;
    };
    IsAction.prototype.getOutputType = function (inputType) {
        var expressionType = this.expression.type;
        if (expressionType && expressionType !== 'NULL')
            this._checkInputTypes(inputType);
        return 'BOOLEAN';
    };
    IsAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return {
            type: 'BOOLEAN'
        };
    };
    IsAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            return inputFn(d, c) === expressionFn(d, c);
        };
    };
    IsAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        return "(" + inputJS + "===" + expressionJS + ")";
    };
    IsAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return dialect.isNotDistinctFromExpression(inputSQL, expressionSQL);
    };
    IsAction.prototype._nukeExpression = function (precedingExpression) {
        var prevAction = precedingExpression.lastAction();
        var literalValue = this.getLiteralValue();
        if (prevAction instanceof TimeBucketAction && literalValue instanceof TimeRange && prevAction.timezone) {
            if (literalValue.start !== null && TimeRange.timeBucket(literalValue.start, prevAction.duration, prevAction.timezone).equals(literalValue))
                return null;
            return Expression.FALSE;
        }
        if (prevAction instanceof NumberBucketAction && literalValue instanceof NumberRange) {
            if (literalValue.start !== null && NumberRange.numberBucket(literalValue.start, prevAction.size, prevAction.offset).equals(literalValue))
                return null;
            return Expression.FALSE;
        }
        return null;
    };
    IsAction.prototype._foldWithPrevAction = function (prevAction) {
        var literalValue = this.getLiteralValue();
        if (prevAction instanceof TimeBucketAction && literalValue instanceof TimeRange && prevAction.timezone) {
            if (!(literalValue.start !== null && TimeRange.timeBucket(literalValue.start, prevAction.duration, prevAction.timezone).equals(literalValue)))
                return null;
            return new InAction({ expression: this.expression });
        }
        if (prevAction instanceof NumberBucketAction && literalValue instanceof NumberRange) {
            if (!(literalValue.start !== null && NumberRange.numberBucket(literalValue.start, prevAction.size, prevAction.offset).equals(literalValue)))
                return null;
            return new InAction({ expression: this.expression });
        }
        if (prevAction instanceof FallbackAction && prevAction.expression.isOp('literal') && this.expression.isOp('literal') && !prevAction.expression.equals(this.expression)) {
            return this;
        }
        return null;
    };
    IsAction.prototype._performOnLiteral = function (literalExpression) {
        var expression = this.expression;
        if (!expression.isOp('literal')) {
            return new IsAction({ expression: literalExpression }).performOnSimple(expression);
        }
        return null;
    };
    IsAction.prototype._performOnRef = function (refExpression) {
        if (this.expression.equals(refExpression)) {
            return Expression.TRUE;
        }
        return null;
    };
    IsAction.prototype._performOnSimpleChain = function (chainExpression) {
        if (this.expression.equals(chainExpression)) {
            return Expression.TRUE;
        }
        var prevAction = chainExpression.lastAction();
        var literalValue = this.getLiteralValue();
        if (prevAction instanceof IndexOfAction && literalValue === -1) {
            var precedingExpression = chainExpression.expression;
            var actionExpression = prevAction.expression;
            return precedingExpression.contains(actionExpression).not().simplify();
        }
        return null;
    };
    return IsAction;
}(Action));
Action.register(IsAction);
