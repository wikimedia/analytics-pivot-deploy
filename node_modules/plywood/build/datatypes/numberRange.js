var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { isInstanceOf } from "immutable-class";
import { Range } from "./range";
function finiteOrNull(n) {
    return (isNaN(n) || isFinite(n)) ? n : null;
}
var check;
export var NumberRange = (function (_super) {
    __extends(NumberRange, _super);
    function NumberRange(parameters) {
        if (isNaN(parameters.start))
            throw new TypeError('`start` must be a number');
        if (isNaN(parameters.end))
            throw new TypeError('`end` must be a number');
        _super.call(this, parameters.start, parameters.end, parameters.bounds);
    }
    NumberRange.isNumberRange = function (candidate) {
        return isInstanceOf(candidate, NumberRange);
    };
    NumberRange.numberBucket = function (num, size, offset) {
        var start = Math.floor((num - offset) / size) * size + offset;
        return new NumberRange({
            start: start,
            end: start + size,
            bounds: Range.DEFAULT_BOUNDS
        });
    };
    NumberRange.fromNumber = function (n) {
        return new NumberRange({ start: n, end: n, bounds: '[]' });
    };
    NumberRange.fromJS = function (parameters) {
        if (typeof parameters !== "object") {
            throw new Error("unrecognizable numberRange");
        }
        var start = parameters.start;
        var end = parameters.end;
        return new NumberRange({
            start: start === null ? null : finiteOrNull(Number(start)),
            end: end === null ? null : finiteOrNull(Number(end)),
            bounds: parameters.bounds
        });
    };
    NumberRange.prototype.valueOf = function () {
        return {
            start: this.start,
            end: this.end,
            bounds: this.bounds
        };
    };
    NumberRange.prototype.toJS = function () {
        var js = {
            start: this.start,
            end: this.end
        };
        if (this.bounds !== Range.DEFAULT_BOUNDS)
            js.bounds = this.bounds;
        return js;
    };
    NumberRange.prototype.toJSON = function () {
        return this.toJS();
    };
    NumberRange.prototype.equals = function (other) {
        return NumberRange.isNumberRange(other) && this._equalsHelper(other);
    };
    NumberRange.prototype.midpoint = function () {
        return (this.start + this.end) / 2;
    };
    NumberRange.type = 'NUMBER_RANGE';
    return NumberRange;
}(Range));
check = NumberRange;
Range.register(NumberRange);
