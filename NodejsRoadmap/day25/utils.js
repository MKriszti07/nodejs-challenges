// Utility function: Add two numbers
const add = (a, b) => {
    return a + b;
};

// Utility function: Multiply two numbers
const multiply = (a, b) => {
    return a * b;
};

// Utility function: Reverse a string
const reverseString = (str) => {
    if (typeof str !== 'string') {
        throw new Error('Input must be a string');
    }
    return str.split('').reverse().join('');
};

module.exports = { add, multiply, reverseString };