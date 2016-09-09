var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { RefExpression } from "../expressions/refExpression";
export var SortAction = (function (_super) {
    __extends(SortAction, _super);
    function SortAction(parameters) {
        if (parameters === void 0) { parameters = {}; }
        _super.call(this, parameters, dummyObject);
        var direction = parameters.direction || 'ascending';
        if (direction !== SortAction.DESCENDING && direction !== SortAction.ASCENDING) {
            throw new Error("direction must be '" + SortAction.DESCENDING + "' or '" + SortAction.ASCENDING + "'");
        }
        this.direction = direction;
        if (!this.expression.isOp('ref')) {
            throw new Error("must be a reference expression: " + this.expression);
        }
        this._ensureAction("sort");
    }
    SortAction.fromJS = function (parameters) {
        var value = Action.jsToValue(parameters);
        value.direction = parameters.direction;
        return new SortAction(value);
    };
    SortAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.direction = this.direction;
        return value;
    };
    SortAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.direction = this.direction;
        return js;
    };
    SortAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.direction === other.direction;
    };
    SortAction.prototype._toStringParameters = function (expressionString) {
        return [expressionString, this.direction];
    };
    SortAction.prototype.getNecessaryInputTypes = function () {
        return 'DATASET';
    };
    SortAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'DATASET';
    };
    SortAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        this.expression._fillRefSubstitutions(typeContext, indexer, alterations);
        return typeContext;
    };
    SortAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        var direction = this.direction;
        return function (d, c) {
            var inV = inputFn(d, c);
            return inV ? inV.sort(expressionFn, direction) : null;
        };
    };
    SortAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        var dir = this.direction === SortAction.DESCENDING ? 'DESC' : 'ASC';
        return "ORDER BY " + expressionSQL + " " + dir;
    };
    SortAction.prototype.refName = function () {
        var expression = this.expression;
        return (expression instanceof RefExpression) ? expression.name : null;
    };
    SortAction.prototype.isNester = function () {
        return true;
    };
    SortAction.prototype._foldWithPrevAction = function (prevAction) {
        if (prevAction instanceof SortAction && this.expression.equals(prevAction.expression)) {
            return this;
        }
        return null;
    };
    SortAction.prototype.toggleDirection = function () {
        return new SortAction({
            expression: this.expression,
            direction: this.direction === SortAction.ASCENDING ? SortAction.DESCENDING : SortAction.ASCENDING
        });
    };
    SortAction.DESCENDING = 'descending';
    SortAction.ASCENDING = 'ascending';
    return SortAction;
}(Action));
Action.register(SortAction);
