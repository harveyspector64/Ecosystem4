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
        this.lastUpdateTime = 0;
        this.lastCycle = 'day';
    }

    initialize() {
        this.uiManager.initialize();
        this.stateManager.initialize();
        this.entityManager.initialize();
        this.renderer.initialize(document.getElementById('play-area'));

        // Set up event listeners
        this.eventSystem.subscribe('emojiAdded', this.handleEmojiAdded.bind(this));
        this.eventSystem.subscribe('birdLanded', this.handleBirdLanded.bind(this));
        this.eventSystem.subscribe('butterflyPollinated', this.handleButterflyPollinated.bind(this));
        
        this.isRunning = true;
        this.lastUpdateTime = performance.now();
        this.gameLoop();
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
                    this.stateManager.incrementBirdCount();
                }
                break;
            case GameConfig.EMOJIS.WORM:
                this.entityManager.addWorm(x, y);
                this.stateManager.incrementWormCount();
                break;
        }
        this.eventSystem.gameEvent('logEvent', `A ${this.getEmojiName(emoji)} has been added to the ecosystem!`);
    }

    handleBirdLanded(data) {
        const { birdId } = data;
        this.eventSystem.gameEvent('logEvent', `Bird ${birdId} has landed!`);
        if (!this.stateManager.getState().firstBirdLanded) {
            this.stateManager.setFirstBirdLanded();
            this.uiManager.addWormToPanel();
        }
    }

    handleButterflyPollinated(data) {
        const { bushId } = data;
        this.eventSystem.gameEvent('logEvent', `A butterfly has pollinated bush ${bushId}!`);
    }

    getEmojiName(emoji) {
        switch(emoji) {
            case GameConfig.EMOJIS.BUSH: return 'bush';
            case GameConfig.EMOJIS.TREE: return 'tree';
            case GameConfig.EMOJIS.BUTTERFLY: return 'butterfly';
            case GameConfig.EMOJIS.BIRD: return 'bird';
            case GameConfig.EMOJIS.WORM: return 'worm';
            default: return 'creature';
        }
    }

    gameLoop(currentTime) {
        if (!this.isRunning) return;

        this.update(currentTime);
        this.render();

        this.performanceMonitor.update(currentTime);

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(currentTime) {
        const deltaTime = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;

        this.stateManager.update(deltaTime);
        this.entityManager.updateEntities(deltaTime);
        
        // Check day/night cycle and update accordingly
        const currentCycle = this.stateManager.getState().dayNightCycle;
        if (currentCycle !== this.lastCycle) {
            this.lastCycle = currentCycle;
            this.eventSystem.gameEvent('dayNightChange', currentCycle);
        }
    }

    render() {
        this.renderer.clear();
        this.entityManager.renderEntities(this.renderer);
    }
}
