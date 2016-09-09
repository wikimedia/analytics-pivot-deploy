import { expect } from "chai";
import { Timezone } from '../timezone/timezone';
import { shifters } from './floor-shift-ceil';
import { WallTime } from 'walltime-repack';
if (!WallTime.rules) {
    var tzData = require("../../lib/walltime/walltime-data.js");
    WallTime.init(tzData.rules, tzData.zones);
}
function pairwise(array, callback) {
    for (var i = 0; i < array.length - 1; i++) {
        callback(array[i], array[i + 1]);
    }
}
describe("floor/shift/ceil", function () {
    var tz = new Timezone("America/Los_Angeles");
    it("shifts seconds", function () {
        var dates = [
            new Date("2012-11-04T00:00:00-07:00"),
            new Date("2012-11-04T00:00:03-07:00"),
            new Date("2012-11-04T00:00:06-07:00"),
            new Date("2012-11-04T00:00:09-07:00"),
            new Date("2012-11-04T00:00:12-07:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.second.shift(d1, tz, 3)).to.deep.equal(d2); });
    });
    it("shifts minutes", function () {
        var dates = [
            new Date("2012-11-04T00:00:00-07:00"),
            new Date("2012-11-04T00:03:00-07:00"),
            new Date("2012-11-04T00:06:00-07:00"),
            new Date("2012-11-04T00:09:00-07:00"),
            new Date("2012-11-04T00:12:00-07:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.minute.shift(d1, tz, 3)).to.deep.equal(d2); });
    });
    it("floors hour correctly", function () {
        expect(shifters.hour.floor(new Date("2012-11-04T00:30:00-07:00"), tz))
            .to.deep.equal(new Date("2012-11-04T00:00:00-07:00"), 'A');
        expect(shifters.hour.floor(new Date("2012-11-04T01:30:00-07:00"), tz))
            .to.deep.equal(new Date("2012-11-04T01:00:00-08:00"), 'B');
        expect(shifters.hour.floor(new Date("2012-11-04T01:30:00-08:00"), tz))
            .to.deep.equal(new Date("2012-11-04T01:00:00-08:00"), 'C');
        expect(shifters.hour.floor(new Date("2012-11-04T02:30:00-08:00"), tz))
            .to.deep.equal(new Date("2012-11-04T02:00:00-08:00"), 'D');
        expect(shifters.hour.floor(new Date("2012-11-04T03:30:00-08:00"), tz))
            .to.deep.equal(new Date("2012-11-04T03:00:00-08:00"), 'E');
    });
    it("shifts hour over DST", function () {
        var dates = [
            new Date("2012-11-04T00:00:00-07:00"),
            new Date("2012-11-04T01:00:00-08:00"),
            new Date("2012-11-04T02:00:00-08:00"),
            new Date("2012-11-04T03:00:00-08:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.hour.shift(d1, tz, 1)).to.deep.equal(d2); });
    });
    it("shifts day over DST", function () {
        var dates = [
            new Date("2012-11-03T00:00:00-07:00"),
            new Date("2012-11-04T00:00:00-07:00"),
            new Date("2012-11-05T00:00:00-08:00"),
            new Date("2012-11-06T00:00:00-08:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.day.shift(d1, tz, 1)).to.deep.equal(d2); });
    });
    it("shifts week over DST", function () {
        var dates = [
            new Date("2012-10-29T00:00:00-07:00"),
            new Date("2012-11-05T00:00:00-08:00"),
            new Date("2012-11-12T00:00:00-08:00"),
            new Date("2012-11-19T00:00:00-08:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.week.shift(d1, tz, 1)).to.deep.equal(d2); });
    });
    it("floors week correctly", function () {
        var d1 = new Date("2014-12-11T22:11:57.469Z");
        var d2 = new Date("2014-12-08T08:00:00.000Z");
        expect(shifters.week.floor(d1, tz)).to.eql(d2);
        d1 = new Date("2014-12-07T12:11:57.469Z");
        d2 = new Date("2014-12-01T08:00:00.000Z");
        expect(shifters.week.floor(d1, tz)).to.eql(d2);
    });
    it("ceils week correctly", function () {
        var d1 = new Date("2014-12-11T22:11:57.469Z");
        var d2 = new Date("2014-12-15T08:00:00.000Z");
        expect(shifters.week.ceil(d1, tz)).to.eql(d2);
        d1 = new Date("2014-12-07T12:11:57.469Z");
        d2 = new Date("2014-12-08T08:00:00.000Z");
        expect(shifters.week.ceil(d1, tz)).to.eql(d2);
    });
    it("shifts month over DST", function () {
        var dates = [
            new Date("2012-11-01T00:00:00-07:00"),
            new Date("2012-12-01T00:00:00-08:00"),
            new Date("2013-01-01T00:00:00-08:00"),
            new Date("2013-02-01T00:00:00-08:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.month.shift(d1, tz, 1)).to.deep.equal(d2); });
    });
    it("shifts year", function () {
        var dates = [
            new Date("2010-01-01T00:00:00-08:00"),
            new Date("2011-01-01T00:00:00-08:00"),
            new Date("2012-01-01T00:00:00-08:00"),
            new Date("2013-01-01T00:00:00-08:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.year.shift(d1, tz, 1)).to.deep.equal(d2); });
    });
});
