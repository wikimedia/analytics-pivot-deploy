import { expect } from "chai";
import { isDate } from './utils';
describe("util", function () {
    describe("isDate", function () {
        it("works", function () {
            expect(isDate(new Date)).to.equal(true);
            expect(isDate([])).to.equal(false);
            expect(isDate(null)).to.equal(false);
        });
    });
});
