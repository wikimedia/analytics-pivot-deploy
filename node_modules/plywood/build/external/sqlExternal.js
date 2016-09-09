var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Dataset } from "../datatypes/index";
import { Expression } from "../expressions/baseExpression";
import { ApplyAction, NumberBucketAction, TimeBucketAction } from "../actions/index";
import { External } from "./baseExternal";
import { ChainExpression } from "../expressions/chainExpression";
function correctResult(result) {
    return Array.isArray(result) && (result.length === 0 || typeof result[0] === 'object');
}
function getSplitInflaters(split) {
    return split.mapSplits(function (label, splitExpression) {
        var simpleInflater = External.getSimpleInflater(splitExpression, label);
        if (simpleInflater)
            return simpleInflater;
        if (splitExpression instanceof ChainExpression) {
            var lastAction = splitExpression.lastAction();
            if (lastAction instanceof TimeBucketAction) {
                return External.timeRangeInflaterFactory(label, lastAction.duration, lastAction.getTimezone());
            }
            if (lastAction instanceof NumberBucketAction) {
                return External.numberRangeInflaterFactory(label, lastAction.size);
            }
        }
        return undefined;
    });
}
function valuePostProcess(data) {
    if (!correctResult(data)) {
        var err = new Error("unexpected result (value)");
        err.result = data;
        throw err;
    }
    return data.length ? data[0][External.VALUE_NAME] : 0;
}
function postProcessFactory(inflaters, zeroTotalApplies) {
    return function (data) {
        if (!correctResult(data)) {
            var err = new Error("unexpected result");
            err.result = data;
            throw err;
        }
        var n = data.length;
        for (var _i = 0, inflaters_1 = inflaters; _i < inflaters_1.length; _i++) {
            var inflater = inflaters_1[_i];
            for (var i = 0; i < n; i++) {
                inflater(data[i], i, data);
            }
        }
        if (n === 0 && zeroTotalApplies) {
            data = [External.makeZeroDatum(zeroTotalApplies)];
        }
        return new Dataset({ data: data });
    };
}
export var SQLExternal = (function (_super) {
    __extends(SQLExternal, _super);
    function SQLExternal(parameters, dialect) {
        _super.call(this, parameters, dummyObject);
        this.dialect = dialect;
    }
    SQLExternal.prototype.canHandleFilter = function (ex) {
        return true;
    };
    SQLExternal.prototype.canHandleTotal = function () {
        return true;
    };
    SQLExternal.prototype.canHandleSplit = function (ex) {
        return true;
    };
    SQLExternal.prototype.canHandleApply = function (ex) {
        return true;
    };
    SQLExternal.prototype.canHandleSort = function (sortAction) {
        return true;
    };
    SQLExternal.prototype.canHandleLimit = function (limitAction) {
        return true;
    };
    SQLExternal.prototype.canHandleHavingFilter = function (ex) {
        return true;
    };
    SQLExternal.prototype.getQueryAndPostProcess = function () {
        var _a = this, source = _a.source, mode = _a.mode, applies = _a.applies, sort = _a.sort, limit = _a.limit, derivedAttributes = _a.derivedAttributes, dialect = _a.dialect;
        var query = ['SELECT'];
        var postProcess = null;
        var inflaters = [];
        var zeroTotalApplies = null;
        var from = "FROM " + this.dialect.escapeName(source);
        var filter = this.getQueryFilter();
        if (!filter.equals(Expression.TRUE)) {
            from += '\nWHERE ' + filter.getSQL(dialect);
        }
        switch (mode) {
            case 'raw':
                var selectedAttributes = this.getSelectedAttributes();
                selectedAttributes.forEach(function (attribute) {
                    var name = attribute.name, type = attribute.type;
                    switch (type) {
                        case 'BOOLEAN':
                            inflaters.push(External.booleanInflaterFactory(name));
                            break;
                        case 'SET/STRING':
                            inflaters.push(External.setStringInflaterFactory(name));
                            break;
                    }
                });
                query.push(selectedAttributes.map(function (a) {
                    var name = a.name;
                    if (derivedAttributes[name]) {
                        return new ApplyAction({ name: name, expression: derivedAttributes[name] }).getSQL(null, '', dialect);
                    }
                    else {
                        return dialect.escapeName(name);
                    }
                }).join(', '), from);
                if (sort) {
                    query.push(sort.getSQL(null, '', dialect));
                }
                if (limit) {
                    query.push(limit.getSQL(null, '', dialect));
                }
                break;
            case 'value':
                query.push(this.toValueApply().getSQL(null, '', dialect), from, dialect.constantGroupBy());
                postProcess = valuePostProcess;
                break;
            case 'total':
                zeroTotalApplies = applies;
                query.push(applies.map(function (apply) { return apply.getSQL(null, '', dialect); }).join(',\n'), from, dialect.constantGroupBy());
                break;
            case 'split':
                var split = this.getQuerySplit();
                query.push(split.getSelectSQL(dialect)
                    .concat(applies.map(function (apply) { return apply.getSQL(null, '', dialect); }))
                    .join(',\n'), from, split.getShortGroupBySQL());
                if (!(this.havingFilter.equals(Expression.TRUE))) {
                    query.push('HAVING ' + this.havingFilter.getSQL(dialect));
                }
                if (sort) {
                    query.push(sort.getSQL(null, '', dialect));
                }
                if (limit) {
                    query.push(limit.getSQL(null, '', dialect));
                }
                inflaters = getSplitInflaters(split);
                break;
            default:
                throw new Error("can not get query for mode: " + mode);
        }
        return {
            query: query.join('\n'),
            postProcess: postProcess || postProcessFactory(inflaters, zeroTotalApplies)
        };
    };
    SQLExternal.type = 'DATASET';
    return SQLExternal;
}(External));
