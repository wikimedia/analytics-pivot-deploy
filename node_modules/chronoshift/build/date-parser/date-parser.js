import { WallTime } from 'walltime-repack';
import { Timezone } from '../timezone/timezone';
import { Duration } from '../duration/duration';
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
export function parseSQLDate(type, v) {
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
export function parseISODate(date, timezone) {
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
                return WallTime.WallTimeToUTC(timezone.toString(), struct[1], struct[2], struct[3], struct[4], struct[5], struct[6], struct[7]);
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
export function parseInterval(str, timezone, now) {
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
