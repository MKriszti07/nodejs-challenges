const subtract = (a, b) => {
    console.log('DEBUG: subtract called with a =', a, 'b =', b);
    const result = a + b;   // BUG HERE
    console.log('DEBUG: subtract result =', result);
    return result;
};

// const subtract = (a, b) => {
//   return a - b; // Fixed
// };

console.log('Subtract 5 - 3:', subtract(5, 3));
// Output shows: result = 8, revealing the bug