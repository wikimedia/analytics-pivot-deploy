var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Action } from "./baseAction";
import { hasOwnProperty } from "../helper/utils";
export var JoinAction = (function (_super) {
    __extends(JoinAction, _super);
    function JoinAction(parameters) {
        _super.call(this, parameters, dummyObject);
        this._ensureAction("join");
        if (!this.expression.canHaveType('DATASET'))
            throw new TypeError('expression must be a DATASET');
    }
    JoinAction.fromJS = function (parameters) {
        return new JoinAction(Action.jsToValue(parameters));
    };
    JoinAction.prototype.getNecessaryInputTypes = function () {
        return 'DATASET';
    };
    JoinAction.prototype.getOutputType = function (inputType) {
        this._checkInputTypes(inputType);
        return 'DATASET';
    };
    JoinAction.prototype._fillRefSubstitutions = function (typeContext, inputType, indexer, alterations) {
        var typeContextParent = typeContext.parent;
        var expressionFullType = this.expression._fillRefSubstitutions(typeContextParent, indexer, alterations);
        var inputDatasetType = typeContext.datasetType;
        var expressionDatasetType = expressionFullType.datasetType;
        var newDatasetType = Object.create(null);
        for (var k in inputDatasetType) {
            newDatasetType[k] = inputDatasetType[k];
        }
        for (var k in expressionDatasetType) {
            var ft = expressionDatasetType[k];
            if (hasOwnProperty(newDatasetType, k)) {
                if (newDatasetType[k].type !== ft.type) {
                    throw new Error("incompatible types of joins on " + k + " between " + newDatasetType[k].type + " and " + ft.type);
                }
            }
            else {
                newDatasetType[k] = ft;
            }
        }
        return {
            parent: typeContextParent,
            type: 'DATASET',
            datasetType: newDatasetType,
            remote: typeContext.remote || expressionFullType.remote
        };
    };
    JoinAction.prototype._getFnHelper = function (inputType, inputFn, expressionFn) {
        return function (d, c) {
            var inV = inputFn(d, c);
            return inV ? inV.join(expressionFn(d, c)) : inV;
        };
    };
    JoinAction.prototype._getSQLHelper = function (inputType, dialect, inputSQL, expressionSQL) {
        throw new Error('not possible');
    };
    return JoinAction;
}(Action));
Action.register(JoinAction);
