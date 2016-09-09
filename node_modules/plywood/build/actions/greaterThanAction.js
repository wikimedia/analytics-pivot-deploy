var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { LiteralExpression } from "../expressions/literalExpression";
import { InAction } from "./inAction";
import { Range } from "../datatypes/range";
export var GreaterThanAction = (function (_super) {
    __extends(GreaterThanAction, _super);
    function GreaterThanAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("greaterThan");
        this._checkExpressionTypes('NUMBER', 'TIME', 'STRING');
    }
    GreaterThanAction.fromJS = function (parameters) {
        return new GreaterThanAction(Action.jsToValue(parameters));
    };
    GreaterThanAction.prototype.getNecessaryInputTypes = function () {
        return this.expression.type;
    };
    GreaterThanAction.prototype.getOutputType = function (inputType) {
        var expressionType = this.expression.type;
        if (expressionType)
            this._checkInputTypes(inputType);
        return 'BOOLEAN';
    };
    GreaterThanAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return {
            type: 'BOOLEAN'
        };
    };
    GreaterThanAction.prototype.getUpgradedType = function (type) {
        return this.changeExpression(this.expression.upgradeToType(type));
    };
    GreaterThanAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            return inputFn(d, c) > expressionFn(d, c);
        };
    };
    GreaterThanAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        return "(" + inputJS + ">" + expressionJS + ")";
    };
    GreaterThanAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "(" + inputSQL + ">" + expressionSQL + ")";
    };
    GreaterThanAction.prototype._specialSimplify = function (simpleExpression) {
        if (simpleExpression instanceof LiteralExpression) {
            return new InAction({
                expression: new LiteralExpression({
                    value: Range.fromJS({ start: simpleExpression.value, end: null, bounds: '()' })
                })
            });
        }
        return null;
    };
    GreaterThanAction.prototype._performOnLiteral = function (literalExpression) {
        return (new InAction({
            expression: new LiteralExpression({
                value: Range.fromJS({ start: null, end: literalExpression.value, bounds: '()' })
            })
        })).performOnSimple(this.expression);
    };
    return GreaterThanAction;
}(Action));
Action.register(GreaterThanAction);
