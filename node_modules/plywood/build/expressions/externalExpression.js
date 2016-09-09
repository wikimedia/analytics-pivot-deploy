var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as Q from 'q';
import { Expression } from "./baseExpression";
import { External } from "../external/baseExternal";
export var ExternalExpression = (function (_super) {
    __extends(ExternalExpression, _super);
    function ExternalExpression(parameters) {
        _super.call(this, parameters, dummyObject);
        var external = parameters.external;
        if (!external)
            throw new Error('must have an external');
        this.external = external;
        this._ensureOp('external');
        this.type = external.mode === 'value' ? 'NUMBER' : 'DATASET';
        this.simple = true;
    }
    ExternalExpression.fromJS = function (parameters) {
        var value = {
            op: parameters.op
        };
        value.external = External.fromJS(parameters.external);
        return new ExternalExpression(value);
    };
    ExternalExpression.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.external = this.external;
        return value;
    };
    ExternalExpression.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.external = this.external.toJS();
        return js;
    };
    ExternalExpression.prototype.toString = function () {
        return "E:" + this.external;
    };
    ExternalExpression.prototype.getFn = function () {
        throw new Error('should not call getFn on External');
    };
    ExternalExpression.prototype.getJS = function (datumVar) {
        throw new Error('should not call getJS on External');
    };
    ExternalExpression.prototype.getSQL = function (dialect) {
        throw new Error('should not call getSQL on External');
    };
    ExternalExpression.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.external.equals(other.external);
    };
    ExternalExpression.prototype._fillRefSubstitutions = function (typeContext, indexer, alterations) {
        indexer.index++;
        var external = this.external;
        if (external.mode === 'value') {
            return { type: 'NUMBER' };
        }
        else {
            var newTypeContext = this.external.getFullType();
            newTypeContext.parent = typeContext;
            return newTypeContext;
        }
    };
    ExternalExpression.prototype._computeResolvedSimulate = function (lastNode, simulatedQueries) {
        var external = this.external;
        if (external.suppress)
            return external;
        return external.simulateValue(lastNode, simulatedQueries);
    };
    ExternalExpression.prototype._computeResolved = function (lastNode) {
        var external = this.external;
        if (external.suppress)
            return Q(external);
        return external.queryValue(lastNode);
    };
    ExternalExpression.prototype.unsuppress = function () {
        var value = this.valueOf();
        value.external = this.external.show();
        return new ExternalExpression(value);
    };
    ExternalExpression.prototype.addAction = function (action) {
        var newExternal = this.external.addAction(action);
        if (!newExternal)
            return null;
        return new ExternalExpression({ external: newExternal });
    };
    ExternalExpression.prototype.maxPossibleSplitValues = function () {
        return Infinity;
    };
    return ExternalExpression;
}(Expression));
Expression.register(ExternalExpression);
