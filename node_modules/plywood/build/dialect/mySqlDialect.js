var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { SQLDialect } from "./baseDialect";
export var MySQLDialect = (function (_super) {
    __extends(MySQLDialect, _super);
    function MySQLDialect() {
        _super.call(this);
    }
    MySQLDialect.prototype.escapeName = function (name) {
        name = name.replace(/`/g, '``');
        return '`' + name + '`';
    };
    MySQLDialect.prototype.escapeLiteral = function (name) {
        if (name === null)
            return 'NULL';
        return JSON.stringify(name);
    };
    MySQLDialect.prototype.timeToSQL = function (date) {
        if (!date)
            return 'NULL';
        return "TIMESTAMP('" + this.dateToSQLDateString(date) + "')";
    };
    MySQLDialect.prototype.concatExpression = function (a, b) {
        return "CONCAT(" + a + "," + b + ")";
    };
    MySQLDialect.prototype.containsExpression = function (a, b) {
        return "LOCATE(" + a + "," + b + ")>0";
    };
    MySQLDialect.prototype.lengthExpression = function (a) {
        return "CHAR_LENGTH(" + a + ")";
    };
    MySQLDialect.prototype.isNotDistinctFromExpression = function (a, b) {
        return "(" + a + "<=>" + b + ")";
    };
    MySQLDialect.prototype.regexpExpression = function (expression, regexp) {
        return "(" + expression + " REGEXP '" + regexp + "')";
    };
    MySQLDialect.prototype.castExpression = function (inputType, operand, cast) {
        var castFunction = MySQLDialect.CAST_TO_FUNCTION[cast][inputType];
        if (!castFunction)
            throw new Error("unsupported cast from " + inputType + " to " + cast + " in MySQL dialect");
        return castFunction.replace(/\$\$/g, operand);
    };
    MySQLDialect.prototype.utcToWalltime = function (operand, timezone) {
        if (timezone.isUTC())
            return operand;
        return "CONVERT_TZ(" + operand + ",'+0:00','" + timezone + "')";
    };
    MySQLDialect.prototype.walltimeToUTC = function (operand, timezone) {
        if (timezone.isUTC())
            return operand;
        return "CONVERT_TZ(" + operand + ",'" + timezone + "','+0:00')";
    };
    MySQLDialect.prototype.timeFloorExpression = function (operand, duration, timezone) {
        var bucketFormat = MySQLDialect.TIME_BUCKETING[duration.toString()];
        if (!bucketFormat)
            throw new Error("unsupported duration '" + duration + "'");
        return this.walltimeToUTC("DATE_FORMAT(" + this.utcToWalltime(operand, timezone) + ",'" + bucketFormat + "')", timezone);
    };
    MySQLDialect.prototype.timeBucketExpression = function (operand, duration, timezone) {
        return this.timeFloorExpression(operand, duration, timezone);
    };
    MySQLDialect.prototype.timePartExpression = function (operand, part, timezone) {
        var timePartFunction = MySQLDialect.TIME_PART_TO_FUNCTION[part];
        if (!timePartFunction)
            throw new Error("unsupported part " + part + " in MySQL dialect");
        return timePartFunction.replace(/\$\$/g, this.utcToWalltime(operand, timezone));
    };
    MySQLDialect.prototype.timeShiftExpression = function (operand, duration, timezone) {
        var sqlFn = "DATE_ADD(";
        var spans = duration.valueOf();
        if (spans.week) {
            return sqlFn + operand + ", INTERVAL " + String(spans.week) + ' WEEK)';
        }
        if (spans.year || spans.month) {
            var expr = String(spans.year || 0) + "-" + String(spans.month || 0);
            operand = sqlFn + operand + ", INTERVAL '" + expr + "' YEAR_MONTH)";
        }
        if (spans.day || spans.hour || spans.minute || spans.second) {
            var expr = String(spans.day || 0) + " " + [spans.hour || 0, spans.minute || 0, spans.second || 0].join(':');
            operand = sqlFn + operand + ", INTERVAL '" + expr + "' DAY_SECOND)";
        }
        return operand;
    };
    MySQLDialect.prototype.extractExpression = function (operand, regexp) {
        throw new Error('MySQL must implement extractExpression (https://github.com/mysqludf/lib_mysqludf_preg)');
    };
    MySQLDialect.prototype.indexOfExpression = function (str, substr) {
        return "LOCATE(" + substr + ", " + str + ") - 1";
    };
    MySQLDialect.TIME_BUCKETING = {
        "PT1S": "%Y-%m-%d %H:%i:%SZ",
        "PT1M": "%Y-%m-%d %H:%i:00Z",
        "PT1H": "%Y-%m-%d %H:00:00Z",
        "P1D": "%Y-%m-%d 00:00:00Z",
        "P1M": "%Y-%m-01 00:00:00Z",
        "P1Y": "%Y-01-01 00:00:00Z"
    };
    MySQLDialect.TIME_PART_TO_FUNCTION = {
        SECOND_OF_MINUTE: 'SECOND($$)',
        SECOND_OF_HOUR: '(MINUTE($$)*60+SECOND($$))',
        SECOND_OF_DAY: '((HOUR($$)*60+MINUTE($$))*60+SECOND($$))',
        SECOND_OF_WEEK: '(((WEEKDAY($$)*24)+HOUR($$)*60+MINUTE($$))*60+SECOND($$))',
        SECOND_OF_MONTH: '((((DAYOFMONTH($$)-1)*24)+HOUR($$)*60+MINUTE($$))*60+SECOND($$))',
        SECOND_OF_YEAR: '((((DAYOFYEAR($$)-1)*24)+HOUR($$)*60+MINUTE($$))*60+SECOND($$))',
        MINUTE_OF_HOUR: 'MINUTE($$)',
        MINUTE_OF_DAY: 'HOUR($$)*60+MINUTE($$)',
        MINUTE_OF_WEEK: '(WEEKDAY($$)*24)+HOUR($$)*60+MINUTE($$)',
        MINUTE_OF_MONTH: '((DAYOFMONTH($$)-1)*24)+HOUR($$)*60+MINUTE($$)',
        MINUTE_OF_YEAR: '((DAYOFYEAR($$)-1)*24)+HOUR($$)*60+MINUTE($$)',
        HOUR_OF_DAY: 'HOUR($$)',
        HOUR_OF_WEEK: '(WEEKDAY($$)*24+HOUR($$))',
        HOUR_OF_MONTH: '((DAYOFMONTH($$)-1)*24+HOUR($$))',
        HOUR_OF_YEAR: '((DAYOFYEAR($$)-1)*24+HOUR($$))',
        DAY_OF_WEEK: '(WEEKDAY($$)+1)',
        DAY_OF_MONTH: 'DAYOFMONTH($$)',
        DAY_OF_YEAR: 'DAYOFYEAR($$)',
        WEEK_OF_MONTH: null,
        WEEK_OF_YEAR: 'WEEK($$)',
        MONTH_OF_YEAR: 'MONTH($$)',
        YEAR: 'YEAR($$)'
    };
    MySQLDialect.CAST_TO_FUNCTION = {
        TIME: {
            NUMBER: 'FROM_UNIXTIME($$ / 1000)'
        },
        NUMBER: {
            TIME: 'UNIX_TIMESTAMP($$) * 1000',
            STRING: 'CAST($$ AS SIGNED)'
        },
        STRING: {
            NUMBER: 'CAST($$ AS CHAR)'
        }
    };
    return MySQLDialect;
}(SQLDialect));
