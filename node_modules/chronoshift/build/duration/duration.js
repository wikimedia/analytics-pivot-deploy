import { isInstanceOf } from 'immutable-class';
import { shifters, second } from '../floor-shift-ceil/floor-shift-ceil';
var spansWithWeek = ["year", "month", "week", "day", "hour", "minute", "second"];
var spansWithoutWeek = ["year", "month", "day", "hour", "minute", "second"];
function capitalizeFirst(str) {
    if (!str.length)
        return str;
    return str[0].toUpperCase() + str.substr(1);
}
var periodWeekRegExp = /^P(\d+)W$/;
var periodRegExp = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
function getSpansFromString(durationStr) {
    var spans = {};
    var matches;
    if (matches = periodWeekRegExp.exec(durationStr)) {
        spans.week = Number(matches[1]);
        if (!spans.week)
            throw new Error("Duration can not be empty");
    }
    else if (matches = periodRegExp.exec(durationStr)) {
        var nums = matches.map(Number);
        for (var i = 0; i < spansWithoutWeek.length; i++) {
            var span = spansWithoutWeek[i];
            var value = nums[i + 1];
            if (value)
                spans[span] = value;
        }
    }
    else {
        throw new Error("Can not parse duration '" + durationStr + "'");
    }
    return spans;
}
function getSpansFromStartEnd(start, end, timezone) {
    start = second.floor(start, timezone);
    end = second.floor(end, timezone);
    if (end <= start)
        throw new Error("start must come before end");
    var spans = {};
    var iterator = start;
    for (var i = 0; i < spansWithoutWeek.length; i++) {
        var span = spansWithoutWeek[i];
        var spanCount = 0;
        var length = end.valueOf() - iterator.valueOf();
        var canonicalLength = shifters[span].canonicalLength;
        if (length < canonicalLength / 4)
            continue;
        var numberToFit = Math.min(0, Math.floor(length / canonicalLength) - 1);
        var iteratorMove;
        if (numberToFit > 0) {
            iteratorMove = shifters[span].shift(iterator, timezone, numberToFit);
            if (iteratorMove <= end) {
                spanCount += numberToFit;
                iterator = iteratorMove;
            }
        }
        while (true) {
            iteratorMove = shifters[span].shift(iterator, timezone, 1);
            if (iteratorMove <= end) {
                iterator = iteratorMove;
                spanCount++;
            }
            else {
                break;
            }
        }
        if (spanCount) {
            spans[span] = spanCount;
        }
    }
    return spans;
}
function removeZeros(spans) {
    var newSpans = {};
    for (var i = 0; i < spansWithWeek.length; i++) {
        var span = spansWithWeek[i];
        if (spans[span] > 0) {
            newSpans[span] = spans[span];
        }
    }
    return newSpans;
}
var check;
export var Duration = (function () {
    function Duration(spans, end, timezone) {
        if (spans && end && timezone) {
            spans = getSpansFromStartEnd(spans, end, timezone);
        }
        else if (typeof spans === 'object') {
            spans = removeZeros(spans);
        }
        else {
            throw new Error("new Duration called with bad argument");
        }
        var usedSpans = Object.keys(spans);
        if (!usedSpans.length)
            throw new Error("Duration can not be empty");
        if (usedSpans.length === 1) {
            this.singleSpan = usedSpans[0];
        }
        else if (spans.week) {
            throw new Error("Can not mix 'week' and other spans");
        }
        this.spans = spans;
    }
    Duration.fromJS = function (durationStr) {
        if (typeof durationStr !== 'string')
            throw new TypeError("Duration JS must be a string");
        return new Duration(getSpansFromString(durationStr));
    };
    Duration.fromCanonicalLength = function (length) {
        var spans = {};
        for (var i = 0; i < spansWithWeek.length; i++) {
            var span = spansWithWeek[i];
            var spanLength = shifters[span].canonicalLength;
            var count = Math.floor(length / spanLength);
            length -= spanLength * count;
            spans[span] = count;
        }
        return new Duration(spans);
    };
    Duration.isDuration = function (candidate) {
        return isInstanceOf(candidate, Duration);
    };
    Duration.prototype.toString = function () {
        var strArr = ["P"];
        var spans = this.spans;
        if (spans.week) {
            strArr.push(String(spans.week), 'W');
        }
        else {
            var addedT = false;
            for (var i = 0; i < spansWithoutWeek.length; i++) {
                var span = spansWithoutWeek[i];
                var value = spans[span];
                if (!value)
                    continue;
                if (!addedT && i >= 3) {
                    strArr.push("T");
                    addedT = true;
                }
                strArr.push(String(value), span[0].toUpperCase());
            }
        }
        return strArr.join("");
    };
    Duration.prototype.add = function (duration) {
        return Duration.fromCanonicalLength(this.getCanonicalLength() + duration.getCanonicalLength());
    };
    Duration.prototype.subtract = function (duration) {
        var newCanonicalDuration = this.getCanonicalLength() - duration.getCanonicalLength();
        if (newCanonicalDuration < 0)
            throw new Error("A duration can not be negative.");
        return Duration.fromCanonicalLength(newCanonicalDuration);
    };
    Duration.prototype.valueOf = function () {
        return this.spans;
    };
    Duration.prototype.toJS = function () {
        return this.toString();
    };
    Duration.prototype.toJSON = function () {
        return this.toString();
    };
    Duration.prototype.equals = function (other) {
        return Boolean(other) &&
            this.toString() === other.toString();
    };
    Duration.prototype.isSimple = function () {
        var singleSpan = this.singleSpan;
        if (!singleSpan)
            return false;
        return this.spans[singleSpan] === 1;
    };
    Duration.prototype.isFloorable = function () {
        var singleSpan = this.singleSpan;
        if (!singleSpan)
            return false;
        var span = this.spans[singleSpan];
        if (span === 1)
            return true;
        var siblings = shifters[singleSpan].siblings;
        if (!siblings)
            return false;
        return siblings % span === 0;
    };
    Duration.prototype.floor = function (date, timezone) {
        var singleSpan = this.singleSpan;
        if (!singleSpan)
            throw new Error("Can not floor on a complex duration");
        var span = this.spans[singleSpan];
        var mover = shifters[singleSpan];
        var dt = mover.floor(date, timezone);
        if (span !== 1) {
            if (!mover.siblings)
                throw new Error("Can not floor on a " + singleSpan + " duration that is not 1");
            if (mover.siblings % span !== 0)
                throw new Error("Can not floor on a " + singleSpan + " duration that does not divide into " + mover.siblings);
            dt = mover.round(dt, span, timezone);
        }
        return dt;
    };
    Duration.prototype.shift = function (date, timezone, step) {
        if (step === void 0) { step = 1; }
        var spans = this.spans;
        for (var _i = 0, spansWithWeek_1 = spansWithWeek; _i < spansWithWeek_1.length; _i++) {
            var span = spansWithWeek_1[_i];
            var value = spans[span];
            if (value)
                date = shifters[span].shift(date, timezone, step * value);
        }
        return date;
    };
    Duration.prototype.materialize = function (start, end, timezone, step) {
        if (step === void 0) { step = 1; }
        var values = [];
        var iter = this.floor(start, timezone);
        while (iter <= end) {
            values.push(iter);
            iter = this.shift(iter, timezone, step);
        }
        return values;
    };
    Duration.prototype.isAligned = function (date, timezone) {
        return this.floor(date, timezone).valueOf() === date.valueOf();
    };
    Duration.prototype.dividesBy = function (smaller) {
        var myCanonicalLength = this.getCanonicalLength();
        var smallerCanonicalLength = smaller.getCanonicalLength();
        return myCanonicalLength % smallerCanonicalLength === 0 && this.isFloorable() && smaller.isFloorable();
    };
    Duration.prototype.getCanonicalLength = function () {
        var spans = this.spans;
        var length = 0;
        for (var _i = 0, spansWithWeek_2 = spansWithWeek; _i < spansWithWeek_2.length; _i++) {
            var span = spansWithWeek_2[_i];
            var value = spans[span];
            if (value)
                length += value * shifters[span].canonicalLength;
        }
        return length;
    };
    Duration.prototype.getDescription = function (capitalize) {
        var spans = this.spans;
        var description = [];
        for (var _i = 0, spansWithWeek_3 = spansWithWeek; _i < spansWithWeek_3.length; _i++) {
            var span = spansWithWeek_3[_i];
            var value = spans[span];
            var spanTitle = capitalize ? capitalizeFirst(span) : span;
            if (value) {
                if (value === 1) {
                    description.push(spanTitle);
                }
                else {
                    description.push(String(value) + ' ' + spanTitle + 's');
                }
            }
        }
        return description.join(', ');
    };
    Duration.prototype.getSingleSpan = function () {
        return this.singleSpan || null;
    };
    Duration.prototype.getSingleSpanValue = function () {
        if (!this.singleSpan)
            return null;
        return this.spans[this.singleSpan] || null;
    };
    return Duration;
}());
check = Duration;
