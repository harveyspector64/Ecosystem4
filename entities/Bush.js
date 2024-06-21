// src/entities/Bush.js

import { Entity } from './Entity.js';
import { GameConfig } from '../config/GameConfig.js';

export class Bush extends Entity {
    constructor(x, y) {
        super(x, y, 'bush');
        this.pollinationCount = 0;
        this.health = 100;
    }

    update(deltaTime) {
        // Decrease health if not enough butterflies around
        if (this.getNeighboringButterflies().length < GameConfig.MIN_BUTTERFLIES_FOR_BUSH_HEALTH) {
            this.health -= GameConfig.BUSH_HEALTH_DECAY_RATE * deltaTime;
        } else {
            this.health = Math.min(100, this.health + GameConfig.BUSH_HEALTH_REGEN_RATE * deltaTime);
        }

        if (this.health <= 0) {
            this.die();
        }
    }

    getNeighboringButterflies() {
        // This should be implemented in EntityManager
        // For now, return an empty array
        return [];
    }

    pollinate() {
        this.pollinationCount++;
        if (this.pollinationCount >= GameConfig.POLLINATION_THRESHOLD) {
            this.triggerNewBushCreation();
            this.pollinationCount = 0;
        }
    }

    triggerNewBushCreation() {
        // This should be handled by the game logic
        // For now, just log it
        console.log('New bush should be created');
    }

    die() {
        // This should be handled by the EntityManager
        console.log('Bush has died');
    }
}
