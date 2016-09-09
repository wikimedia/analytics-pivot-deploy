var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { Expression } from "../expressions/baseExpression";
import { ChainExpression } from "../expressions/chainExpression";
import { TransformCaseAction } from "./transformCaseAction";
export var ContainsAction = (function (_super) {
    __extends(ContainsAction, _super);
    function ContainsAction(parameters) {
        _super.call(this, parameters, dummyObject);
        var compare = parameters.compare;
        if (!compare) {
            compare = ContainsAction.NORMAL;
        }
        else if (compare !== ContainsAction.NORMAL && compare !== ContainsAction.IGNORE_CASE) {
            throw new Error("compare must be '" + ContainsAction.NORMAL + "' or '" + ContainsAction.IGNORE_CASE + "'");
        }
        this.compare = compare;
        this._ensureAction("contains");
        this._checkExpressionTypes('STRING');
    }
    ContainsAction.fromJS = function (parameters) {
        var value = Action.jsToValue(parameters);
        value.compare = parameters.compare;
        return new ContainsAction(value);
    };
    ContainsAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.compare = this.compare;
        return value;
    };
    ContainsAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.compare = this.compare;
        return js;
    };
    ContainsAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.compare === other.compare;
    };
    ContainsAction.prototype._toStringParameters = function (expressionString) {
        return [expressionString, this.compare];
    };
    ContainsAction.prototype.getNecessaryInputTypes = function () {
        return ['STRING', 'SET/STRING'];
    };
    ContainsAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'BOOLEAN';
    };
    ContainsAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return inputType;
    };
    ContainsAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        if (this.compare === ContainsAction.NORMAL) {
            return function (d, c) {
                return String(inputFn(d, c)).indexOf(expressionFn(d, c)) > -1;
            };
        }
        else {
            return function (d, c) {
                return String(inputFn(d, c)).toLowerCase().indexOf(String(expressionFn(d, c)).toLowerCase()) > -1;
            };
        }
    };
    ContainsAction.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        var combine;
        if (this.compare === ContainsAction.NORMAL) {
            combine = function (lhs, rhs) { return ("(''+" + lhs + ").indexOf(" + rhs + ")>-1"); };
        }
        else {
            combine = function (lhs, rhs) { return ("(''+" + lhs + ").toLowerCase().indexOf((''+" + rhs + ").toLowerCase())>-1"); };
        }
        return Expression.jsNullSafetyBinary(inputJS, expressionJS, combine, inputJS[0] === '"', expressionJS[0] === '"');
    };
    ContainsAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        if (this.compare === ContainsAction.IGNORE_CASE) {
            expressionSQL = "LOWER(" + expressionSQL + ")";
            inputSQL = "LOWER(" + inputSQL + ")";
        }
        return dialect.containsExpression(expressionSQL, inputSQL);
    };
    ContainsAction.prototype._performOnSimpleChain = function (chainExpression) {
        var expression = this.expression;
        if (expression instanceof ChainExpression) {
            var precedingAction = chainExpression.lastAction();
            var succeedingAction = expression.lastAction();
            if (precedingAction instanceof TransformCaseAction && succeedingAction instanceof TransformCaseAction) {
                if (precedingAction.transformType === succeedingAction.transformType) {
                    var precedingExpression = chainExpression.expression;
                    return precedingExpression.contains(expression.expression, ContainsAction.IGNORE_CASE).simplify();
                }
            }
        }
        return null;
    };
    ContainsAction.NORMAL = 'normal';
    ContainsAction.IGNORE_CASE = 'ignoreCase';
    return ContainsAction;
}(Action));
Action.register(ContainsAction);
