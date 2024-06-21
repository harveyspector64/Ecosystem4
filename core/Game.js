// src/core/Game.js

import { EntityManager } from './EntityManager.js';
import { EventSystem } from './EventSystem.js';
import { StateManager } from './StateManager.js';
import { UIManager } from '../ui/UIManager.js';
import { Renderer } from '../rendering/Renderer.js';
import { PerformanceMonitor } from '../utils/PerformanceMonitor.js';
import { GameConfig } from '../config/GameConfig.js';

export class Game {
    constructor() {
        this.entityManager = new EntityManager();
        this.eventSystem = new EventSystem();
        this.stateManager = new StateManager();
        this.uiManager = new UIManager(this);
        this.renderer = new Renderer();
        this.performanceMonitor = new PerformanceMonitor();

        this.isRunning = false;
    }

    initialize() {
        this.uiManager.initialize();
        this.stateManager.initialize();
        this.entityManager.initialize();
        this.renderer.initialize(document.getElementById('play-area'));

        this.eventSystem.subscribe('emojiAdded', this.handleEmojiAdded.bind(this));
        
        this.isRunning = true;
        this.gameLoop();
    }

    handleEmojiAdded(emoji, x, y) {
        // Logic for adding different types of emojis
        switch(emoji) {
            case GameConfig.EMOJIS.BUSH:
                this.entityManager.addBush(x, y);
                this.uiManager.unlockTree();
                break;
            case GameConfig.EMOJIS.TREE:
                this.entityManager.addTree(x, y);
                this.entityManager.addBird(x, y);
                break;
            case GameConfig.EMOJIS.WORM:
                this.entityManager.addWorm(x, y);
                break;
        }
        this.uiManager.addEventLogMessage(`A ${this.getEmojiName(emoji)} has been added to the ecosystem!`);
    }

    getEmojiName(emoji) {
        // ... (same as in original script)
    }

    gameLoop(currentTime) {
        if (!this.isRunning) return;

        this.update(currentTime);
        this.render();

        this.performanceMonitor.update(currentTime);

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(currentTime) {
        this.entityManager.updateEntities(currentTime);
        this.stateManager.update(currentTime);
    }

    render() {
        this.renderer.clear();
        this.entityManager.renderEntities(this.renderer);
    }
}
