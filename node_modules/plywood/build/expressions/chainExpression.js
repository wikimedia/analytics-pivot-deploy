var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { immutableArraysEqual } from "immutable-class";
import { r, ply, Expression } from "./baseExpression";
import { ExternalExpression } from "./externalExpression";
import { Action, ApplyAction, FilterAction, LimitAction, SelectAction, SortAction } from "../actions/index";
import { Dataset } from "../datatypes/index";
import { hasOwnProperty, repeat, arraysEqual } from "../helper/utils";
import { RefExpression } from "./refExpression";
export var ChainExpression = (function (_super) {
    __extends(ChainExpression, _super);
    function ChainExpression(parameters) {
        _super.call(this, parameters, dummyObject);
        var expression = parameters.expression;
        var actions = parameters.actions;
        if (!actions.length)
            throw new Error('can not have empty actions');
        this._ensureOp('chain');
        var type = expression.type;
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            var upgradedAction = action.getUpgradedType(type);
            if (upgradedAction !== action) {
                actions = actions.slice();
                actions[i] = action = upgradedAction;
            }
            try {
                type = action.getOutputType(type);
            }
            catch (e) {
                var neededType = action.getNecessaryInputTypes();
                if (i === 0) {
                    expression = expression.upgradeToType(neededType);
                    type = expression.type;
                }
                else {
                    var upgradedChain = new ChainExpression({
                        expression: expression,
                        actions: actions.slice(0, i)
                    }).upgradeToType(neededType);
                    expression = upgradedChain.expression;
                    actions = upgradedChain.actions;
                    type = upgradedChain.type;
                }
                type = action.getOutputType(type);
            }
        }
        this.expression = expression;
        this.actions = actions;
        this.type = type;
    }
    ChainExpression.fromJS = function (parameters) {
        var value = {
            op: parameters.op
        };
        value.expression = Expression.fromJS(parameters.expression);
        if (hasOwnProperty(parameters, 'action')) {
            value.actions = [Action.fromJS(parameters.action)];
        }
        else {
            if (!Array.isArray(parameters.actions))
                throw new Error('chain `actions` must be an array');
            value.actions = parameters.actions.map(Action.fromJS);
        }
        return new ChainExpression(value);
    };
    ChainExpression.prototype.upgradeToType = function (neededType) {
        var actions = this.actions;
        var upgradedActions = [];
        for (var i = actions.length - 1; i >= 0; i--) {
            var action = actions[i];
            var upgradedAction = action.getUpgradedType(neededType);
            upgradedActions.unshift(upgradedAction);
            neededType = upgradedAction.getNeededType();
        }
        var value = this.valueOf();
        value.actions = upgradedActions;
        value.expression = this.expression.upgradeToType(neededType);
        return new ChainExpression(value);
    };
    ChainExpression.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.expression = this.expression;
        value.actions = this.actions;
        return value;
    };
    ChainExpression.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.expression = this.expression.toJS();
        var actions = this.actions;
        if (actions.length === 1) {
            js.action = actions[0].toJS();
        }
        else {
            js.actions = actions.map(function (action) { return action.toJS(); });
        }
        return js;
    };
    ChainExpression.prototype.toString = function (indent) {
        var expression = this.expression;
        var actions = this.actions;
        var joinStr = '.';
        var nextIndent = null;
        if (indent != null && (actions.length > 1 || expression.type === 'DATASET')) {
            joinStr = '\n' + repeat(' ', indent) + joinStr;
            nextIndent = indent + 2;
        }
        return [expression.toString()]
            .concat(actions.map(function (action) { return action.toString(nextIndent); }))
            .join(joinStr);
    };
    ChainExpression.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.expression.equals(other.expression) &&
            immutableArraysEqual(this.actions, other.actions);
    };
    ChainExpression.prototype.expressionCount = function () {
        var expressionCount = 1 + this.expression.expressionCount();
        var actions = this.actions;
        for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
            var action = actions_1[_i];
            expressionCount += action.expressionCount();
        }
        return expressionCount;
    };
    ChainExpression.prototype.getFn = function () {
        var _a = this, expression = _a.expression, actions = _a.actions;
        var fn = expression.getFn();
        var type = expression.type;
        for (var _i = 0, actions_2 = actions; _i < actions_2.length; _i++) {
            var action = actions_2[_i];
            fn = action.getFn(type, fn);
            type = action.getOutputType(type);
        }
        return fn;
    };
    ChainExpression.prototype.getJS = function (datumVar) {
        var _a = this, expression = _a.expression, actions = _a.actions;
        var js = expression.getJS(datumVar);
        var type = expression.type;
        for (var _i = 0, actions_3 = actions; _i < actions_3.length; _i++) {
            var action = actions_3[_i];
            js = action.getJS(type, js, datumVar);
            type = action.getOutputType(type);
        }
        return js;
    };
    ChainExpression.prototype.getSQL = function (dialect) {
        var _a = this, expression = _a.expression, actions = _a.actions;
        var sql = expression.getSQL(dialect);
        var type = expression.type;
        for (var _i = 0, actions_4 = actions; _i < actions_4.length; _i++) {
            var action = actions_4[_i];
            sql = action.getSQL(type, sql, dialect);
            type = action.getOutputType(type);
        }
        return sql;
    };
    ChainExpression.prototype.getSingleAction = function (neededAction) {
        var actions = this.actions;
        if (actions.length !== 1)
            return null;
        var singleAction = actions[0];
        if (neededAction && singleAction.action !== neededAction)
            return null;
        return singleAction;
    };
    ChainExpression.prototype.foldIntoExternal = function () {
        var _a = this, expression = _a.expression, actions = _a.actions;
        var baseExternals = this.getBaseExternals();
        if (baseExternals.length === 0)
            return this;
        if (expression instanceof ExternalExpression) {
            var myExternal = expression;
            var undigestedActions = [];
            for (var _i = 0, actions_5 = actions; _i < actions_5.length; _i++) {
                var action = actions_5[_i];
                var newExternal = myExternal.addAction(action);
                if (newExternal) {
                    myExternal = newExternal;
                }
                else {
                    undigestedActions.push(action);
                }
            }
            if (undigestedActions.length) {
                return new ChainExpression({
                    expression: myExternal,
                    actions: undigestedActions,
                    simple: true
                });
            }
            else {
                return myExternal;
            }
        }
        var dataset = expression.getLiteralValue();
        if (Dataset.isDataset(dataset) && dataset.basis()) {
            if (baseExternals.length > 1) {
                throw new Error('multiple externals not supported for now');
            }
            var dataDefinitions = Object.create(null);
            var hasExternalValueApply = false;
            var applies = [];
            var undigestedActions = [];
            var allActions = [];
            for (var _b = 0, actions_6 = actions; _b < actions_6.length; _b++) {
                var action_1 = actions_6[_b];
                if (action_1 instanceof ApplyAction) {
                    var substitutedAction = action_1.substitute(function (ex, index, depth, nestDiff) {
                        if (ex instanceof RefExpression && ex.type === 'DATASET' && nestDiff === 1) {
                            return dataDefinitions[ex.name] || null;
                        }
                        return null;
                    }).simplify();
                    if (substitutedAction.expression instanceof ExternalExpression) {
                        var externalMode = substitutedAction.expression.external.mode;
                        if (externalMode === 'raw') {
                            dataDefinitions[substitutedAction.name] = substitutedAction.expression;
                        }
                        else if (externalMode === 'value') {
                            applies.push(substitutedAction);
                            allActions.push(substitutedAction);
                            hasExternalValueApply = true;
                        }
                        else {
                            undigestedActions.push(substitutedAction);
                            allActions.push(substitutedAction);
                        }
                    }
                    else if (substitutedAction.expression.type !== 'DATASET') {
                        applies.push(substitutedAction);
                        allActions.push(substitutedAction);
                    }
                    else {
                        undigestedActions.push(substitutedAction);
                        allActions.push(substitutedAction);
                    }
                }
                else {
                    undigestedActions.push(action_1);
                    allActions.push(action_1);
                }
            }
            var newExpression;
            if (hasExternalValueApply) {
                var combinedExternal = baseExternals[0].makeTotal(applies);
                if (!combinedExternal)
                    throw new Error('something went wrong');
                newExpression = new ExternalExpression({ external: combinedExternal });
                if (undigestedActions.length)
                    newExpression = newExpression.performActions(undigestedActions, true);
                return newExpression;
            }
            else {
                return ply().performActions(allActions);
            }
        }
        return this.substituteAction(function (action) {
            var expression = action.expression;
            return (expression instanceof ExternalExpression) && expression.external.mode === 'value';
        }, function (preEx, action) {
            var external = action.expression.external;
            return new ExternalExpression({
                external: external.prePack(preEx, action)
            });
        }, {
            onceInChain: true
        }).simplify();
    };
    ChainExpression.prototype.simplify = function () {
        if (this.simple)
            return this;
        var simpleExpression = this.expression.simplify();
        var actions = this.actions;
        if (simpleExpression instanceof ChainExpression) {
            return new ChainExpression({
                expression: simpleExpression.expression,
                actions: simpleExpression.actions.concat(actions)
            }).simplify();
        }
        for (var _i = 0, actions_7 = actions; _i < actions_7.length; _i++) {
            var action = actions_7[_i];
            simpleExpression = action.performOnSimple(simpleExpression);
        }
        if (!simpleExpression.isOp('chain'))
            return simpleExpression;
        return simpleExpression.foldIntoExternal();
    };
    ChainExpression.prototype._everyHelper = function (iter, thisArg, indexer, depth, nestDiff) {
        var pass = iter.call(thisArg, this, indexer.index, depth, nestDiff);
        if (pass != null) {
            return pass;
        }
        else {
            indexer.index++;
        }
        depth++;
        var expression = this.expression;
        if (!expression._everyHelper(iter, thisArg, indexer, depth, nestDiff))
            return false;
        var actions = this.actions;
        var every = true;
        for (var _i = 0, actions_8 = actions; _i < actions_8.length; _i++) {
            var action = actions_8[_i];
            if (every) {
                every = action._everyHelper(iter, thisArg, indexer, depth, nestDiff);
            }
            else {
                indexer.index += action.expressionCount();
            }
        }
        return every;
    };
    ChainExpression.prototype._substituteHelper = function (substitutionFn, thisArg, indexer, depth, nestDiff) {
        var sub = substitutionFn.call(thisArg, this, indexer.index, depth, nestDiff);
        if (sub) {
            indexer.index += this.expressionCount();
            return sub;
        }
        else {
            indexer.index++;
        }
        depth++;
        var expression = this.expression;
        var subExpression = expression._substituteHelper(substitutionFn, thisArg, indexer, depth, nestDiff);
        var actions = this.actions;
        var subActions = actions.map(function (action) { return action._substituteHelper(substitutionFn, thisArg, indexer, depth, nestDiff); });
        if (expression === subExpression && arraysEqual(actions, subActions))
            return this;
        var value = this.valueOf();
        value.expression = subExpression;
        value.actions = subActions;
        delete value.simple;
        return new ChainExpression(value);
    };
    ChainExpression.prototype.performAction = function (action, markSimple) {
        if (!action)
            throw new Error('must have action');
        return new ChainExpression({
            expression: this.expression,
            actions: this.actions.concat(action),
            simple: Boolean(markSimple)
        });
    };
    ChainExpression.prototype._fillRefSubstitutions = function (typeContext, indexer, alterations) {
        indexer.index++;
        var currentContext = typeContext;
        var outputContext = this.expression._fillRefSubstitutions(currentContext, indexer, alterations);
        currentContext = outputContext.type === 'DATASET' ? outputContext : typeContext;
        var actions = this.actions;
        for (var _i = 0, actions_9 = actions; _i < actions_9.length; _i++) {
            var action = actions_9[_i];
            outputContext = action._fillRefSubstitutions(currentContext, outputContext, indexer, alterations);
            currentContext = outputContext.type === 'DATASET' ? outputContext : typeContext;
        }
        return outputContext;
    };
    ChainExpression.prototype.actionize = function (containingAction) {
        var actions = this.actions;
        var k = actions.length - 1;
        for (; k >= 0; k--) {
            if (actions[k].action !== containingAction)
                break;
        }
        k++;
        if (k === actions.length)
            return null;
        var newExpression;
        if (k === 0) {
            newExpression = this.expression;
        }
        else {
            var value = this.valueOf();
            value.actions = actions.slice(0, k);
            newExpression = new ChainExpression(value);
        }
        var ActionConstructor = Action.classMap[containingAction];
        return [
            new ActionConstructor({
                expression: newExpression
            })
        ].concat(actions.slice(k));
    };
    ChainExpression.prototype.firstAction = function () {
        return this.actions[0] || null;
    };
    ChainExpression.prototype.lastAction = function () {
        var actions = this.actions;
        return actions[actions.length - 1] || null;
    };
    ChainExpression.prototype.headActions = function (n) {
        var actions = this.actions;
        if (actions.length <= n)
            return this;
        if (n <= 0)
            return this.expression;
        var value = this.valueOf();
        value.actions = actions.slice(0, n);
        return new ChainExpression(value);
    };
    ChainExpression.prototype.popAction = function () {
        var actions = this.actions;
        if (!actions.length)
            return null;
        actions = actions.slice(0, -1);
        if (!actions.length)
            return this.expression;
        var value = this.valueOf();
        value.actions = actions;
        return new ChainExpression(value);
    };
    ChainExpression.prototype._computeResolvedSimulate = function (lastNode, simulatedQueries) {
        var _a = this, expression = _a.expression, actions = _a.actions;
        if (expression.isOp('external')) {
            var exV = expression._computeResolvedSimulate(false, simulatedQueries);
            var newExpression = r(exV).performActions(actions).simplify();
            if (newExpression.hasExternal()) {
                return newExpression._computeResolvedSimulate(true, simulatedQueries);
            }
            else {
                return newExpression.getFn()(null, null);
            }
        }
        function execAction(i, dataset) {
            var action = actions[i];
            var actionExpression = action.expression;
            if (action instanceof FilterAction) {
                return dataset.filter(actionExpression.getFn(), null);
            }
            else if (action instanceof ApplyAction) {
                if (actionExpression.hasExternal()) {
                    return dataset.apply(action.name, function (d) {
                        var simpleExpression = actionExpression.resolve(d).simplify();
                        return simpleExpression._computeResolvedSimulate(simpleExpression.isOp('external'), simulatedQueries);
                    }, actionExpression.type, null);
                }
                else {
                    return dataset.apply(action.name, actionExpression.getFn(), actionExpression.type, null);
                }
            }
            else if (action instanceof SortAction) {
                return dataset.sort(actionExpression.getFn(), action.direction, null);
            }
            else if (action instanceof LimitAction) {
                return dataset.limit(action.limit);
            }
            else if (action instanceof SelectAction) {
                return dataset.select(action.attributes);
            }
            throw new Error("could not execute action " + action);
        }
        var value = expression._computeResolvedSimulate(false, simulatedQueries);
        for (var i = 0; i < actions.length; i++) {
            value = execAction(i, value);
        }
        return value;
    };
    ChainExpression.prototype._computeResolved = function () {
        var _a = this, expression = _a.expression, actions = _a.actions;
        if (expression.isOp('external')) {
            return expression._computeResolved(false).then(function (exV) {
                var newExpression = r(exV).performActions(actions).simplify();
                if (newExpression.hasExternal()) {
                    return newExpression._computeResolved(true);
                }
                else {
                    return newExpression.getFn()(null, null);
                }
            });
        }
        function execAction(i) {
            return function (dataset) {
                var action = actions[i];
                var actionExpression = action.expression;
                if (action instanceof FilterAction) {
                    return dataset.filter(actionExpression.getFn(), null);
                }
                else if (action instanceof ApplyAction) {
                    if (actionExpression.hasExternal()) {
                        return dataset.applyPromise(action.name, function (d) {
                            var simpleExpression = actionExpression.resolve(d).simplify();
                            return simpleExpression._computeResolved(simpleExpression.isOp('external'));
                        }, actionExpression.type, null);
                    }
                    else {
                        return dataset.apply(action.name, actionExpression.getFn(), actionExpression.type, null);
                    }
                }
                else if (action instanceof SortAction) {
                    return dataset.sort(actionExpression.getFn(), action.direction, null);
                }
                else if (action instanceof LimitAction) {
                    return dataset.limit(action.limit);
                }
                else if (action instanceof SelectAction) {
                    return dataset.select(action.attributes);
                }
                throw new Error("could not execute action " + action);
            };
        }
        var promise = expression._computeResolved(false);
        for (var i = 0; i < actions.length; i++) {
            promise = promise.then(execAction(i));
        }
        return promise;
    };
    ChainExpression.prototype.extractFromAnd = function (matchFn) {
        if (!this.simple)
            return this.simplify().extractFromAnd(matchFn);
        var andExpressions = this.getExpressionPattern('and');
        if (!andExpressions)
            return _super.prototype.extractFromAnd.call(this, matchFn);
        var includedExpressions = [];
        var excludedExpressions = [];
        for (var _i = 0, andExpressions_1 = andExpressions; _i < andExpressions_1.length; _i++) {
            var ex = andExpressions_1[_i];
            if (matchFn(ex)) {
                includedExpressions.push(ex);
            }
            else {
                excludedExpressions.push(ex);
            }
        }
        return {
            extract: Expression.and(includedExpressions).simplify(),
            rest: Expression.and(excludedExpressions).simplify()
        };
    };
    ChainExpression.prototype.maxPossibleSplitValues = function () {
        return this.type === 'BOOLEAN' ? 3 : this.lastAction().maxPossibleSplitValues();
    };
    return ChainExpression;
}(Expression));
Expression.register(ChainExpression);
