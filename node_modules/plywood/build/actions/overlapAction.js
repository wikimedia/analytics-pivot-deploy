var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
import { InAction } from "./inAction";
import { unwrapSetType, wrapSetType } from "../datatypes/common";
import { Set } from "../datatypes/set";
export var OverlapAction = (function (_super) {
    __extends(OverlapAction, _super);
    function OverlapAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("overlap");
        if (!this.expression.canHaveType('SET')) {
            throw new Error(this.action + " must have an expression of type SET (is: " + this.expression.type + ")");
        }
    }
    OverlapAction.fromJS = function (parameters) {
        return new OverlapAction(Action.jsToValue(parameters));
    };
    OverlapAction.prototype.getNecessaryInputTypes = function () {
        var expressionType = this.expression.type;
        if (expressionType && expressionType !== 'NULL' && expressionType !== 'SET/NULL') {
            var setExpressionType = wrapSetType(expressionType);
            var unwrapped = unwrapSetType(setExpressionType);
            return [setExpressionType, unwrapped];
        }
        else {
            return [
                'NULL', 'BOOLEAN', 'NUMBER', 'TIME', 'STRING', 'NUMBER_RANGE', 'TIME_RANGE', 'STRING_RANGE',
                'SET', 'SET/NULL', 'SET/BOOLEAN', 'SET/NUMBER', 'SET/TIME', 'SET/STRING',
                'SET/NUMBER_RANGE', 'SET/TIME_RANGE', 'DATASET'
            ];
        }
    };
    OverlapAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'BOOLEAN';
    };
    OverlapAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return {
            type: 'BOOLEAN'
        };
    };
    OverlapAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            var inV = inputFn(d, c);
            var exV = expressionFn(d, c);
            if (exV == null)
                return null;
            return Set.isSet(inV) ? inV.overlap(exV) : exV.contains(inV);
        };
    };
    OverlapAction.prototype._nukeExpression = function () {
        if (this.expression.equals(Expression.EMPTY_SET))
            return Expression.FALSE;
        return null;
    };
    OverlapAction.prototype._performOnSimpleWhatever = function (ex) {
        var expression = this.expression;
        if ('SET/' + ex.type === expression.type) {
            return new InAction({ expression: expression }).performOnSimple(ex);
        }
        return null;
    };
    OverlapAction.prototype._performOnLiteral = function (literalExpression) {
        var expression = this.expression;
        if (!expression.isOp('literal'))
            return new OverlapAction({ expression: literalExpression }).performOnSimple(expression);
        return this._performOnSimpleWhatever(literalExpression);
    };
    OverlapAction.prototype._performOnRef = function (refExpression) {
        return this._performOnSimpleWhatever(refExpression);
    };
    OverlapAction.prototype._performOnSimpleChain = function (chainExpression) {
        return this._performOnSimpleWhatever(chainExpression);
    };
    return OverlapAction;
}(Action));
Action.register(OverlapAction);
