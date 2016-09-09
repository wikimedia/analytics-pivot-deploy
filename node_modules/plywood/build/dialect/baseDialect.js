export var SQLDialect = (function () {
    function SQLDialect() {
    }
    SQLDialect.prototype.constantGroupBy = function () {
        return "GROUP BY ''";
    };
    SQLDialect.prototype.escapeName = function (name) {
        name = name.replace(/"/g, '""');
        return '"' + name + '"';
    };
    SQLDialect.prototype.escapeLiteral = function (name) {
        if (name === null)
            return 'NULL';
        name = name.replace(/'/g, "''");
        return "'" + name + "'";
    };
    SQLDialect.prototype.booleanToSQL = function (bool) {
        return ('' + bool).toUpperCase();
    };
    SQLDialect.prototype.numberOrTimeToSQL = function (x) {
        if (x === null)
            return 'NULL';
        if (x.toISOString) {
            return this.timeToSQL(x);
        }
        else {
            return this.numberToSQL(x);
        }
    };
    SQLDialect.prototype.numberToSQL = function (num) {
        if (num === null)
            return 'NULL';
        return '' + num;
    };
    SQLDialect.prototype.dateToSQLDateString = function (date) {
        return date.toISOString()
            .replace('T', ' ')
            .replace('Z', '')
            .replace(/\.000$/, '')
            .replace(/ 00:00:00$/, '');
    };
    SQLDialect.prototype.aggregateFilterIfNeeded = function (inputSQL, expressionSQL, zeroSQL) {
        if (zeroSQL === void 0) { zeroSQL = '0'; }
        var whereIndex = inputSQL.indexOf(' WHERE ');
        if (whereIndex === -1)
            return expressionSQL;
        var filterSQL = inputSQL.substr(whereIndex + 7);
        return this.conditionalExpression(filterSQL, expressionSQL, zeroSQL);
    };
    SQLDialect.prototype.conditionalExpression = function (condition, thenPart, elsePart) {
        return "IF(" + condition + "," + thenPart + "," + elsePart + ")";
    };
    SQLDialect.prototype.concatExpression = function (a, b) {
        throw new Error('must implement');
    };
    SQLDialect.prototype.containsExpression = function (a, b) {
        throw new Error('must implement');
    };
    SQLDialect.prototype.isNotDistinctFromExpression = function (a, b) {
        if (a === 'NULL')
            return b + " IS NULL";
        if (b === 'NULL')
            return a + " IS NULL";
        return "(" + a + " IS NOT DISTINCT FROM " + b + ")";
    };
    SQLDialect.prototype.inExpression = function (operand, start, end, bounds) {
        if (start === end && bounds === '[]')
            return operand + "=" + start;
        var startSQL = null;
        if (start !== 'NULL') {
            startSQL = start + (bounds[0] === '[' ? '<=' : '<') + operand;
        }
        var endSQL = null;
        if (end !== 'NULL') {
            endSQL = operand + (bounds[1] === ']' ? '<=' : '<') + end;
        }
        if (startSQL) {
            return endSQL ? "(" + startSQL + " AND " + endSQL + ")" : startSQL;
        }
        else {
            return endSQL ? endSQL : 'TRUE';
        }
    };
    return SQLDialect;
}());
