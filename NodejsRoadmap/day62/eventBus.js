const { EventEmitter } = require('node:events');

// Create a singleton event bus for the app
class AppEventBus extends EventEmitter {}

// If you expect many listeners, you can raise the max to avoid warnings
// (default is 10)
const eventBus = new AppEventBus();
eventBus.setMaxListeners(50);

// Helper: wrap async listeners so rejected promises become an "error" event
function onAsync(eventName, handler) {
    eventBus.on(eventName, async (...args) => {
        try {
            await handler(...args);
        } catch (err) {
            eventBus.emit('error', err, { eventName });
        }
    });
}

module.exports = { eventBus, onAsync };