'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var walltimeRepack = require('walltime-repack');
var immutableClass = require('immutable-class');

var Timezone = (function () {
    function Timezone(timezone) {
        if (typeof timezone !== 'string') {
            throw new TypeError("timezone description must be a string");
        }
        if (timezone !== 'Etc/UTC') {
            walltimeRepack.WallTime.UTCToWallTime(new Date(0), timezone);
        }
        this.timezone = timezone;
    }
    Timezone.isTimezone = function (candidate) {
        return immutableClass.isInstanceOf(candidate, Timezone);
    };
    Timezone.fromJS = function (spec) {
        return new Timezone(spec);
    };
    Timezone.prototype.valueOf = function () {
        return this.timezone;
    };
    Timezone.prototype.toJS = function () {
        return this.timezone;
    };
    Timezone.prototype.toJSON = function () {
        return this.timezone;
    };
    Timezone.prototype.toString = function () {
        return this.timezone;
    };
    Timezone.prototype.equals = function (other) {
        return Timezone.isTimezone(other) &&
            this.timezone === other.timezone;
    };
    Timezone.prototype.isUTC = function () {
        return this.timezone === 'Etc/UTC';
    };
    Timezone.UTC = new Timezone('Etc/UTC');
    return Timezone;
}());

function adjustDay(day) {
    return (day + 6) % 7;
}
function floorTo(n, roundTo) {
    return Math.floor(n / roundTo) * roundTo;
}
function timeShifterFiller(tm) {
    var floor = tm.floor, shift = tm.shift;
    tm.ceil = function (dt, tz) {
        var floored = floor(dt, tz);
        if (floored.valueOf() === dt.valueOf())
            return dt;
        return shift(floored, tz, 1);
    };
    tm.move = tm.shift;
    return tm;
}
var second = timeShifterFiller({
    canonicalLength: 1000,
    siblings: 60,
    floor: function (dt, tz) {
        dt = new Date(dt.valueOf());
        dt.setUTCMilliseconds(0);
        return dt;
    },
    round: function (dt, roundTo, tz) {
        var cur = dt.getUTCSeconds();
        var adj = floorTo(cur, roundTo);
        if (cur !== adj)
            dt.setUTCSeconds(adj);
        return dt;
    },
    shift: function (dt, tz, step) {
        dt = new Date(dt.valueOf());
        dt.setUTCSeconds(dt.getUTCSeconds() + step);
        return dt;
    }
});
var minute = timeShifterFiller({
    canonicalLength: 60000,
    siblings: 60,
    floor: function (dt, tz) {
        dt = new Date(dt.valueOf());
        dt.setUTCSeconds(0, 0);
        return dt;
    },
    round: function (dt, roundTo, tz) {
        var cur = dt.getUTCMinutes();
        var adj = floorTo(cur, roundTo);
        if (cur !== adj)
            dt.setUTCMinutes(adj);
        return dt;
    },
    shift: function (dt, tz, step) {
        dt = new Date(dt.valueOf());
        dt.setUTCMinutes(dt.getUTCMinutes() + step);
        return dt;
    }
});
function hourMove(dt, tz, step) {
    if (tz.isUTC()) {
        dt = new Date(dt.valueOf());
        dt.setUTCHours(dt.getUTCHours() + step);
    }
    else {
        var wt = walltimeRepack.WallTime.UTCToWallTime(dt, tz.toString());
        dt = walltimeRepack.WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate(), wt.getHours() + step, wt.getMinutes(), wt.getSeconds(), wt.getMilliseconds());
    }
    return dt;
}
var hour = timeShifterFiller({
    canonicalLength: 3600000,
    siblings: 24,
    floor: function (dt, tz) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCMinutes(0, 0, 0);
        }
        else {
            var wt = walltimeRepack.WallTime.UTCToWallTime(dt, tz.toString());
            dt = walltimeRepack.WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate(), wt.getHours(), 0, 0, 0);
        }
        return dt;
    },
    round: function (dt, roundTo, tz) {
        if (tz.isUTC()) {
            var cur = dt.getUTCHours();
            var adj = floorTo(cur, roundTo);
            if (cur !== adj)
                dt.setUTCHours(adj);
        }
        else {
            var wt = walltimeRepack.WallTime.UTCToWallTime(dt, tz.toString());
            var cur = wt.getHours();
            var adj = floorTo(cur, roundTo);
            if (cur !== adj)
                return hourMove(dt, tz, adj - cur);
        }
        return dt;
    },
    shift: hourMove
});
var day = timeShifterFiller({
    canonicalLength: 24 * 3600000,
    floor: function (dt, tz) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCHours(0, 0, 0, 0);
        }
        else {
            var wt = walltimeRepack.WallTime.UTCToWallTime(dt, tz.toString());
            dt = walltimeRepack.WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate(), 0, 0, 0, 0);
        }
        return dt;
    },
    shift: function (dt, tz, step) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCDate(dt.getUTCDate() + step);
        }
        else {
            var wt = walltimeRepack.WallTime.UTCToWallTime(dt, tz.toString());
            dt = walltimeRepack.WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate() + step, wt.getHours(), wt.getMinutes(), wt.getSeconds(), wt.getMilliseconds());
        }
        return dt;
    }
});
var week = timeShifterFiller({
    canonicalLength: 7 * 24 * 3600000,
    floor: function (dt, tz) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCHours(0, 0, 0, 0);
            dt.setUTCDate(dt.getUTCDate() - adjustDay(dt.getUTCDay()));
        }
        else {
            var wt = walltimeRepack.WallTime.UTCToWallTime(dt, tz.toString());
            dt = walltimeRepack.WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate() - adjustDay(wt.getDay()), 0, 0, 0, 0);
        }
        return dt;
    },
    shift: function (dt, tz, step) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCDate(dt.getUTCDate() + step * 7);
        }
        else {
            var wt = walltimeRepack.WallTime.UTCToWallTime(dt, tz.toString());
            dt = walltimeRepack.WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate() + step * 7, wt.getHours(), wt.getMinutes(), wt.getSeconds(), wt.getMilliseconds());
        }
        return dt;
    }
});
function monthShift(dt, tz, step) {
    if (tz.isUTC()) {
        dt = new Date(dt.valueOf());
        dt.setUTCMonth(dt.getUTCMonth() + step);
    }
    else {
        var wt = walltimeRepack.WallTime.UTCToWallTime(dt, tz.toString());
        dt = walltimeRepack.WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth() + step, wt.getDate(), wt.getHours(), wt.getMinutes(), wt.getSeconds(), wt.getMilliseconds());
    }
    return dt;
}
var month = timeShifterFiller({
    canonicalLength: 30 * 24 * 3600000,
    siblings: 12,
    floor: function (dt, tz) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCHours(0, 0, 0, 0);
            dt.setUTCDate(1);
        }
        else {
            var wt = walltimeRepack.WallTime.UTCToWallTime(dt, tz.toString());
            dt = walltimeRepack.WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), 1, 0, 0, 0, 0);
        }
        return dt;
    },
    round: function (dt, roundTo, tz) {
        if (tz.isUTC()) {
            var cur = dt.getUTCMonth();
            var adj = floorTo(cur, roundTo);
            if (cur !== adj)
                dt.setUTCMonth(adj);
        }
        else {
            var cur = dt.getMonth();
            var adj = floorTo(cur, roundTo);
            if (cur !== adj)
                return monthShift(dt, tz, adj - cur);
        }
        return dt;
    },
    shift: monthShift
});
function yearShift(dt, tz, step) {
    if (tz.isUTC()) {
        dt = new Date(dt.valueOf());
        dt.setUTCFullYear(dt.getUTCFullYear() + step);
    }
    else {
        var wt = walltimeRepack.WallTime.UTCToWallTime(dt, tz.toString());
        dt = walltimeRepack.WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear() + step, wt.getMonth(), wt.getDate(), wt.getHours(), wt.getMinutes(), wt.getSeconds(), wt.getMilliseconds());
    }
    return dt;
}
var year = timeShifterFiller({
    canonicalLength: 365 * 24 * 3600000,
    siblings: 1000,
    floor: function (dt, tz) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCHours(0, 0, 0, 0);
            dt.setUTCMonth(0, 1);
        }
        else {
            var wt = walltimeRepack.WallTime.UTCToWallTime(dt, tz.toString());
            dt = walltimeRepack.WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), 0, 1, 0, 0, 0, 0);
        }
        return dt;
    },
    round: function (dt, roundTo, tz) {
        if (tz.isUTC()) {
            var cur = dt.getUTCFullYear();
            var adj = floorTo(cur, roundTo);
            if (cur !== adj)
                dt.setUTCFullYear(adj);
        }
        else {
            var cur = dt.getFullYear();
            var adj = floorTo(cur, roundTo);
            if (cur !== adj)
                return yearShift(dt, tz, adj - cur);
        }
        return dt;
    },
    shift: yearShift
});
var shifters = {
    second: second,
    minute: minute,
    hour: hour,
    day: day,
    week: week,
    month: month,
    year: year
};

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
var Duration = (function () {
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
        return immutableClass.isInstanceOf(candidate, Duration);
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

function parseYear(v) {
    if (v.length === 2) {
        var vn = parseInt(v, 10);
        return (vn < 70 ? 2000 : 1900) + vn;
    }
    else if (v.length === 4) {
        return parseInt(v, 10);
    }
    else {
        throw new Error('Invalid year in date');
    }
}
function parseMonth(v) {
    var vn = parseInt(v, 10);
    if (vn <= 0 || 12 < vn)
        throw new Error('Invalid month in date');
    return vn - 1;
}
function parseDay(v) {
    var vn = parseInt(v, 10);
    if (vn <= 0 || 31 < vn)
        throw new Error('Invalid day in date');
    return vn;
}
function parseHour(v) {
    var vn = parseInt(v, 10);
    if (vn < 0 || 24 < vn)
        throw new Error('Invalid hour in date');
    return vn;
}
function parseMinute(v) {
    var vn = parseInt(v, 10);
    if (vn < 0 || 60 < vn)
        throw new Error('Invalid minute in date');
    return vn;
}
function parseSecond(v) {
    var vn = parseInt(v, 10);
    if (vn < 0 || 60 < vn)
        throw new Error('Invalid second in date');
    return vn;
}
function parseMillisecond(v) {
    if (!v)
        return 0;
    return parseInt(v.substr(0, 3), 10);
}
function parseSQLDate(type, v) {
    if (type === 't')
        throw new Error('time literals are not supported');
    var m;
    var d;
    if (type === 'ts') {
        if (m = v.match(/^(\d{2}(?:\d{2})?)(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)) {
            d = Date.UTC(parseYear(m[1]), parseMonth(m[2]), parseDay(m[3]), parseHour(m[4]), parseMinute(m[5]), parseSecond(m[6]));
        }
        else if (m = v.match(/^(\d{2}(?:\d{2})?)[~!@#$%^&*()_+=:.\-\/](\d{1,2})[~!@#$%^&*()_+=:.\-\/](\d{1,2})[T ](\d{1,2})[~!@#$%^&*()_+=:.\-\/](\d{1,2})[~!@#$%^&*()_+=:.\-\/](\d{1,2})(?:\.(\d{1,6}))?$/)) {
            d = Date.UTC(parseYear(m[1]), parseMonth(m[2]), parseDay(m[3]), parseHour(m[4]), parseMinute(m[5]), parseSecond(m[6]), parseMillisecond(m[7]));
        }
        else {
            throw new Error('Invalid timestamp');
        }
    }
    else {
        if (m = v.match(/^(\d{2}(?:\d{2})?)(\d{2})(\d{2})$/)) {
            d = Date.UTC(parseYear(m[1]), parseMonth(m[2]), parseDay(m[3]));
        }
        else if (m = v.match(/^(\d{2}(?:\d{2})?)[~!@#$%^&*()_+=:.\-\/](\d{1,2})[~!@#$%^&*()_+=:.\-\/](\d{1,2})$/)) {
            d = Date.UTC(parseYear(m[1]), parseMonth(m[2]), parseDay(m[3]));
        }
        else {
            throw new Error('Invalid date');
        }
    }
    return new Date(d);
}
var numericKeys = [1, 4, 5, 6, 10, 11];
function parseISODate(date, timezone) {
    if (timezone === void 0) { timezone = Timezone.UTC; }
    var struct;
    var minutesOffset = 0;
    if ((struct = /^(\d{4}|[+\-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2})(?::?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?)?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?$/.exec(date))) {
        for (var i = 0, k; (k = numericKeys[i]); ++i) {
            struct[k] = +struct[k] || 0;
        }
        struct[2] = (+struct[2] || 1) - 1;
        struct[3] = +struct[3] || 1;
        struct[7] = struct[7] ? +(struct[7] + "00").substr(0, 3) : 0;
        if ((struct[8] === undefined || struct[8] === '') && (struct[9] === undefined || struct[9] === '') && !Timezone.UTC.equals(timezone)) {
            if (timezone === null) {
                return new Date(struct[1], struct[2], struct[3], struct[4], struct[5], struct[6], struct[7]);
            }
            else {
                return walltimeRepack.WallTime.WallTimeToUTC(timezone.toString(), struct[1], struct[2], struct[3], struct[4], struct[5], struct[6], struct[7]);
            }
        }
        else {
            if (struct[8] !== 'Z' && struct[9] !== undefined) {
                minutesOffset = struct[10] * 60 + struct[11];
                if (struct[9] === '+') {
                    minutesOffset = 0 - minutesOffset;
                }
            }
            return new Date(Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]));
        }
    }
    else {
        return null;
    }
}
function parseInterval(str, timezone, now) {
    if (timezone === void 0) { timezone = Timezone.UTC; }
    if (now === void 0) { now = new Date(); }
    var parts = str.split('/');
    if (parts.length > 2)
        throw new Error("Can not parse string " + str);
    var start = null;
    var end = null;
    var duration = null;
    var p0 = parts[0];
    if (parts.length === 1) {
        duration = Duration.fromJS(p0);
    }
    else {
        var p1 = parts[1];
        if (p0[0] === 'P') {
            duration = Duration.fromJS(p0);
            end = parseISODate(p1, timezone);
            if (!end)
                throw new Error("can not parse '" + p1 + "' as ISO date");
        }
        else if (p1[0] === 'P') {
            start = parseISODate(p0, timezone);
            if (!start)
                throw new Error("can not parse '" + p0 + "' as ISO date");
            duration = Duration.fromJS(p1);
        }
        else {
            start = parseISODate(p0, timezone);
            if (!start)
                throw new Error("can not parse '" + p0 + "' as ISO date");
            end = parseISODate(p1, timezone);
            if (!end)
                throw new Error("can not parse '" + p1 + "' as ISO date");
            if (end < start) {
                throw new Error("start must be <= end in '" + str + "'");
            }
        }
    }
    var computedStart;
    var computedEnd;
    if (start) {
        computedStart = start;
        if (duration) {
            computedEnd = duration.shift(computedStart, timezone, 1);
        }
        else {
            computedEnd = end;
        }
    }
    else {
        computedEnd = end || now;
        computedStart = duration.shift(computedEnd, timezone, -1);
    }
    return {
        computedStart: computedStart,
        computedEnd: computedEnd,
        start: start,
        end: end,
        duration: duration
    };
}

function isDate(d) {
    return !!(d && d.toISOString);
}

var WallTime$1 = walltimeRepack.WallTime;

exports.WallTime = WallTime$1;
exports.parseSQLDate = parseSQLDate;
exports.parseISODate = parseISODate;
exports.parseInterval = parseInterval;
exports.second = second;
exports.minute = minute;
exports.hour = hour;
exports.day = day;
exports.week = week;
exports.month = month;
exports.year = year;
exports.shifters = shifters;
exports.Timezone = Timezone;
exports.Duration = Duration;
exports.isDate = isDate;