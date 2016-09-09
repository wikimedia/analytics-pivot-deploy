var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { hasOwnProperty } from "../helper/utils";
var CAST_TYPE_TO_FN = {
    TIME: {
        NUMBER: function (n) { return new Date(n); }
    },
    NUMBER: {
        TIME: function (n) { return Date.parse(n.toString()); },
        UNIVERSAL: function (s) { return Number(s); }
    },
    STRING: {
        UNIVERSAL: function (v) { return '' + v; }
    }
};
var CAST_TYPE_TO_JS = {
    TIME: {
        NUMBER: function (inputJS) { return ("new Date(" + inputJS + ")"); }
    },
    NUMBER: {
        UNIVERSAL: function (s) { return ("+(" + s + ")"); }
    },
    STRING: {
        UNIVERSAL: function (inputJS) { return ("('' + " + inputJS + ")"); }
    }
};
export var CastAction = (function (_super) {
    __extends(CastAction, _super);
    function CastAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this.outputType = parameters.outputType;
        this._ensureAction("cast");
        if (typeof this.outputType !== 'string') {
            throw new Error("`outputType` must be a string");
        }
    }
    CastAction.fromJS = function (parameters) {
        var value = Action.jsToValue(parameters);
        var outputType = parameters.outputType;
        if (!outputType && hasOwnProperty(parameters, 'castType')) {
            outputType = parameters.castType;
        }
        value.outputType = outputType;
        return new CastAction(value);
    };
    CastAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.outputType = this.outputType;
        return value;
    };
    CastAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.outputType = this.outputType;
        return js;
    };
    CastAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            this.outputType === other.outputType;
    };
    CastAction.prototype._toStringParameters = function (expressionString) {
        return [this.outputType];
    };
    CastAction.prototype.getNecessaryInputTypes = function () {
        var castType = this.outputType;
        return Object.keys(CAST_TYPE_TO_FN[castType]);
    };
    CastAction.prototype.getOutputType = function (inputType) {
        return this.outputType;
    };
    CastAction.prototype._fillRefSubstitutions = function () {
        var outputType = this.outputType;
        return {
            type: outputType
        };
    };
    CastAction.prototype._removeAction = function (inputType) {
        return this.outputType === inputType;
    };
    CastAction.prototype._foldWithPrevAction = function (prevAction) {
        if (prevAction.equals(this)) {
            return this;
        }
        return null;
    };
    CastAction.prototype._getFnHelper = function (inputType, inputFn) {
        var outputType = this.outputType;
        var caster = CAST_TYPE_TO_FN[outputType];
        var castFn = caster[inputType] || caster['UNIVERSAL'];
        if (!castFn)
            throw new Error("unsupported cast from " + inputType + " to '" + outputType + "'");
        return function (d, c) {
            var inV = inputFn(d, c);
            if (!inV)
                return null;
            return castFn(inV);
        };
    };
    CastAction.prototype._getJSHelper = function (inputType, inputJS) {
        var outputType = this.outputType;
        var castJS = CAST_TYPE_TO_JS[outputType];
        if (!castJS)
            throw new Error("unsupported cast type in getJS '" + outputType + "'");
        var js = castJS[inputType] || castJS['UNIVERSAL'];
        if (!js)
            throw new Error("unsupported combo in getJS of cast action: " + inputType + " to " + outputType);
        return js(inputJS);
    };
    CastAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        return dialect.castExpression(inputType, inputSQL, this.outputType);
    };
    return CastAction;
}(Action));
Action.register(CastAction);
