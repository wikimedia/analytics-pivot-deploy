var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { InAction } from "./inAction";
import { LiteralExpression } from "../expressions/literalExpression";
import { Range } from "../datatypes/range";
export var LessThanAction = (function (_super) {
    __extends(LessThanAction, _super);
    function LessThanAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("lessThan");
        this._checkExpressionTypes('NUMBER', 'TIME', 'STRING');
    }
    LessThanAction.fromJS = function (parameters) {
        return new LessThanAction(Action.jsToValue(parameters));
    };
    LessThanAction.prototype.getNecessaryInputTypes = function () {
        return this.expression.type;
    };
    LessThanAction.prototype.getOutputType = function (inputType) {
        var expressionType = this.expression.type;
        if (expressionType)
            this._checkInputTypes(inputType);
        return 'BOOLEAN';
    };
    LessThanAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return {
            type: 'BOOLEAN'
        };
    };
    LessThanAction.prototype.getUpgradedType = function (type) {
        return this.changeExpression(this.expression.upgradeToType(type));
    };
    LessThanAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            return inputFn(d, c) < expressionFn(d, c);
        };
    };
    LessThanAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        return "(" + inputJS + "<" + expressionJS + ")";
    };
    LessThanAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "(" + inputSQL + "<" + expressionSQL + ")";
    };
    LessThanAction.prototype._specialSimplify = function (simpleExpression) {
        if (simpleExpression instanceof LiteralExpression) {
            return new InAction({
                expression: new LiteralExpression({
                    value: Range.fromJS({ start: null, end: simpleExpression.value, bounds: '()' })
                })
            });
        }
        return null;
    };
    LessThanAction.prototype._performOnLiteral = function (literalExpression) {
        return (new InAction({
            expression: new LiteralExpression({
                value: Range.fromJS({ start: literalExpression.value, end: null, bounds: '()' })
            })
        })).performOnSimple(this.expression);
    };
    return LessThanAction;
}(Action));
Action.register(LessThanAction);
