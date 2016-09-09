import { Timezone, Duration } from "chronoshift";
import { SQLDialect } from "./baseDialect";
import { PlyType } from "../types";
export declare class PostgresDialect extends SQLDialect {
    static TIME_BUCKETING: Lookup<string>;
    static TIME_PART_TO_FUNCTION: Lookup<string>;
    static CAST_TO_FUNCTION: Lookup<Lookup<string>>;
    constructor();
    constantGroupBy(): string;
    timeToSQL(date: Date): string;
    conditionalExpression(condition: string, thenPart: string, elsePart: string): string;
    concatExpression(a: string, b: string): string;
    containsExpression(a: string, b: string): string;
    lengthExpression(a: string): string;
    regexpExpression(expression: string, regexp: string): string;
    castExpression(inputType: PlyType, operand: string, cast: string): string;
    utcToWalltime(operand: string, timezone: Timezone): string;
    walltimeToUTC(operand: string, timezone: Timezone): string;
    timeFloorExpression(operand: string, duration: Duration, timezone: Timezone): string;
    timeBucketExpression(operand: string, duration: Duration, timezone: Timezone): string;
    timePartExpression(operand: string, part: string, timezone: Timezone): string;
    timeShiftExpression(operand: string, duration: Duration, timezone: Timezone): string;
    extractExpression(operand: string, regexp: string): string;
    indexOfExpression(str: string, substr: string): string;
}
