var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression, r } from "../expressions/baseExpression";
import { LiteralExpression } from "../expressions/literalExpression";
import { ChainExpression } from "../expressions/chainExpression";
import { ContainsAction } from "./containsAction";
import { IsAction } from "./isAction";
import { isSetType } from "../datatypes/common";
export var InAction = (function (_super) {
    __extends(InAction, _super);
    function InAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("in");
    }
    InAction.fromJS = function (parameters) {
        return new InAction(Action.jsToValue(parameters));
    };
    InAction.prototype.getNecessaryInputTypes = function () {
        return this.expression.type;
    };
    InAction.prototype.getOutputType = function (inputType) {
        var expression = this.expression;
        if (inputType) {
            if (!((!isSetType(inputType) && expression.canHaveType('SET')) ||
                (inputType === 'NUMBER' && expression.canHaveType('NUMBER_RANGE')) ||
                (inputType === 'STRING' && expression.canHaveType('STRING_RANGE')) ||
                (inputType === 'TIME' && expression.canHaveType('TIME_RANGE')))) {
                throw new TypeError("in action has a bad type combination " + inputType + " IN " + (expression.type || '*'));
            }
        }
        else {
            if (!(expression.canHaveType('NUMBER_RANGE') || expression.canHaveType('STRING_RANGE') || expression.canHaveType('TIME_RANGE') || expression.canHaveType('SET'))) {
                throw new TypeError("in action has invalid expression type " + expression.type);
            }
        }
        return 'BOOLEAN';
    };
    InAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return {
            type: 'BOOLEAN'
        };
    };
    InAction.prototype.getUpgradedType = function (type) {
        return this.changeExpression(this.expression.upgradeToType(type));
    };
    InAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            var inV = inputFn(d, c);
            var exV = expressionFn(d, c);
            if (!exV)
                return null;
            return exV.contains(inV);
        };
    };
    InAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        var expression = this.expression;
        if (expression instanceof LiteralExpression) {
            switch (expression.type) {
                case 'NUMBER_RANGE':
                case 'STRING_RANGE':
                case 'TIME_RANGE':
                    var range = expression.value;
                    var r0 = range.start;
                    var r1 = range.end;
                    var bounds = range.bounds;
                    var cmpStrings = [];
                    if (r0 != null) {
                        cmpStrings.push(JSON.stringify(r0) + " " + (bounds[0] === '(' ? '<' : '<=') + " _");
                    }
                    if (r1 != null) {
                        cmpStrings.push("_ " + (bounds[1] === ')' ? '<' : '<=') + " " + JSON.stringify(r1));
                    }
                    return "(_=" + inputJS + ", " + cmpStrings.join(' && ') + ")";
                case 'SET/STRING':
                    var valueSet = expression.value;
                    return JSON.stringify(valueSet.elements) + ".indexOf(" + inputJS + ")>-1";
                default:
                    throw new Error("can not convert " + this + " to JS function, unsupported type " + expression.type);
            }
        }
        throw new Error("can not convert " + this + " to JS function");
    };
    InAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        var expression = this.expression;
        var expressionType = expression.type;
        switch (expressionType) {
            case 'NUMBER_RANGE':
            case 'TIME_RANGE':
                if (expression instanceof LiteralExpression) {
                    var range = expression.value;
                    return dialect.inExpression(inputSQL, dialect.numberOrTimeToSQL(range.start), dialect.numberOrTimeToSQL(range.end), range.bounds);
                }
                throw new Error("can not convert action to SQL " + this);
            case 'STRING_RANGE':
                if (expression instanceof LiteralExpression) {
                    var stringRange = expression.value;
                    return dialect.inExpression(inputSQL, dialect.escapeLiteral(stringRange.start), dialect.escapeLiteral(stringRange.end), stringRange.bounds);
                }
                throw new Error("can not convert action to SQL " + this);
            case 'SET/STRING':
            case 'SET/NUMBER':
                return inputSQL + " IN " + expressionSQL;
            case 'SET/NUMBER_RANGE':
            case 'SET/TIME_RANGE':
                if (expression instanceof LiteralExpression) {
                    var setOfRange = expression.value;
                    return setOfRange.elements.map(function (range) {
                        return dialect.inExpression(inputSQL, dialect.numberOrTimeToSQL(range.start), dialect.numberOrTimeToSQL(range.end), range.bounds);
                    }).join(' OR ');
                }
                throw new Error("can not convert action to SQL " + this);
            default:
                throw new Error("can not convert action to SQL " + this);
        }
    };
    InAction.prototype._nukeExpression = function () {
        var expression = this.expression;
        if (expression instanceof LiteralExpression &&
            isSetType(expression.type) &&
            expression.value.empty())
            return Expression.FALSE;
        return null;
    };
    InAction.prototype._performOnSimpleWhatever = function (ex) {
        var expression = this.expression;
        var setValue = expression.getLiteralValue();
        if (setValue && 'SET/' + ex.type === expression.type && setValue.size() === 1) {
            return new IsAction({ expression: r(setValue.elements[0]) }).performOnSimple(ex);
        }
        if (ex instanceof ChainExpression) {
            var indexOfAction = ex.getSingleAction('indexOf');
            var range = expression.getLiteralValue();
            if (indexOfAction && ((range.start < 0 && range.end === null) || (range.start === 0 && range.end === null && range.bounds[0] === '['))) {
                return new ContainsAction({ expression: indexOfAction.expression }).performOnSimple(ex.expression);
            }
        }
        return null;
    };
    InAction.prototype._performOnLiteral = function (literalExpression) {
        return this._performOnSimpleWhatever(literalExpression);
    };
    InAction.prototype._performOnRef = function (refExpression) {
        return this._performOnSimpleWhatever(refExpression);
    };
    InAction.prototype._performOnSimpleChain = function (chainExpression) {
        return this._performOnSimpleWhatever(chainExpression);
    };
    return InAction;
}(Action));
Action.register(InAction);
