// src/core/Game.js

import { UIManager } from '../ui/UIManager.js';
import { Renderer } from '../rendering/Renderer.js';
import { EntityManager } from './EntityManager.js';
import { EventSystem } from './EventSystem.js';
import { StateManager } from './StateManager.js';
import { GameConfig } from '../config/GameConfig.js';

export class Game {
    constructor() {
        this.uiManager = new UIManager(this);
        this.renderer = new Renderer();
        this.entityManager = new EntityManager(this);
        this.eventSystem = new EventSystem();
        this.stateManager = new StateManager();

        this.isRunning = false;
        this.lastUpdateTime = 0;
        this.dayNightCycle = 'day';
        this.cycleTimer = 0;
    }

    initialize() {
        this.renderer.initialize(document.getElementById('play-area'));
        this.uiManager.initialize();
        this.entityManager.initialize();
        this.stateManager.initialize();

        // Set up event listeners
        this.eventSystem.subscribe('emojiDropped', this.handleEmojiDrop.bind(this));
        this.eventSystem.subscribe('entityCreated', this.handleEntityCreated.bind(this));
        this.eventSystem.subscribe('entityRemoved', this.handleEntityRemoved.bind(this));

        this.isRunning = true;
        this.lastUpdateTime = performance.now();
        this.gameLoop();
    }

    gameLoop(currentTime) {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
        this.lastUpdateTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        this.updateDayNightCycle(deltaTime);
        this.entityManager.updateEntities(deltaTime);
        this.stateManager.update(deltaTime);
    }

    render() {
        this.renderer.clear();
        this.entityManager.renderEntities(this.renderer);
    }

    updateDayNightCycle(deltaTime) {
        this.cycleTimer += deltaTime;
        const totalCycleTime = GameConfig.DAY_DURATION + GameConfig.NIGHT_DURATION;
        
        if (this.cycleTimer >= totalCycleTime) {
            this.cycleTimer -= totalCycleTime;
        }

        const newCycle = this.cycleTimer < GameConfig.DAY_DURATION ? 'day' : 'night';
        
        if (newCycle !== this.dayNightCycle) {
            this.dayNightCycle = newCycle;
            this.handleDayNightChange();
        }
    }

    handleDayNightChange() {
        this.eventSystem.publish('dayNightChange', this.dayNightCycle);
        this.renderer.applyDayNightEffect(this.dayNightCycle === 'night');
        this.entityManager.handleDayNightChange(this.dayNightCycle);
        this.uiManager.updateDayNightCycle(this.dayNightCycle);
    }

    handleEmojiDrop(data) {
        const { emoji, x, y } = data;
        switch(emoji) {
            case GameConfig.EMOJIS.BUSH:
                if (this.stateManager.canPlantBush()) {
                    this.entityManager.addBush(x, y);
                    this.stateManager.incrementBushCount();
                    this.uiManager.addNewsItem("A new bush has been planted!");
                }
                break;
            case GameConfig.EMOJIS.TREE:
                if (this.stateManager.canPlantTree()) {
                    this.entityManager.addTree(x, y);
                    this.stateManager.incrementTreeCount();
                    this.uiManager.addNewsItem("A new tree has been planted!");
                }
                break;
            case GameConfig.EMOJIS.WORM:
                if (this.entityManager.getWormCount() < GameConfig.MAX_WORMS) {
                    this.entityManager.addWorm(x, y);
                    this.uiManager.addNewsItem("A worm has been added to the ecosystem!");
                }
                break;
        }
    }

    handleEntityCreated(data) {
        const { type, id } = data;
        this.uiManager.addNewsItem(`A new ${type} (ID: ${id}) has joined the ecosystem!`);
    }

    handleEntityRemoved(data) {
        const { type, id, reason } = data;
        this.uiManager.addNewsItem(`${type} (ID: ${id}) has left the ecosystem. Reason: ${reason}`);
    }

    unlockTree() {
        this.stateManager.unlockTree();
        this.uiManager.unlockTree();
    }

    addWormToPanel() {
        if (this.stateManager.shouldUnlockWorm()) {
            this.uiManager.addWormToPanel();
            this.stateManager.unlockWorm();
        }
    }

    checkWinCondition() {
        if (this.stateManager.checkWinCondition()) {
            this.isRunning = false;
            this.uiManager.showWinScreen();
        }
    }

    reset() {
        this.entityManager.reset();
        this.stateManager.reset();
        this.uiManager.reset();
        this.cycleTimer = 0;
        this.dayNightCycle = 'day';
        this.isRunning = true;
        this.gameLoop();
    }
}
