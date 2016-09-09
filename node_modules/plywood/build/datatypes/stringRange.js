var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { isInstanceOf } from "immutable-class";
import { Range } from "./range";
var check;
export var StringRange = (function (_super) {
    __extends(StringRange, _super);
    function StringRange(parameters) {
        var start = parameters.start, end = parameters.end;
        if (typeof start !== 'string' && start !== null)
            throw new TypeError('`start` must be a string');
        if (typeof end !== 'string' && end !== null)
            throw new TypeError('`end` must be a string');
        _super.call(this, start, end, parameters.bounds);
    }
    StringRange.isStringRange = function (candidate) {
        return isInstanceOf(candidate, StringRange);
    };
    StringRange.fromString = function (s) {
        return new StringRange({ start: s, end: s, bounds: '[]' });
    };
    StringRange.fromJS = function (parameters) {
        if (typeof parameters !== "object") {
            throw new Error("unrecognizable StringRange");
        }
        var start = parameters.start;
        var end = parameters.end;
        var bounds = parameters.bounds;
        return new StringRange({
            start: start, end: end, bounds: bounds
        });
    };
    StringRange.prototype.valueOf = function () {
        return {
            start: this.start,
            end: this.end,
            bounds: this.bounds
        };
    };
    StringRange.prototype.toJS = function () {
        var js = {
            start: this.start,
            end: this.end
        };
        if (this.bounds !== Range.DEFAULT_BOUNDS)
            js.bounds = this.bounds;
        return js;
    };
    StringRange.prototype.toJSON = function () {
        return this.toJS();
    };
    StringRange.prototype.equals = function (other) {
        return StringRange.isStringRange(other) && this._equalsHelper(other);
    };
    StringRange.prototype.midpoint = function () {
        throw new Error("midpoint not supported in string range");
    };
    StringRange.prototype._zeroEndpoint = function () {
        return "";
    };
    StringRange.type = 'STRING_RANGE';
    return StringRange;
}(Range));
check = StringRange;
Range.register(StringRange);
