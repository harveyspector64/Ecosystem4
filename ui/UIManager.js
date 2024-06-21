// src/ui/UIManager.js

import { GameConfig } from '../config/GameConfig.js';
import { DragDropHandler } from './DragDropHandler.js';
import { TouchHandler } from './TouchHandler.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.emojiPanel = null;
        this.eventLog = null;
        this.playArea = null;
        this.dragDropHandler = new DragDropHandler(this);
        this.touchHandler = new TouchHandler(this);
    }

    initialize() {
        this.emojiPanel = document.getElementById('emoji-panel');
        this.eventLog = document.getElementById('event-messages');
        this.playArea = document.getElementById('play-area');

        this.initializeEmojiPanel();
        this.setupEventListeners();

        // Subscribe to relevant events
        this.game.eventSystem.subscribe('logEvent', this.addEventLogMessage.bind(this));
        this.game.eventSystem.subscribe('dayNightChange', this.updateDayNightCycle.bind(this));
    }

    initializeEmojiPanel() {
        GameConfig.INITIAL_EMOJIS.forEach(item => {
            const element = document.createElement('div');
            element.id = item.id;
            element.classList.add('emoji');
            element.textContent = item.emoji;
            if (item.disabled) {
                element.classList.add('disabled');
                element.setAttribute('draggable', 'false');
            } else {
                element.setAttribute('draggable', 'true');
            }
            this.emojiPanel.appendChild(element);
        });
    }

    setupEventListeners() {
        this.dragDropHandler.setup();
        this.touchHandler.setup();
    }

    addEventLogMessage(data) {
        const { message } = data;
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        this.eventLog.appendChild(messageElement);
        
        // Keep only the last 5 messages
        while (this.eventLog.children.length > 5) {
            this.eventLog.removeChild(this.eventLog.firstChild);
        }

        // Scroll to the bottom of the event log
        this.eventLog.scrollTop = this.eventLog.scrollHeight;
    }

    updateDayNightCycle(cycle) {
        if (cycle === 'night') {
            this.playArea.classList.add('night-mode');
            this.addEventLogMessage({ message: "Night has fallen." });
        } else {
            this.playArea.classList.remove('night-mode');
            this.addEventLogMessage({ message: "A new day has dawned." });
        }
    }

    unlockTree() {
        const treeElement = document.getElementById('tree');
        treeElement.classList.remove('disabled');
        treeElement.setAttribute('draggable', 'true');
        this.addEventLogMessage({ message: "You can now plant trees!" });
    }

    addWormToPanel() {
        this.addEmojiToPanel(GameConfig.EMOJIS.WORM, 'worm');
        this.addEventLogMessage({ message: "Worms have appeared! You can now place them." });
    }

    addEmojiToPanel(emoji, id) {
        const emojiElement = document.createElement('div');
        emojiElement.id = id;
        emojiElement.classList.add('emoji');
        emojiElement.textContent = emoji;
        emojiElement.setAttribute('draggable', 'true');

        this.emojiPanel.appendChild(emojiElement);
        console.log(`${id} added to emoji panel`);
    }

    handleEmojiDrop(emoji, x, y) {
        this.game.eventSystem.publish('emojiAdded', { emoji, x, y });
    }

    updateEntityCounts(counts) {
        // This method is not used in the current UI, but kept for potential future use
        console.log('Entity counts:', counts);
    }
}
