var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { ApplyAction } from "./applyAction";
export var SelectAction = (function (_super) {
    __extends(SelectAction, _super);
    function SelectAction(parameters) {
        if (parameters === void 0) { parameters = {}; }
        _super.call(this, parameters, dummyObject);
        this.attributes = parameters.attributes;
        this._ensureAction("select");
    }
    SelectAction.fromJS = function (parameters) {
        return new SelectAction({
            action: parameters.action,
            attributes: parameters.attributes
        });
    };
    SelectAction.prototype.valueOf = function () {
        var value = _super.prototype.valueOf.call(this);
        value.attributes = this.attributes;
        return value;
    };
    SelectAction.prototype.toJS = function () {
        var js = _super.prototype.toJS.call(this);
        js.attributes = this.attributes;
        return js;
    };
    SelectAction.prototype.equals = function (other) {
        return _super.prototype.equals.call(this, other) &&
            String(this.attributes) === String(other.attributes);
    };
    SelectAction.prototype._toStringParameters = function (expressionString) {
        return this.attributes;
    };
    SelectAction.prototype.getNecessaryInputTypes = function () {
        return 'DATASET';
    };
    SelectAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'DATASET';
    };
    SelectAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        var attributes = this.attributes;
        var datasetType = typeContext.datasetType;
        var newDatasetType = Object.create(null);
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attr = attributes_1[_i];
            var attrType = datasetType[attr];
            if (!attrType)
                throw new Error("unknown attribute '" + attr + "' in select");
            newDatasetType[attr] = attrType;
        }
        typeContext.datasetType = newDatasetType;
        return typeContext;
    };
    SelectAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        var attributes = this.attributes;
        return function (d, c) {
            var inV = inputFn(d, c);
            return inV ? inV.select(attributes) : null;
        };
    };
    SelectAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        throw new Error('can not be expressed as SQL directly');
    };
    SelectAction.prototype._foldWithPrevAction = function (prevAction) {
        var attributes = this.attributes;
        if (prevAction instanceof SelectAction) {
            return new SelectAction({
                attributes: prevAction.attributes.filter(function (a) { return attributes.indexOf(a) !== -1; })
            });
        }
        else if (prevAction instanceof ApplyAction) {
            if (attributes.indexOf(prevAction.name) === -1) {
                return this;
            }
        }
        return null;
    };
    return SelectAction;
}(Action));
Action.register(SelectAction);
