import { isInstanceOf } from "immutable-class";
import { hasOwnProperty } from "../helper/utils";
import { NumberRange } from "../datatypes/numberRange";
import { TimeRange } from "../datatypes/timeRange";
import { getValueType, isSetType, valueToJS, valueFromJS } from "./common";
import { StringRange } from "./stringRange";
import { isDate } from "chronoshift";
function dateString(date) {
    return date.toISOString();
}
function arrayFromJS(xs, setType) {
    return xs.map(function (x) { return valueFromJS(x, setType); });
}
function unifyElements(elements) {
    var newElements = Object.create(null);
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var accumulator = elements_1[_i];
        var newElementsKeys = Object.keys(newElements);
        for (var _a = 0, newElementsKeys_1 = newElementsKeys; _a < newElementsKeys_1.length; _a++) {
            var newElementsKey = newElementsKeys_1[_a];
            var newElement = newElements[newElementsKey];
            var unionElement = accumulator.union(newElement);
            if (unionElement) {
                accumulator = unionElement;
                delete newElements[newElementsKey];
            }
        }
        newElements[accumulator.toString()] = accumulator;
    }
    return Object.keys(newElements).map(function (k) { return newElements[k]; });
}
function intersectElements(elements1, elements2) {
    var newElements = [];
    for (var _i = 0, elements1_1 = elements1; _i < elements1_1.length; _i++) {
        var element1 = elements1_1[_i];
        for (var _a = 0, elements2_1 = elements2; _a < elements2_1.length; _a++) {
            var element2 = elements2_1[_a];
            var intersect = element1.intersect(element2);
            if (intersect)
                newElements.push(intersect);
        }
    }
    return newElements;
}
var typeUpgrades = {
    'NUMBER': 'NUMBER_RANGE',
    'TIME': 'TIME_RANGE',
    'STRING': 'STRING_RANGE'
};
var check;
export var Set = (function () {
    function Set(parameters) {
        var setType = parameters.setType;
        this.setType = setType;
        var keyFn = setType === 'TIME' ? dateString : String;
        this.keyFn = keyFn;
        var elements = parameters.elements;
        var newElements = null;
        var hash = Object.create(null);
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var key = keyFn(element);
            if (hash[key]) {
                if (!newElements)
                    newElements = elements.slice(0, i);
            }
            else {
                hash[key] = element;
                if (newElements)
                    newElements.push(element);
            }
        }
        if (newElements) {
            elements = newElements;
        }
        if (setType === 'NUMBER_RANGE' || setType === 'TIME_RANGE' || setType === 'STRING_RANGE') {
            elements = unifyElements(elements);
        }
        this.elements = elements;
        this.hash = hash;
    }
    Set.isSet = function (candidate) {
        return isInstanceOf(candidate, Set);
    };
    Set.convertToSet = function (thing) {
        var thingType = getValueType(thing);
        if (isSetType(thingType))
            return thing;
        return Set.fromJS({ setType: thingType, elements: [thing] });
    };
    Set.generalUnion = function (a, b) {
        var aSet = Set.convertToSet(a);
        var bSet = Set.convertToSet(b);
        var aSetType = aSet.setType;
        var bSetType = bSet.setType;
        if (typeUpgrades[aSetType] === bSetType) {
            aSet = aSet.upgradeType();
        }
        else if (typeUpgrades[bSetType] === aSetType) {
            bSet = bSet.upgradeType();
        }
        else if (aSetType !== bSetType) {
            return null;
        }
        return aSet.union(bSet).simplify();
    };
    Set.generalIntersect = function (a, b) {
        var aSet = Set.convertToSet(a);
        var bSet = Set.convertToSet(b);
        var aSetType = aSet.setType;
        var bSetType = bSet.setType;
        if (typeUpgrades[aSetType] === bSetType) {
            aSet = aSet.upgradeType();
        }
        else if (typeUpgrades[bSetType] === aSetType) {
            bSet = bSet.upgradeType();
        }
        else if (aSetType !== bSetType) {
            return null;
        }
        return aSet.intersect(bSet).simplify();
    };
    Set.fromJS = function (parameters) {
        if (Array.isArray(parameters)) {
            parameters = { elements: parameters };
        }
        if (typeof parameters !== "object") {
            throw new Error("unrecognizable set");
        }
        var setType = parameters.setType;
        var elements = parameters.elements;
        if (!setType) {
            setType = getValueType(elements.length ? elements[0] : null);
        }
        return new Set({
            setType: setType,
            elements: arrayFromJS(elements, setType)
        });
    };
    Set.prototype.valueOf = function () {
        return {
            setType: this.setType,
            elements: this.elements
        };
    };
    Set.prototype.toJS = function () {
        return {
            setType: this.setType,
            elements: this.elements.map(valueToJS)
        };
    };
    Set.prototype.toJSON = function () {
        return this.toJS();
    };
    Set.prototype.toString = function () {
        if (this.setType === "NULL")
            return "null";
        return "" + this.elements.map(String).join(", ");
    };
    Set.prototype.equals = function (other) {
        return Set.isSet(other) &&
            this.setType === other.setType &&
            this.elements.length === other.elements.length &&
            this.elements.slice().sort().join('') === other.elements.slice().sort().join('');
    };
    Set.prototype.cardinality = function () {
        return this.size();
    };
    Set.prototype.size = function () {
        return this.elements.length;
    };
    Set.prototype.empty = function () {
        return this.elements.length === 0;
    };
    Set.prototype.simplify = function () {
        var simpleSet = this.downgradeType();
        var simpleSetElements = simpleSet.elements;
        return simpleSetElements.length === 1 ? simpleSetElements[0] : simpleSet;
    };
    Set.prototype.getType = function () {
        return 'SET/' + this.setType;
    };
    Set.prototype.upgradeType = function () {
        if (this.setType === 'NUMBER') {
            return Set.fromJS({
                setType: 'NUMBER_RANGE',
                elements: this.elements.map(NumberRange.fromNumber)
            });
        }
        else if (this.setType === 'TIME') {
            return Set.fromJS({
                setType: 'TIME_RANGE',
                elements: this.elements.map(TimeRange.fromTime)
            });
        }
        else if (this.setType === 'STRING') {
            return Set.fromJS({
                setType: 'STRING_RANGE',
                elements: this.elements.map(StringRange.fromString)
            });
        }
        else {
            return this;
        }
    };
    Set.prototype.downgradeType = function () {
        if (this.setType === 'NUMBER_RANGE' || this.setType === 'TIME_RANGE' || this.setType === 'STRING_RANGE') {
            var elements = this.elements;
            var simpleElements = [];
            for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
                var element = elements_2[_i];
                if (element.degenerate()) {
                    simpleElements.push(element.start);
                }
                else {
                    return this;
                }
            }
            return Set.fromJS(simpleElements);
        }
        else {
            return this;
        }
    };
    Set.prototype.extent = function () {
        var setType = this.setType;
        if (hasOwnProperty(typeUpgrades, setType)) {
            return this.upgradeType().extent();
        }
        if (setType !== 'NUMBER_RANGE' && setType !== 'TIME_RANGE' && setType !== 'STRING_RANGE')
            return null;
        var elements = this.elements;
        var extent = elements[0] || null;
        for (var i = 1; i < elements.length; i++) {
            extent = extent.extend(elements[i]);
        }
        return extent;
    };
    Set.prototype.union = function (other) {
        if (this.empty())
            return other;
        if (other.empty())
            return this;
        if (this.setType !== other.setType) {
            throw new TypeError("can not union sets of different types");
        }
        var newElements = this.elements.slice();
        var otherElements = other.elements;
        for (var _i = 0, otherElements_1 = otherElements; _i < otherElements_1.length; _i++) {
            var el = otherElements_1[_i];
            if (this.contains(el))
                continue;
            newElements.push(el);
        }
        return new Set({
            setType: this.setType,
            elements: newElements
        });
    };
    Set.prototype.intersect = function (other) {
        if (this.empty() || other.empty())
            return Set.EMPTY;
        var setType = this.setType;
        if (this.setType !== other.setType) {
            throw new TypeError("can not intersect sets of different types");
        }
        var thisElements = this.elements;
        var newElements;
        if (setType === 'NUMBER_RANGE' || setType === 'TIME_RANGE' || setType === 'STRING_RANGE') {
            var otherElements = other.elements;
            newElements = intersectElements(thisElements, otherElements);
        }
        else {
            newElements = [];
            for (var _i = 0, thisElements_1 = thisElements; _i < thisElements_1.length; _i++) {
                var el = thisElements_1[_i];
                if (!other.contains(el))
                    continue;
                newElements.push(el);
            }
        }
        return new Set({
            setType: this.setType,
            elements: newElements
        });
    };
    Set.prototype.overlap = function (other) {
        if (this.empty() || other.empty())
            return false;
        if (this.setType !== other.setType) {
            throw new TypeError("can determine overlap sets of different types");
        }
        var thisElements = this.elements;
        for (var _i = 0, thisElements_2 = thisElements; _i < thisElements_2.length; _i++) {
            var el = thisElements_2[_i];
            if (!other.contains(el))
                continue;
            return true;
        }
        return false;
    };
    Set.prototype.contains = function (value) {
        var setType = this.setType;
        if ((setType === 'NUMBER_RANGE' && typeof value === 'number')
            || (setType === 'TIME_RANGE' && isDate(value))
            || (setType === 'STRING_RANGE' && typeof value === 'string')) {
            return this.containsWithin(value);
        }
        return hasOwnProperty(this.hash, this.keyFn(value));
    };
    Set.prototype.containsWithin = function (value) {
        var elements = this.elements;
        for (var k in elements) {
            if (!hasOwnProperty(elements, k))
                continue;
            if (elements[k].contains(value))
                return true;
        }
        return false;
    };
    Set.prototype.add = function (value) {
        var setType = this.setType;
        var valueType = getValueType(value);
        if (setType === 'NULL')
            setType = valueType;
        if (valueType !== 'NULL' && setType !== valueType)
            throw new Error('value type must match');
        if (this.contains(value))
            return this;
        return new Set({
            setType: setType,
            elements: this.elements.concat([value])
        });
    };
    Set.prototype.remove = function (value) {
        if (!this.contains(value))
            return this;
        var keyFn = this.keyFn;
        var key = keyFn(value);
        return new Set({
            setType: this.setType,
            elements: this.elements.filter(function (element) { return keyFn(element) !== key; })
        });
    };
    Set.prototype.toggle = function (value) {
        return this.contains(value) ? this.remove(value) : this.add(value);
    };
    Set.type = 'SET';
    return Set;
}());
check = Set;
Set.EMPTY = Set.fromJS([]);
