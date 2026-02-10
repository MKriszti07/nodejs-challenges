// Buggy Calculator Application

// Bug 1: Logic error in subtract function
const add = (a, b) => {
    return a + b;
};

// Bug: Should subtract b from a, but adds instead
const subtract = (a, b) => {
    return a + b;   // BUG: Should be a - b
};

const multiply = (a, b) => {
    return a * b;
};

// Bug 2: No edge case handling for division by zero
const divide = (a, b) => {
    debugger;
    if (b === 0) {
        throw new Error('Cannot divide by zero');
    }
    return a / b;  // BUG: Doesn't check if b is 0
};

// Bug 3: Async function with timing issue
const asyncCalculation = async (a, b) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // BUG: Wrong operation
            resolve(a - b); // Should be a * b
        }, 1000);
    });
};

// Test the functions
console.log('Add 5 + 3:', add(5, 3));
console.log('Subtract 5 - 3:', subtract(5, 3)); // Bug: Returns 8 instead of 2
console.log('Multiply 5 * 3:', multiply(5, 3));
console.log('Divide 10 / 2:', divide(10, 2));
console.log('Divide 10 / 0:', divide(10, 0)); // Bug: Returns Infinity

asyncCalculation(5, 3).then(result => {
    console.log('Async multiply 5 * 3:', result); // Bug: Returns 2 instead of 15
});

module.exports = { add, subtract, multiply, divide, asyncCalculation };