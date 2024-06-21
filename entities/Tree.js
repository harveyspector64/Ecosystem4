// src/entities/Tree.js

import { Entity } from './Entity.js';
import { GameConfig } from '../config/GameConfig.js';

export class Tree extends Entity {
    constructor(x, y) {
        super(x, y, 'tree');
        this.nestCount = 0;
    }

    update(deltaTime) {
        // Trees don't need much updating, but we could add growth stages here
    }

    addNest() {
        if (this.nestCount < GameConfig.MAX_NESTS_PER_TREE) {
            this.nestCount++;
            // Update visual representation
            this.updateNestVisual();
            return true;
        }
        return false;
    }

    removeNest() {
        if (this.nestCount > 0) {
            this.nestCount--;
            // Update visual representation
            this.updateNestVisual();
            return true;
        }
        return false;
    }

    updateNestVisual() {
        // Update the tree's visual to show nests
        // This could be done by adding/removing nest emojis to the tree's text content
        let nestEmojis = '🥚'.repeat(this.nestCount);
        this.element.textContent = GameConfig.EMOJIS.TREE + nestEmojis;
    }

    canAddNest() {
        return this.nestCount < GameConfig.MAX_NESTS_PER_TREE;
    }
}
