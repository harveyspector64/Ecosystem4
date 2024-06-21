// src/core/EventSystem.js

export class EventSystem {
    constructor() {
        this.listeners = {};
    }

    subscribe(eventType, callback) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
    }

    unsubscribe(eventType, callback) {
        if (!this.listeners[eventType]) return;
        this.listeners[eventType] = this.listeners[eventType].filter(
            listener => listener !== callback
        );
    }

    publish(eventType, data) {
        if (!this.listeners[eventType]) return;
        this.listeners[eventType].forEach(callback => callback(data));
    }

    // Helper method to create and publish a game event
    gameEvent(eventType, message) {
        this.publish(eventType, { message, timestamp: Date.now() });
        this.publish('logEvent', { message, timestamp: Date.now() });
    }
}
