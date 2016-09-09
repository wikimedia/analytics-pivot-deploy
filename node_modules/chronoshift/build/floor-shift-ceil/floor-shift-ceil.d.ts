import { Timezone } from '../timezone/timezone';
export interface AlignFn {
    (dt: Date, tz: Timezone): Date;
}
export interface ShiftFn {
    (dt: Date, tz: Timezone, step: number): Date;
}
export interface RoundFn {
    (dt: Date, roundTo: number, tz: Timezone): Date;
}
export interface TimeShifter {
    canonicalLength: number;
    siblings?: number;
    floor: AlignFn;
    round?: RoundFn;
    shift: ShiftFn;
    ceil?: AlignFn;
    move?: ShiftFn;
}
export declare const second: TimeShifter;
export declare const minute: TimeShifter;
export declare const hour: TimeShifter;
export declare const day: TimeShifter;
export declare const week: TimeShifter;
export declare const month: TimeShifter;
export declare const year: TimeShifter;
export interface Shifters {
    second: TimeShifter;
    minute: TimeShifter;
    hour: TimeShifter;
    day: TimeShifter;
    week: TimeShifter;
    month: TimeShifter;
    year: TimeShifter;
    [key: string]: TimeShifter;
}
export declare const shifters: Shifters;
