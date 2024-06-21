// src/entities/Worm.js

import { Entity } from './Entity.js';
import { GameConfig } from '../config/GameConfig.js';

export class Worm extends Entity {
    constructor(x, y) {
        super(x, y, 'worm');
        this.wiggleTimer = 0;
        this.wiggleDirection = 1;
    }

    update(deltaTime, entityManager) {
        this.wiggle(deltaTime);
    }

    wiggle(deltaTime) {
        this.wiggleTimer += deltaTime;
        if (this.wiggleTimer >= GameConfig.WORM_WIGGLE_INTERVAL) {
            this.wiggleTimer = 0;
            this.wiggleDirection *= -1;
            
            const wiggleAmount = Math.random() * GameConfig.WORM_WIGGLE_AMOUNT;
            const newX = this.x + (wiggleAmount * this.wiggleDirection);
            
            // Ensure the worm stays within the play area
            const playArea = document.getElementById('play-area');
            this.x = Math.max(0, Math.min(newX, playArea.clientWidth - this.element.clientWidth));
            
            this.updatePosition(this.x, this.y);
        }
    }

    render(renderer) {
        super.render(renderer);
        // Add any worm-specific rendering here, like wiggle animation
        this.element.style.transform = `translateX(${this.wiggleDirection * 2}px)`;
    }
}
