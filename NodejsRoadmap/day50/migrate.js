const migrate = require('migrate');
const path = require('path');

// Usage:
//   node migrate.js up
//   node migrate.js down
const direction = process.argv[2] || 'up';

migrate.load(
    {
        stateStore: path.join(__dirname, '.migrate'),
        migrationsDirectory: path.join(__dirname, 'migrations'),
    },
    (err, set) => {
        if (err) throw err;

        set.on('migration', (migration) => {
            console.log("Running:", migration.title);
        });

        set[direction]((err2) => {
            if (err2) throw err2;
            console.log("Migrations complete:", direction);
        });
    }
);
