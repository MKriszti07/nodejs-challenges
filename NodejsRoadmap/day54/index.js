function add(a, b) {
    return a + b;
}

module.exports = { add };

// If you run `npm start`, print something to show a “deployable” app exists
if (require.main === module) {
    console.log('Day 54 Jenkins CI/CD demo app running.');
}