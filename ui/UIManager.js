// src/ui/UIManager.js

import { GameConfig } from '../config/GameConfig.js';
import { DragDropHandler } from './DragDropHandler.js';
import { TouchHandler } from './TouchHandler.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.emojiPanel = null;
        this.eventMenu = null;
        this.playArea = null;
        this.dragDropHandler = new DragDropHandler(this);
        this.touchHandler = new TouchHandler(this);
    }

    initialize() {
        this.emojiPanel = document.getElementById('emoji-panel');
        this.eventMenu = document.getElementById('event-menu');
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
        const eventMessageElement = document.createElement('div');
        eventMessageElement.className = 'event-message';
        eventMessageElement.textContent = message;
        
        this.eventMenu.appendChild(eventMessageElement);
        
        // Keep only the last 5 messages
        while (this.eventMenu.children.length > 6) { // +1 for the header
            this.eventMenu.removeChild(this.eventMenu.children[1]); // Remove the oldest message, not the header
        }
        
        console.log(`BREAKING NEWS: ${message}`);
    }

    updateDayNightCycle(cycle) {
        if (cycle === 'night') {
            document.body.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
        }
    }

    unlockTree() {
        const treeElement = document.getElementById('tree');
        treeElement.classList.remove('disabled');
        treeElement.setAttribute('draggable', 'true');
    }

    addWormToPanel() {
        this.addEmojiToPanel(GameConfig.EMOJIS.WORM, 'worm');
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
}
