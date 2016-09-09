import { Timezone } from "chronoshift";
import { Expression } from "../expressions/baseExpression";
import { foldContext } from "../datatypes/dataset";
import { hasOwnProperty, repeat, deduplicateSort } from "../helper/utils";
import { isInstanceOf } from "immutable-class";
import { LiteralExpression } from "../expressions/literalExpression";
import { RefExpression } from "../expressions/refExpression";
import { ChainExpression } from "../expressions/chainExpression";
export var Action = (function () {
    function Action(parameters, dummy) {
        if (dummy === void 0) { dummy = null; }
        this._stringTransformInputType = ['STRING', 'SET/STRING'];
        if (dummy !== dummyObject) {
            throw new TypeError("can not call `new Action` directly use Action.fromJS instead");
        }
        this.action = parameters.action;
        this.expression = parameters.expression;
        this.simple = parameters.simple;
    }
    Action.jsToValue = function (parameters) {
        var value = {
            action: parameters.action
        };
        if (parameters.expression) {
            value.expression = Expression.fromJS(parameters.expression);
        }
        return value;
    };
    Action.actionsDependOn = function (actions, name) {
        for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
            var action = actions_1[_i];
            var freeReferences = action.getFreeReferences();
            if (freeReferences.indexOf(name) !== -1)
                return true;
            if (action.name === name)
                return false;
        }
        return false;
    };
    Action.isAction = function (candidate) {
        return isInstanceOf(candidate, Action);
    };
    Action.register = function (act) {
        var action = act.name.replace('Action', '').replace(/^\w/, function (s) { return s.toLowerCase(); });
        Action.classMap[action] = act;
    };
    Action.fromJS = function (actionJS) {
        if (!hasOwnProperty(actionJS, "action")) {
            throw new Error("action must be defined");
        }
        var action = actionJS.action;
        if (typeof action !== "string") {
            throw new Error("action must be a string");
        }
        if (action === 'custom')
            actionJS.action = action = 'customAggregate';
        var ClassFn = Action.classMap[action];
        if (!ClassFn) {
            throw new Error("unsupported action '" + action + "'");
        }
        return ClassFn.fromJS(actionJS);
    };
    Action.fromValue = function (value) {
        var ClassFn = Action.classMap[value.action];
        return new ClassFn(value);
    };
    Action.prototype._ensureAction = function (action) {
        if (!this.action) {
            this.action = action;
            return;
        }
        if (this.action !== action) {
            throw new TypeError("incorrect action '" + this.action + "' (needs to be: '" + action + "')");
        }
    };
    Action.prototype._toStringParameters = function (expressionString) {
        return expressionString ? [expressionString] : [];
    };
    Action.prototype.toString = function (indent) {
        var expression = this.expression;
        var spacer = '';
        var joinStr = indent != null ? ', ' : ',';
        var nextIndent = null;
        if (indent != null && expression && expression.type === 'DATASET') {
            var space = repeat(' ', indent);
            spacer = '\n' + space;
            joinStr = ',\n' + space;
            nextIndent = indent + 2;
        }
        return [
            this.action,
            '(',
            spacer,
            this._toStringParameters(expression ? expression.toString(nextIndent) : null).join(joinStr),
            spacer,
            ')'
        ].join('');
    };
    Action.prototype.valueOf = function () {
        var value = {
            action: this.action
        };
        if (this.expression)
            value.expression = this.expression;
        if (this.simple)
            value.simple = true;
        return value;
    };
    Action.prototype.toJS = function () {
        var js = {
            action: this.action
        };
        if (this.expression) {
            js.expression = this.expression.toJS();
        }
        return js;
    };
    Action.prototype.toJSON = function () {
        return this.toJS();
    };
    Action.prototype.equals = function (other) {
        return Action.isAction(other) &&
            this.action === other.action &&
            Boolean(this.expression) === Boolean(other.expression) &&
            (!this.expression || this.expression.equals(other.expression));
    };
    Action.prototype.isAggregate = function () {
        return false;
    };
    Action.prototype._checkInputTypes = function (inputType) {
        var neededTypes = this.getNecessaryInputTypes();
        if (typeof neededTypes === 'string')
            neededTypes = [neededTypes];
        if (inputType && inputType !== 'NULL' && neededTypes.indexOf(inputType) === -1) {
            if (neededTypes.length === 1) {
                throw new Error(this.action + " must have input of type " + neededTypes[0] + " (is " + inputType + ")");
            }
            else {
                throw new Error(this.action + " must have input of type " + neededTypes.join(' or ') + " (is " + inputType + ")");
            }
        }
    };
    Action.prototype._checkNoExpression = function () {
        if (this.expression) {
            throw new Error(this.action + " must no have an expression (is " + this.expression + ")");
        }
    };
    Action.prototype._checkExpressionTypes = function () {
        var neededTypes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            neededTypes[_i - 0] = arguments[_i];
        }
        var expressionType = this.expression.type;
        if (expressionType && expressionType !== 'NULL' && neededTypes.indexOf(expressionType) === -1) {
            if (neededTypes.length === 1) {
                throw new Error(this.action + " must have expression of type " + neededTypes[0] + " (is " + expressionType + ")");
            }
            else {
                throw new Error(this.action + " must have expression of type " + neededTypes.join(' or ') + " (is " + expressionType + ")");
            }
        }
    };
    Action.prototype._stringTransformOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return inputType;
    };
    Action.prototype.getNeededType = function () {
        var expression = this.expression;
        if (expression)
            return expression.type;
        return null;
    };
    Action.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        var action = this.action;
        return function (d, c) {
            var inV = inputFn(d, c);
            return inV ? inV[action](expressionFn, foldContext(d, c)) : null;
        };
    };
    Action.prototype.getFn = function (inputType, inputFn) {
        var expression = this.expression;
        var expressionFn = expression ? expression.getFn() : null;
        return this._getFnHelper(inputType, inputFn, expressionFn);
    };
    Action.prototype._getJSHelper = function (inputType, inputJS, expressionJS) {
        throw new Error('can not call this directly');
    };
    Action.prototype.getJS = function (inputType, inputJS, datumVar) {
        var expression = this.expression;
        var expressionJS = expression ? expression.getJS(datumVar) : null;
        return this._getJSHelper(inputType, inputJS, expressionJS);
    };
    Action.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        throw new Error('can not call this directly');
    };
    Action.prototype.getSQL = function (inputType, inputSQL, dialect) {
        var expression = this.expression;
        var expressionSQL = expression ? expression.getSQL(dialect) : null;
        return this._getSQLHelper(inputType, dialect, inputSQL, expressionSQL);
    };
    Action.prototype.expressionCount = function () {
        return this.expression ? this.expression.expressionCount() : 0;
    };
    Action.prototype.fullyDefined = function () {
        var expression = this.expression;
        return !expression || expression.isOp('literal');
    };
    Action.prototype._specialSimplify = function (simpleExpression) {
        return null;
    };
    Action.prototype.simplify = function () {
        if (this.simple)
            return this;
        var expression = this.expression;
        var simpleExpression = expression ? expression.simplify() : null;
        var special = this._specialSimplify(simpleExpression);
        if (special)
            return special;
        var value = this.valueOf();
        if (simpleExpression) {
            value.expression = simpleExpression;
        }
        value.simple = true;
        return Action.fromValue(value);
    };
    Action.prototype._removeAction = function (inputType) {
        return false;
    };
    Action.prototype._nukeExpression = function (precedingExpression) {
        return null;
    };
    Action.prototype._distributeAction = function () {
        return null;
    };
    Action.prototype._performOnLiteral = function (literalExpression) {
        return null;
    };
    Action.prototype._performOnRef = function (refExpression) {
        return null;
    };
    Action.prototype._foldWithPrevAction = function (prevAction) {
        return null;
    };
    Action.prototype._putBeforeLastAction = function (lastAction) {
        return null;
    };
    Action.prototype._performOnSimpleChain = function (chainExpression) {
        return null;
    };
    Action.prototype.performOnSimple = function (simpleExpression) {
        if (!this.simple)
            return this.simplify().performOnSimple(simpleExpression);
        if (!simpleExpression.simple)
            throw new Error('must get a simple expression');
        if (this._removeAction(simpleExpression.type))
            return simpleExpression;
        var nukedExpression = this._nukeExpression(simpleExpression);
        if (nukedExpression)
            return nukedExpression;
        var distributedActions = this._distributeAction();
        if (distributedActions) {
            for (var _i = 0, distributedActions_1 = distributedActions; _i < distributedActions_1.length; _i++) {
                var distributedAction = distributedActions_1[_i];
                simpleExpression = distributedAction.performOnSimple(simpleExpression);
            }
            return simpleExpression;
        }
        if (simpleExpression instanceof LiteralExpression) {
            if (this.fullyDefined()) {
                return new LiteralExpression({
                    value: this.getFn(simpleExpression.type, simpleExpression.getFn())(null, null)
                });
            }
            var special = this._performOnLiteral(simpleExpression);
            if (special)
                return special;
        }
        else if (simpleExpression instanceof RefExpression) {
            var special = this._performOnRef(simpleExpression);
            if (special)
                return special;
        }
        else if (simpleExpression instanceof ChainExpression) {
            var actions = simpleExpression.actions;
            var lastAction = actions[actions.length - 1];
            var foldedAction = this._foldWithPrevAction(lastAction);
            if (foldedAction) {
                return foldedAction.performOnSimple(simpleExpression.popAction());
            }
            var beforeAction = this._putBeforeLastAction(lastAction);
            if (beforeAction) {
                return lastAction.performOnSimple(beforeAction.performOnSimple(simpleExpression.popAction()));
            }
            var special = this._performOnSimpleChain(simpleExpression);
            if (special)
                return special;
        }
        return simpleExpression.performAction(this, true);
    };
    Action.prototype.getExpressions = function () {
        return this.expression ? [this.expression] : [];
    };
    Action.prototype.getFreeReferences = function () {
        var freeReferences = [];
        this.getExpressions().forEach(function (ex) {
            freeReferences = freeReferences.concat(ex.getFreeReferences());
        });
        return deduplicateSort(freeReferences);
    };
    Action.prototype._everyHelper = function (iter, thisArg, indexer, depth, nestDiff) {
        var nestDiffNext = nestDiff + Number(this.isNester());
        return this.getExpressions().every(function (ex) { return ex._everyHelper(iter, thisArg, indexer, depth, nestDiffNext); });
    };
    Action.prototype.substitute = function (substitutionFn, thisArg) {
        return this._substituteHelper(substitutionFn, thisArg, { index: 0 }, 0, 0);
    };
    Action.prototype._substituteHelper = function (substitutionFn, thisArg, indexer, depth, nestDiff) {
        var expression = this.expression;
        if (!expression)
            return this;
        var subExpression = expression._substituteHelper(substitutionFn, thisArg, indexer, depth, nestDiff + Number(this.isNester()));
        if (expression === subExpression)
            return this;
        var value = this.valueOf();
        value.simple = false;
        value.expression = subExpression;
        return Action.fromValue(value);
    };
    Action.prototype.canDistribute = function () {
        return false;
    };
    Action.prototype.distribute = function (preEx) {
        return null;
    };
    Action.prototype.changeExpression = function (newExpression) {
        var expression = this.expression;
        if (!expression || expression.equals(newExpression))
            return this;
        var value = this.valueOf();
        value.expression = newExpression;
        return Action.fromValue(value);
    };
    Action.prototype.isNester = function () {
        return false;
    };
    Action.prototype.getLiteralValue = function () {
        var expression = this.expression;
        if (expression instanceof LiteralExpression) {
            return expression.value;
        }
        return null;
    };
    Action.prototype.maxPossibleSplitValues = function () {
        return Infinity;
    };
    Action.prototype.getUpgradedType = function (type) {
        return this;
    };
    Action.prototype.needsEnvironment = function () {
        return false;
    };
    Action.prototype.defineEnvironment = function (environment) {
        return this;
    };
    Action.prototype.getTimezone = function () {
        return Timezone.UTC;
    };
    Action.prototype.alignsWith = function (actions) {
        return true;
    };
    Action.classMap = {};
    return Action;
}());
