import { Timezone } from '../timezone/timezone';
import { Duration } from '../duration/duration';
export declare function parseSQLDate(type: string, v: string): Date;
export declare function parseISODate(date: string, timezone?: Timezone): Date | null;
export interface IntervalParse {
    computedStart: Date;
    computedEnd: Date;
    start?: Date | null;
    end?: Date | null;
    duration?: Duration | null;
}
export declare function parseInterval(str: string, timezone?: Timezone, now?: Date): IntervalParse;
