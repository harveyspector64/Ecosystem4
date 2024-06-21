// src/core/StateManager.js

import { GameConfig } from '../config/GameConfig.js';

export class StateManager {
    constructor() {
        this.state = {
            firstBirdLanded: false,
            bushesPlanted: 0,
            treesPlanted: 0,
            wormCount: 0,
            butterflyCount: 0,
            birdCount: 0,
            gameTime: 0,
            dayNightCycle: 'day',
        };
    }

    initialize() {
        // Any initial state setup can go here
    }

    update(deltaTime) {
        this.state.gameTime += deltaTime;
        this.updateDayNightCycle();
    }

    updateDayNightCycle() {
        const cycleLength = GameConfig.DAY_NIGHT_CYCLE_LENGTH;
        const timeOfDay = this.state.gameTime % cycleLength;
        this.state.dayNightCycle = timeOfDay < cycleLength / 2 ? 'day' : 'night';
    }

    incrementBushCount() {
        this.state.bushesPlanted++;
    }

    incrementTreeCount() {
        this.state.treesPlanted++;
    }

    setFirstBirdLanded() {
        this.state.firstBirdLanded = true;
    }

    canPlantBush() {
        return this.state.bushesPlanted < GameConfig.MAX_BUSHES;
    }

    canPlantTree() {
        return this.state.treesPlanted < GameConfig.MAX_TREES;
    }

    incrementWormCount() {
        this.state.wormCount++;
    }

    decrementWormCount() {
        this.state.wormCount = Math.max(0, this.state.wormCount - 1);
    }

    incrementButterflyCount() {
        this.state.butterflyCount++;
    }

    decrementButterflyCount() {
        this.state.butterflyCount = Math.max(0, this.state.butterflyCount - 1);
    }

    incrementBirdCount() {
        this.state.birdCount++;
    }

    decrementBirdCount() {
        this.state.birdCount = Math.max(0, this.state.birdCount - 1);
    }

    getState() {
        return { ...this.state };
    }
}
