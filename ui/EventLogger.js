// src/ui/EventLogger.js

export class EventLogger {
    constructor(eventMenu, maxMessages = 5) {
        this.eventMenu = eventMenu;
        this.maxMessages = maxMessages;
    }

    addMessage(message) {
        const eventMessageElement = document.createElement('div');
        eventMessageElement.className = 'event-message';
        eventMessageElement.textContent = message;
        
        this.eventMenu.appendChild(eventMessageElement);
        
        // Keep only the last N messages
        while (this.eventMenu.children.length > this.maxMessages + 1) { // +1 for the header
            this.eventMenu.removeChild(this.eventMenu.children[1]); // Remove the oldest message, not the header
        }
        
        console.log(`BREAKING NEWS: ${message}`);
    }

    clear() {
        // Remove all messages but keep the header
        while (this.eventMenu.children.length > 1) {
            this.eventMenu.removeChild(this.eventMenu.children[1]);
        }
    }

    setMaxMessages(max) {
        this.maxMessages = max;
        // Trim excess messages if needed
        while (this.eventMenu.children.length > this.maxMessages + 1) {
            this.eventMenu.removeChild(this.eventMenu.children[1]);
        }
    }
}
