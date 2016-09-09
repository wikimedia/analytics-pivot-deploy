import { expect } from "chai";
import { Timezone } from '../timezone/timezone';
import { shifters } from './floor-shift-ceil';
function pairwise(array, callback) {
    for (var i = 0; i < array.length - 1; i++) {
        callback(array[i], array[i + 1]);
    }
}
describe("floor, move, ceil (UTC)", function () {
    var tz = Timezone.UTC;
    it("moves seconds", function () {
        var dates = [
            new Date("2012-11-04T00:00:00"),
            new Date("2012-11-04T00:00:03"),
            new Date("2012-11-04T00:00:06"),
            new Date("2012-11-04T00:00:09"),
            new Date("2012-11-04T00:00:12")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.second.move(d1, tz, 3)).to.deep.equal(d2); });
    });
    it("rounds minutes", function () {
        expect(shifters.minute.round(new Date("2012-11-04T00:29:00"), 15, tz))
            .to.deep.equal(new Date("2012-11-04T00:15:00"));
        expect(shifters.minute.round(new Date("2012-11-04T00:29:00"), 4, tz))
            .to.deep.equal(new Date("2012-11-04T00:28:00"));
    });
    it("moves minutes", function () {
        var dates = [
            new Date("2012-11-04T00:00:00"),
            new Date("2012-11-04T00:03:00"),
            new Date("2012-11-04T00:06:00"),
            new Date("2012-11-04T00:09:00"),
            new Date("2012-11-04T00:12:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.minute.move(d1, tz, 3)).to.deep.equal(d2); });
    });
    it("floors hour correctly", function () {
        expect(shifters.hour.floor(new Date("2012-11-04T00:30:00"), tz))
            .to.deep.equal(new Date("2012-11-04T00:00:00"));
        expect(shifters.hour.floor(new Date("2012-11-04T01:30:00"), tz))
            .to.deep.equal(new Date("2012-11-04T01:00:00"));
        expect(shifters.hour.floor(new Date("2012-11-04T01:30:00"), tz))
            .to.deep.equal(new Date("2012-11-04T01:00:00"));
        expect(shifters.hour.floor(new Date("2012-11-04T02:30:00"), tz))
            .to.deep.equal(new Date("2012-11-04T02:00:00"));
        expect(shifters.hour.floor(new Date("2012-11-04T03:30:00"), tz))
            .to.deep.equal(new Date("2012-11-04T03:00:00"));
    });
    it("moves hour", function () {
        var dates = [
            new Date("2012-11-04T00:00:00"),
            new Date("2012-11-04T01:00:00"),
            new Date("2012-11-04T02:00:00"),
            new Date("2012-11-04T03:00:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.hour.move(d1, tz, 1)).to.deep.equal(d2); });
    });
    it("moves day", function () {
        var dates = [
            new Date("2012-11-03T00:00:00"),
            new Date("2012-11-04T00:00:00"),
            new Date("2012-11-05T00:00:00"),
            new Date("2012-11-06T00:00:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.day.move(d1, tz, 1)).to.deep.equal(d2); });
    });
    it("ceils day", function () {
        var d1 = new Date("2014-12-11T22:11:57.469Z");
        var d2 = new Date("2014-12-12T00:00:00.000Z");
        expect(shifters.day.ceil(d1, tz)).to.eql(d2);
        d1 = new Date("2014-12-08T00:00:00.000Z");
        d2 = new Date("2014-12-08T00:00:00.000Z");
        expect(shifters.day.ceil(d1, tz)).to.eql(d2);
    });
    it("moves week", function () {
        var dates = [
            new Date("2012-10-29T00:00:00"),
            new Date("2012-11-05T00:00:00"),
            new Date("2012-11-12T00:00:00"),
            new Date("2012-11-19T00:00:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.week.move(d1, tz, 1)).to.deep.equal(d2); });
    });
    it("floors week correctly", function () {
        var d1 = new Date("2014-12-11T22:11:57.469Z");
        var d2 = new Date("2014-12-08T00:00:00.000Z");
        expect(shifters.week.floor(d1, tz)).to.eql(d2);
        d1 = new Date("2014-12-07T12:11:57.469Z");
        d2 = new Date("2014-12-01T00:00:00.000Z");
        expect(shifters.week.floor(d1, tz)).to.eql(d2);
    });
    it("ceils week correctly", function () {
        var d1 = new Date("2014-12-11T22:11:57.469Z");
        var d2 = new Date("2014-12-15T00:00:00.000Z");
        expect(shifters.week.ceil(d1, tz)).to.eql(d2);
        d1 = new Date("2014-12-07T12:11:57.469Z");
        d2 = new Date("2014-12-08T00:00:00.000Z");
        expect(shifters.week.ceil(d1, tz)).to.eql(d2);
    });
    it("moves month", function () {
        var dates = [
            new Date("2012-11-01T00:00:00"),
            new Date("2012-12-01T00:00:00"),
            new Date("2013-01-01T00:00:00"),
            new Date("2013-02-01T00:00:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.month.move(d1, tz, 1)).to.deep.equal(d2); });
    });
    it("moves year", function () {
        var dates = [
            new Date("2010-01-01T00:00:00"),
            new Date("2011-01-01T00:00:00"),
            new Date("2012-01-01T00:00:00"),
            new Date("2013-01-01T00:00:00")
        ];
        pairwise(dates, function (d1, d2) { return expect(shifters.year.move(d1, tz, 1)).to.deep.equal(d2); });
    });
});
