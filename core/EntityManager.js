// src/core/EntityManager.js

import { Butterfly } from '../entities/Butterfly.js';
import { Bird } from '../entities/Bird.js';
import { Worm } from '../entities/Worm.js';
import { Bush } from '../entities/Bush.js';
import { Tree } from '../entities/Tree.js';
import { ButterflyPool } from '../entities/ButterflyPool.js';
import { GameConfig } from '../config/GameConfig.js';

export class EntityManager {
    constructor() {
        this.entities = {
            butterflies: [],
            birds: [],
            worms: [],
            bushes: [],
            trees: []
        };
        this.butterflyPool = new ButterflyPool();
    }

    initialize() {
        // Any initialization logic for EntityManager
    }

    addBush(x, y) {
        const bush = new Bush(x, y);
        this.entities.bushes.push(bush);
        this.addButterflies(bush);
    }

    addTree(x, y) {
        const tree = new Tree(x, y);
        this.entities.trees.push(tree);
    }

    addBird(x, y) {
        const bird = new Bird(x, y);
        this.entities.birds.push(bird);
    }

    addWorm(x, y) {
        const worm = new Worm(x, y);
        this.entities.worms.push(worm);
    }

    addButterflies(bush) {
        const numButterflies = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numButterflies; i++) {
            const butterflyElement = this.butterflyPool.get();
            const butterfly = new Butterfly(butterflyElement, bush);
            this.entities.butterflies.push(butterfly);
        }
    }

    updateEntities(currentTime) {
        this.updateEntityType(this.entities.butterflies, currentTime);
        this.updateEntityType(this.entities.birds, currentTime);
        this.updateEntityType(this.entities.worms, currentTime);
        this.updateEntityType(this.entities.bushes, currentTime);
        this.updateEntityType(this.entities.trees, currentTime);

        this.handleInteractions();
    }

    updateEntityType(entities, currentTime) {
        entities.forEach(entity => entity.update(currentTime));
    }

    handleInteractions() {
        this.handleButterflyPollination();
        this.handleBirdHunting();
    }

    handleButterflyPollination() {
        this.entities.butterflies.forEach(butterfly => {
            if (butterfly.carriesPollen) {
                const nearbyBush = this.findNearbyBush(butterfly);
                if (nearbyBush && nearbyBush !== butterfly.pollenSource) {
                    if (Math.random() < GameConfig.POLLINATION_CHANCE) {
                        this.createNewFlowerBush(nearbyBush);
                    }
                    butterfly.carriesPollen = false;
                    butterfly.pollenSource = null;
                }
            } else {
                const nearbyBush = this.findNearbyBush(butterfly);
                if (nearbyBush) {
                    butterfly.carriesPollen = true;
                    butterfly.pollenSource = nearbyBush;
                }
            }
        });
    }

handleBirdHunting() {
        this.entities.birds.forEach(bird => {
            if (bird.isHunting) {
                const nearbyWorm = this.findNearbyWorm(bird);
                if (nearbyWorm) {
                    bird.hunt(nearbyWorm);
                    this.removeWorm(nearbyWorm);
                }
            }
        });
    }

    findNearbyBush(butterfly) {
        return this.entities.bushes.find(bush => 
            this.getDistance(butterfly.getPosition(), bush.getPosition()) < GameConfig.BUTTERFLY_DETECTION_RADIUS
        );
    }

    findNearbyWorm(bird) {
        return this.entities.worms.find(worm => 
            this.getDistance(bird.getPosition(), worm.getPosition()) < GameConfig.BIRD_HUNTING_RADIUS
        );
    }

    createNewFlowerBush(nearBush) {
        const bushPosition = nearBush.getPosition();
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 100 + 50; // 50-150px away
        const newPosition = {
            x: bushPosition.x + distance * Math.cos(angle),
            y: bushPosition.y + distance * Math.sin(angle)
        };
        this.addBush(newPosition.x, newPosition.y);
    }

    removeWorm(worm) {
        const index = this.entities.worms.indexOf(worm);
        if (index > -1) {
            this.entities.worms.splice(index, 1);
        }
    }

    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    renderEntities(renderer) {
        Object.values(this.entities).flat().forEach(entity => {
            entity.render(renderer);
        });
    }

    getEntitiesInRadius(position, radius) {
        return Object.values(this.entities).flat().filter(entity => 
            this.getDistance(position, entity.getPosition()) <= radius
        );
    }
}
