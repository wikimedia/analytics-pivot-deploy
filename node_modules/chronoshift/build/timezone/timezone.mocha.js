import { expect } from "chai";
import { testImmutableClass } from 'immutable-class-tester';
import { Timezone } from '../timezone/timezone';
import { WallTime } from 'walltime-repack';
if (!WallTime.rules) {
    var tzData = require("../../lib/walltime/walltime-data.js");
    WallTime.init(tzData.rules, tzData.zones);
}
describe("Timezone", function () {
    it("is an immutable class", function () {
        testImmutableClass(Timezone, [
            "America/Los_Angeles",
            "Europe/Paris",
            "Etc/UTC"
        ]);
    });
    describe("errors", function () {
        it("throws error if invalid timezone", function () {
            expect(function () { return new Timezone(""); }).to.throw(Error, "Unable to find time zone named <blank>");
            expect(function () { return new Timezone("Blah/UTC"); }).to.throw(Error, "Unable to find time zone named Blah/UTC");
            expect(function () { return new Timezone("America/Lost_Angeles"); }).to.throw(Error, "Unable to find time zone named America/Lost_Angeles");
        });
    });
    describe("#toString", function () {
        it("gives back the correct string for LA", function () {
            var timezoneStr = "America/Los_Angeles";
            expect(new Timezone(timezoneStr).toString()).to.equal(timezoneStr);
        });
        it("gives back the correct string for UTC", function () {
            var timezoneStr = "Etc/UTC";
            expect(new Timezone(timezoneStr).toString()).to.equal(timezoneStr);
        });
        it("gives back the correct string for inbuilt UTC", function () {
            expect(Timezone.UTC.toString()).to.equal("Etc/UTC");
        });
    });
    describe("isTimezone", function () {
        it("gives back the correct string for LA", function () {
            var timezoneStr = "America/Los_Angeles";
            expect(Timezone.isTimezone(new Timezone(timezoneStr))).to.equal(true);
        });
    });
});
