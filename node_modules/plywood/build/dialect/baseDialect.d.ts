import { Timezone, Duration } from "chronoshift";
import { PlyType, PlyTypeSimple } from "../types";
export declare abstract class SQLDialect {
    constructor();
    constantGroupBy(): string;
    escapeName(name: string): string;
    escapeLiteral(name: string): string;
    booleanToSQL(bool: boolean): string;
    numberOrTimeToSQL(x: number | Date): string;
    numberToSQL(num: number): string;
    dateToSQLDateString(date: Date): string;
    abstract timeToSQL(date: Date): string;
    aggregateFilterIfNeeded(inputSQL: string, expressionSQL: string, zeroSQL?: string): string;
    conditionalExpression(condition: string, thenPart: string, elsePart: string): string;
    concatExpression(a: string, b: string): string;
    containsExpression(a: string, b: string): string;
    isNotDistinctFromExpression(a: string, b: string): string;
    abstract regexpExpression(expression: string, regexp: string): string;
    inExpression(operand: string, start: string, end: string, bounds: string): string;
    abstract castExpression(inputType: PlyType, operand: string, cast: PlyTypeSimple): string;
    abstract lengthExpression(a: string): string;
    abstract timeFloorExpression(operand: string, duration: Duration, timezone: Timezone): string;
    abstract timeBucketExpression(operand: string, duration: Duration, timezone: Timezone): string;
    abstract timePartExpression(operand: string, part: string, timezone: Timezone): string;
    abstract timeShiftExpression(operand: string, duration: Duration, timezone: Timezone): string;
    abstract extractExpression(operand: string, regexp: string): string;
    abstract indexOfExpression(str: string, substr: string): string;
}
