import { isInstanceOf } from 'immutable-class';
import { WallTime } from 'walltime-repack';
var check;
export var Timezone = (function () {
    function Timezone(timezone) {
        if (typeof timezone !== 'string') {
            throw new TypeError("timezone description must be a string");
        }
        if (timezone !== 'Etc/UTC') {
            WallTime.UTCToWallTime(new Date(0), timezone);
        }
        this.timezone = timezone;
    }
    Timezone.isTimezone = function (candidate) {
        return isInstanceOf(candidate, Timezone);
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
check = Timezone;
