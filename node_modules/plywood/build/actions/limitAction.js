var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { ApplyAction } from "./applyAction";
export var LimitAction = (function (_super) {
    __extends(LimitAction, _super);
    function LimitAction(parameters) {
        if (parameters === void 0) { parameters = {}; }
        _super.call(this, parameters, dummyObject);
        this.limit = parameters.limit;
        this._ensureAction("limit");
    }
    LimitAction.fromJS = function (parameters) {
        return new LimitAction({
            action: parameters.action,
            limit: parameters.limit
        });
    };
    LimitAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.limit = this.limit;
        return value;
    };
    LimitAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.limit = this.limit;
        return js;
    };
    LimitAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.limit === other.limit;
    };
    LimitAction.prototype._toStringParameters = function (expressionString) {
        return [String(this.limit)];
    };
    LimitAction.prototype.getNecessaryInputTypes = function () {
        return 'DATASET';
    };
    LimitAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'DATASET';
    };
    LimitAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        return inputType;
    };
    LimitAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        var limit = this.limit;
        return function (d, c) {
            var inV = inputFn(d, c);
            return inV ? inV.limit(limit) : null;
        };
    };
    LimitAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return "LIMIT " + this.limit;
    };
    LimitAction.prototype._foldWithPrevAction = function (prevAction) {
        if (prevAction instanceof LimitAction) {
            return new LimitAction({
                limit: Math.min(prevAction.limit, this.limit)
            });
        }
        return null;
    };
    LimitAction.prototype._putBeforeLastAction = function (lastAction) {
        if (lastAction instanceof ApplyAction) {
            return this;
        }
        return null;
    };
    return LimitAction;
}(Action));
Action.register(LimitAction);
