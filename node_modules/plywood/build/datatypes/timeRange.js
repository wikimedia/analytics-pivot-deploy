var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { parseISODate } from "chronoshift";
import { isInstanceOf } from "immutable-class";
import { Range } from "./range";
import { Expression } from "../expressions/baseExpression";
function toDate(date, name) {
    if (date === null)
        return null;
    if (typeof date === "undefined")
        throw new TypeError("timeRange must have a " + name);
    if (typeof date === 'string' || typeof date === 'number')
        date = parseISODate(date, Expression.defaultParserTimezone);
    if (!date.getDay)
        throw new TypeError("timeRange must have a " + name + " that is a Date");
    return date;
}
var START_OF_TIME = "1000";
var END_OF_TIME = "3000";
function dateToIntervalPart(date) {
    return date.toISOString()
        .replace('.000Z', 'Z')
        .replace(':00Z', 'Z')
        .replace(':00Z', 'Z');
}
var check;
export var TimeRange = (function (_super) {
    __extends(TimeRange, _super);
    function TimeRange(parameters) {
        _super.call(this, parameters.start, parameters.end, parameters.bounds);
    }
    TimeRange.isTimeRange = function (candidate) {
        return isInstanceOf(candidate, TimeRange);
    };
    TimeRange.intervalFromDate = function (date) {
        return dateToIntervalPart(date) + '/' + dateToIntervalPart(new Date(date.valueOf() + 1));
    };
    TimeRange.timeBucket = function (date, duration, timezone) {
        if (!date)
            return null;
        var start = duration.floor(date, timezone);
        return new TimeRange({
            start: start,
            end: duration.shift(start, timezone, 1),
            bounds: Range.DEFAULT_BOUNDS
        });
    };
    TimeRange.fromTime = function (t) {
        return new TimeRange({ start: t, end: t, bounds: '[]' });
    };
    TimeRange.fromJS = function (parameters) {
        if (typeof parameters !== "object") {
            throw new Error("unrecognizable timeRange");
        }
        return new TimeRange({
            start: toDate(parameters.start, 'start'),
            end: toDate(parameters.end, 'end'),
            bounds: parameters.bounds
        });
    };
    TimeRange.prototype._zeroEndpoint = function () {
        return new Date(0);
    };
    TimeRange.prototype._endpointEqual = function (a, b) {
        if (a === null) {
            return b === null;
        }
        else {
            return b !== null && a.valueOf() === b.valueOf();
        }
    };
    TimeRange.prototype._endpointToString = function (a) {
        if (!a)
            return 'null';
        return a.toISOString();
    };
    TimeRange.prototype.valueOf = function () {
        return {
            start: this.start,
            end: this.end,
            bounds: this.bounds
        };
    };
    TimeRange.prototype.toJS = function () {
        var js = {
            start: this.start,
            end: this.end
        };
        if (this.bounds !== Range.DEFAULT_BOUNDS)
            js.bounds = this.bounds;
        return js;
    };
    TimeRange.prototype.toJSON = function () {
        return this.toJS();
    };
    TimeRange.prototype.equals = function (other) {
        return TimeRange.isTimeRange(other) && this._equalsHelper(other);
    };
    TimeRange.prototype.toInterval = function () {
        var _a = this, start = _a.start, end = _a.end, bounds = _a.bounds;
        var interval = [START_OF_TIME, END_OF_TIME];
        if (start) {
            if (bounds[0] === '(')
                start = new Date(start.valueOf() + 1);
            interval[0] = dateToIntervalPart(start);
        }
        if (end) {
            if (bounds[1] === ']')
                end = new Date(end.valueOf() + 1);
            interval[1] = dateToIntervalPart(end);
        }
        return interval.join("/");
    };
    TimeRange.prototype.midpoint = function () {
        return new Date((this.start.valueOf() + this.end.valueOf()) / 2);
    };
    TimeRange.prototype.isAligned = function (duration, timezone) {
        var _a = this, start = _a.start, end = _a.end;
        return (!start || duration.isAligned(start, timezone)) && (!end || duration.isAligned(end, timezone));
    };
    TimeRange.type = 'TIME_RANGE';
    return TimeRange;
}(Range));
check = TimeRange;
Range.register(TimeRange);
