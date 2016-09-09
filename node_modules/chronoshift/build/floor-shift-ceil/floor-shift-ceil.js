import { WallTime } from 'walltime-repack';
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
export var second = timeShifterFiller({
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
export var minute = timeShifterFiller({
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
        var wt = WallTime.UTCToWallTime(dt, tz.toString());
        dt = WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate(), wt.getHours() + step, wt.getMinutes(), wt.getSeconds(), wt.getMilliseconds());
    }
    return dt;
}
export var hour = timeShifterFiller({
    canonicalLength: 3600000,
    siblings: 24,
    floor: function (dt, tz) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCMinutes(0, 0, 0);
        }
        else {
            var wt = WallTime.UTCToWallTime(dt, tz.toString());
            dt = WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate(), wt.getHours(), 0, 0, 0);
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
            var wt = WallTime.UTCToWallTime(dt, tz.toString());
            var cur = wt.getHours();
            var adj = floorTo(cur, roundTo);
            if (cur !== adj)
                return hourMove(dt, tz, adj - cur);
        }
        return dt;
    },
    shift: hourMove
});
export var day = timeShifterFiller({
    canonicalLength: 24 * 3600000,
    floor: function (dt, tz) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCHours(0, 0, 0, 0);
        }
        else {
            var wt = WallTime.UTCToWallTime(dt, tz.toString());
            dt = WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate(), 0, 0, 0, 0);
        }
        return dt;
    },
    shift: function (dt, tz, step) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCDate(dt.getUTCDate() + step);
        }
        else {
            var wt = WallTime.UTCToWallTime(dt, tz.toString());
            dt = WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate() + step, wt.getHours(), wt.getMinutes(), wt.getSeconds(), wt.getMilliseconds());
        }
        return dt;
    }
});
export var week = timeShifterFiller({
    canonicalLength: 7 * 24 * 3600000,
    floor: function (dt, tz) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCHours(0, 0, 0, 0);
            dt.setUTCDate(dt.getUTCDate() - adjustDay(dt.getUTCDay()));
        }
        else {
            var wt = WallTime.UTCToWallTime(dt, tz.toString());
            dt = WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate() - adjustDay(wt.getDay()), 0, 0, 0, 0);
        }
        return dt;
    },
    shift: function (dt, tz, step) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCDate(dt.getUTCDate() + step * 7);
        }
        else {
            var wt = WallTime.UTCToWallTime(dt, tz.toString());
            dt = WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), wt.getDate() + step * 7, wt.getHours(), wt.getMinutes(), wt.getSeconds(), wt.getMilliseconds());
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
        var wt = WallTime.UTCToWallTime(dt, tz.toString());
        dt = WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth() + step, wt.getDate(), wt.getHours(), wt.getMinutes(), wt.getSeconds(), wt.getMilliseconds());
    }
    return dt;
}
export var month = timeShifterFiller({
    canonicalLength: 30 * 24 * 3600000,
    siblings: 12,
    floor: function (dt, tz) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCHours(0, 0, 0, 0);
            dt.setUTCDate(1);
        }
        else {
            var wt = WallTime.UTCToWallTime(dt, tz.toString());
            dt = WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), wt.getMonth(), 1, 0, 0, 0, 0);
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
        var wt = WallTime.UTCToWallTime(dt, tz.toString());
        dt = WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear() + step, wt.getMonth(), wt.getDate(), wt.getHours(), wt.getMinutes(), wt.getSeconds(), wt.getMilliseconds());
    }
    return dt;
}
export var year = timeShifterFiller({
    canonicalLength: 365 * 24 * 3600000,
    siblings: 1000,
    floor: function (dt, tz) {
        if (tz.isUTC()) {
            dt = new Date(dt.valueOf());
            dt.setUTCHours(0, 0, 0, 0);
            dt.setUTCMonth(0, 1);
        }
        else {
            var wt = WallTime.UTCToWallTime(dt, tz.toString());
            dt = WallTime.WallTimeToUTC(tz.toString(), wt.getFullYear(), 0, 1, 0, 0, 0, 0);
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
export var shifters = {
    second: second,
    minute: minute,
    hour: hour,
    day: day,
    week: week,
    month: month,
    year: year
};
