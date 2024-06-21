// src/entities/Entity.js

import { GameConfig } from '../config/GameConfig.js';

export class Entity {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.element = this.createElement();
        this.state = 'idle';
        this.hunger = 100;
        this.foodConsumed = 0;
    }

    createElement() {
        const element = document.createElement('div');
        element.classList.add('emoji', this.type);
        element.textContent = GameConfig.EMOJIS[this.type.toUpperCase()];
        element.style.position = 'absolute';
        element.style.left = `${this.x}px`;
        element.style.top = `${this.y}px`;
        return element;
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    setState(newState) {
        console.log(`${this.type} state transition: ${this.state} -> ${newState}`);
        this.state = newState;
    }

    updateHunger(amount) {
        this.hunger = Math.max(0, Math.min(100, this.hunger + amount));
        this.foodConsumed += Math.max(0, amount);
    }

    isHungry() {
        return this.hunger < 60;
    }

    update(deltaTime) {
        // To be implemented by subclasses
    }

    render(renderer) {
        renderer.renderEntity(this);
    }
}
