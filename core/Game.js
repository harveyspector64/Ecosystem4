// src/core/Game.js

import { EntityManager } from './EntityManager.js';
import { EventSystem } from './EventSystem.js';
import { StateManager } from './StateManager.js';
import { UIManager } from '../ui/UIManager.js';
import { Renderer } from '../rendering/Renderer.js';
import { GameConfig } from '../config/GameConfig.js';

export class Game {
    constructor() {
        this.entityManager = new EntityManager(this);
        this.eventSystem = new EventSystem();
        this.stateManager = new StateManager();
        this.uiManager = new UIManager(this);
        this.renderer = new Renderer();

        this.isRunning = false;
        this.lastUpdateTime = 0;
        this.dayNightCycle = 'day';
        this.cycleTimer = 0;
    }

    initialize() {
        this.uiManager.initialize();
        this.stateManager.initialize();
        this.entityManager.initialize();
        this.renderer.initialize(document.getElementById('play-area'));

        // Set up event listeners
        this.eventSystem.subscribe('emojiAdded', this.handleEmojiAdded.bind(this));
        this.eventSystem.subscribe('butterflyDied', this.handleButterflyDied.bind(this));
        this.eventSystem.subscribe('birdDied', this.handleBirdDied.bind(this));
        this.eventSystem.subscribe('createNewBush', this.handleCreateNewBush.bind(this));
        
        this.isRunning = true;
        this.lastUpdateTime = performance.now();
        this.gameLoop(this.lastUpdateTime);
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
        this.updateEntityCounts();
    }

    updateDayNightCycle(deltaTime) {
        this.cycleTimer += deltaTime * 1000; // Convert back to milliseconds

        const totalCycleTime = GameConfig.DAY_DURATION + GameConfig.NIGHT_DURATION;
        if (this.cycleTimer >= totalCycleTime) {
            this.cycleTimer -= totalCycleTime;
        }

        const newCycle = this.cycleTimer < GameConfig.DAY_DURATION ? 'day' : 'night';
        
        if (newCycle !== this.dayNightCycle) {
            this.dayNightCycle = newCycle;
            this.eventSystem.publish('dayNightChange', this.dayNightCycle);
            this.handleDayNightChange();
        }
    }

    handleDayNightChange() {
        if (this.dayNightCycle === 'night') {
            this.entityManager.hideAllButterflies();
            this.renderer.applyDayNightEffect(true);
            // TODO: Spawn nocturnal animals
        } else {
            this.entityManager.showAllButterflies();
            this.renderer.applyDayNightEffect(false);
            // TODO: Remove nocturnal animals
        }
        this.uiManager.updateDayNightCycle(this.dayNightCycle);
    }

    handleEmojiAdded(data) {
        const { emoji, x, y } = data;
        switch(emoji) {
            case GameConfig.EMOJIS.BUSH:
                if (this.stateManager.canPlantBush()) {
                    this.entityManager.addBush(x, y);
                    this.stateManager.incrementBushCount();
                    this.uiManager.unlockTree();
                }
                break;
            case GameConfig.EMOJIS.TREE:
                if (this.stateManager.canPlantTree()) {
                    this.entityManager.addTree(x, y);
                    this.stateManager.incrementTreeCount();
                    this.entityManager.addBird(x, y);
                }
                break;
            case GameConfig.EMOJIS.WORM:
                if (this.entityManager.getWormCount() < GameConfig.MAX_WORMS) {
                    this.entityManager.addWorm(x, y);
                }
                break;
        }
        this.eventSystem.gameEvent('logEvent', `A ${this.getEmojiName(emoji)} has been added to the ecosystem!`);
    }

    handleButterflyDied(data) {
        this.eventSystem.gameEvent('logEvent', `A butterfly has died.`);
    }

    handleBirdDied(data) {
        this.eventSystem.gameEvent('logEvent', `A bird has died.`);
    }

    handleCreateNewBush(data) {
        const { nearBush } = data;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50; // 50-150px away
        const newX = nearBush.x + distance * Math.cos(angle);
        const newY = nearBush.y + distance * Math.sin(angle);
        
        if (this.stateManager.canPlantBush()) {
            this.entityManager.addBush(newX, newY);
            this.stateManager.incrementBushCount();
            this.eventSystem.gameEvent('logEvent', `A new bush has grown from pollination!`);
        }
    }

    getEmojiName(emoji) {
        for (let key in GameConfig.EMOJIS) {
            if (GameConfig.EMOJIS[key] === emoji) return key.toLowerCase();
        }
        return 'unknown';
    }

    updateEntityCounts() {
        const counts = {
            butterflies: this.entityManager.entities.butterflies.length,
            birds: this.entityManager.entities.birds.length,
            worms: this.entityManager.entities.worms.length,
            bushes: this.entityManager.entities.bushes.length,
            trees: this.entityManager.entities.trees.length
        };
        this.uiManager.updateEntityCounts(counts);
    }

    render() {
        this.entityManager.renderEntities(this.renderer);
    }
}
