// src/core/EntityManager.js

import { Butterfly } from '../entities/Butterfly.js';
import { Bird } from '../entities/Bird.js';
import { Worm } from '../entities/Worm.js';
import { Bush } from '../entities/Bush.js';
import { Tree } from '../entities/Tree.js';
import { GameConfig } from '../config/GameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class EntityManager {
    constructor(game) {
        this.game = game;
        this.entities = {
            butterflies: [],
            birds: [],
            worms: [],
            bushes: [],
            trees: []
        };
    }

    addBush(x, y) {
        const bush = new Bush(x, y);
        this.entities.bushes.push(bush);
        this.game.renderer.addToScene(bush.element);
        this.spawnButterfliesForBush(bush);
    }

    addTree(x, y) {
        const tree = new Tree(x, y);
        this.entities.trees.push(tree);
        this.game.renderer.addToScene(tree.element);
    }

    addBird(x, y) {
        const bird = new Bird(x, y);
        this.entities.birds.push(bird);
        this.game.renderer.addToScene(bird.element);
    }

    addWorm(x, y) {
        const worm = new Worm(x, y);
        this.entities.worms.push(worm);
        this.game.renderer.addToScene(worm.element);
    }

    spawnButterfliesForBush(bush) {
        const numButterflies = Math.floor(Math.random() * 2) + 1; // 1-2 butterflies
        for (let i = 0; i < numButterflies; i++) {
            const butterflyX = bush.x + (Math.random() - 0.5) * 100;
            const butterflyY = bush.y + (Math.random() - 0.5) * 100;
            const butterfly = new Butterfly(butterflyX, butterflyY, bush);
            this.entities.butterflies.push(butterfly);
            this.game.renderer.addToScene(butterfly.element);
        }
    }

updateEntities(deltaTime) {
    Object.values(this.entities).forEach(entityGroup => {
        entityGroup.forEach(entity => entity.update(deltaTime, this));
    });

    this.handleInteractions();
}

    handleInteractions() {
        this.handleButterflyPollination();
        this.handleBirdHunting();
    }

    handleButterflyPollination() {
        this.entities.butterflies.forEach(butterfly => {
            const nearbyBush = this.findNearestEntity(butterfly, this.entities.bushes, GameConfig.BUTTERFLY_POLLINATION_RANGE);
            if (nearbyBush) {
                butterfly.pollinate(nearbyBush);
            }
        });
    }

    handleBirdHunting() {
        this.entities.birds.forEach(bird => {
            if (bird.isHunting()) {
                const nearbyWorm = this.findNearestEntity(bird, this.entities.worms, GameConfig.BIRD_HUNTING_RANGE);
                if (nearbyWorm) {
                    bird.hunt(nearbyWorm);
                    this.removeEntity(nearbyWorm);
                }
            }
        });
    }

    findNearestEntity(entity, entityGroup, maxDistance) {
        return entityGroup.reduce((nearest, current) => {
            const distance = MathUtils.getDistance(entity, current);
            if (distance < maxDistance && (!nearest || distance < MathUtils.getDistance(entity, nearest))) {
                return current;
            }
            return nearest;
        }, null);
    }

    removeEntity(entity) {
        for (let groupName in this.entities) {
            const index = this.entities[groupName].indexOf(entity);
            if (index !== -1) {
                this.entities[groupName].splice(index, 1);
                this.game.renderer.removeFromScene(entity.element);
                break;
            }
        }
    }

    getEntitiesInRadius(position, radius) {
        return Object.values(this.entities).flat().filter(entity => 
            MathUtils.getDistance(position, entity) <= radius
        );
    }
}
