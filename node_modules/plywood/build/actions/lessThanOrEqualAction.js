var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { LiteralExpression } from "../expressions/literalExpression";
import { InAction } from "./inAction";
import { Range } from "../datatypes/range";
export var LessThanOrEqualAction = (function (_super) {
    __extends(LessThanOrEqualAction, _super);
    function LessThanOrEqualAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("lessThanOrEqual");
        this._checkExpressionTypes('NUMBER', 'TIME', 'STRING');
    }
    LessThanOrEqualAction.fromJS = function (parameters) {
        return new LessThanOrEqualAction(Action.jsToValue(parameters));
    };
    LessThanOrEqualAction.prototype.getNecessaryInputTypes = function () {
        return this.expression.type;
    };
    LessThanOrEqualAction.prototype.getOutputType = function (inputType) {
        var expressionType = this.expression.type;
        if (expressionType)
            this._checkInputTypes(inputType);
        return 'BOOLEAN';
    };
    LessThanOrEqualAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return {
            type: 'BOOLEAN'
        };
    };
    LessThanOrEqualAction.prototype.getUpgradedType = function (type) {
        return this.changeExpression(this.expression.upgradeToType(type));
    };
    LessThanOrEqualAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            return inputFn(d, c) <= expressionFn(d, c);
        };
    };
    LessThanOrEqualAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        return "(" + inputJS + "<=" + expressionJS + ")";
    };
    LessThanOrEqualAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "(" + inputSQL + "<=" + expressionSQL + ")";
    };
    LessThanOrEqualAction.prototype._specialSimplify = function (simpleExpression) {
        if (simpleExpression instanceof LiteralExpression) {
            return new InAction({
                expression: new LiteralExpression({
                    value: Range.fromJS({ start: null, end: simpleExpression.value, bounds: '(]' })
                })
            });
        }
        return null;
    };
    LessThanOrEqualAction.prototype._performOnLiteral = function (literalExpression) {
        return (new InAction({
            expression: new LiteralExpression({
                value: Range.fromJS({ start: literalExpression.value, end: null, bounds: '[)' })
            })
        })).performOnSimple(this.expression);
    };
    return LessThanOrEqualAction;
}(Action));
Action.register(LessThanOrEqualAction);
