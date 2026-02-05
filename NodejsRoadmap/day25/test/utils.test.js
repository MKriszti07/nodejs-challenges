const { expect } = require('chai');
const { add, multiply, reverseString } = require('../utils');

describe('Utility Functions', () => {

    describe('add()', () => {
        it('should add two positive numbers correctly', () => {
            const result = add(2, 3);
            expect(result).to.equal(5);
        });

        it('should add negative numbers correctly', () => {
            const result = add(-2, -3);
            expect(result).to.equal(-5);
        });

        it ('should return 0 when both inputs are 0', () => {
            const result = add(0, 0);
            expect(result).to.equal(0);
        });
    });

    describe('multiply()', () => {
        it('should multiply two positive numbers correctly', () => {
            const result = multiply(2, 3);
            expect(result).to.equal(6);
        });

        it('should return 0 when one number is 0', () => {
            const result = multiply(5, 0);
            expect(result).to.equal(0);
        });

        it('should handle negative numbers', () => {
            const result = multiply(-2, 3);
            expect(result).to.equal(-6);
        });
    });

    describe('reverseString()', () => {
        it('should reverse a simple string', () => {
            const result = reverseString('hello');
            expect(result).to.equal('olleh');
        });

        it('should handle empty strings', () => {
            const result = reverseString('');
            expect(result).to.equal('');
        });

        it('should throw an error for non-string inputs', () => {
            expect(() => reverseString(123)).to.throw(TypeError, 'Input must be a string');
        });
    });
});