// src/entities/Bird.js

import { Entity } from './Entity.js';
import { GameConfig } from '../config/GameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class Bird extends Entity {
    constructor(x, y) {
        super(x, y, 'bird');
        this.setState('flying');
        this.flightAngle = Math.random() * Math.PI * 2;
        this.flightSpeed = GameConfig.BIRD_FLIGHT_SPEED;
        this.walkSpeed = GameConfig.BIRD_WALK_SPEED;
        this.timeAlive = 0;
        this.foodConsumed = 0;
        this.walkCount = 0;
    }

    update(deltaTime, entityManager) {
        this.timeAlive += deltaTime;

        switch (this.state) {
            case 'flying':
                this.fly(deltaTime, entityManager);
                break;
            case 'perching':
                this.perch(deltaTime, entityManager);
                break;
            case 'descending':
                this.descend(deltaTime);
                break;
            case 'walking':
                this.walk(deltaTime, entityManager);
                break;
            case 'movingToWorm':
                this.moveToWorm(deltaTime, entityManager);
                break;
            case 'eating':
                this.eat(deltaTime);
                break;
            case 'ascending':
                this.ascend(deltaTime);
                break;
        }

        this.updateHunger(-GameConfig.BIRD_HUNGER_RATE * deltaTime);

        if (this.hunger <= 0) {
            this.die(entityManager);
        }

        this.checkForNestCreation(entityManager);
    }

    fly(deltaTime, entityManager) {
        // Implement bird flight pattern
        let dx = Math.cos(this.flightAngle) * this.flightSpeed * deltaTime;
        let dy = Math.sin(this.flightAngle) * this.flightSpeed * deltaTime;

        let newX = this.x + dx;
        let newY = this.y + dy;

        const playArea = document.getElementById('play-area');
        if (newX < 0 || newX > playArea.clientWidth || newY < 0 || newY > playArea.clientHeight) {
            this.flightAngle = Math.random() * Math.PI * 2; // Change direction if hitting boundary
        } else {
            this.updatePosition(newX, newY);
        }

        // Occasionally change direction
        if (Math.random() < GameConfig.BIRD_DIRECTION_CHANGE_CHANCE * deltaTime) {
            this.flightAngle += (Math.random() - 0.5) * Math.PI / 2;
        }

        // Check for hunger and decide to land or perch
        if (this.isHungry()) {
            this.setState('descending');
        } else if (Math.random() < GameConfig.BIRD_PERCH_CHANCE * deltaTime) {
            const nearestTree = entityManager.findNearestEntity(this, entityManager.entities.trees, GameConfig.BIRD_TREE_DETECTION_RANGE);
            if (nearestTree) {
                this.setState('perching');
                this.updatePosition(nearestTree.x, nearestTree.y - 20); // Adjust Y to perch on top of the tree
            }
        }

        // Check for butterflies to eat
        this.checkForButterflies(entityManager);
    }

    perch(deltaTime, entityManager) {
        // Bird is resting on a tree
        if (Math.random() < GameConfig.BIRD_LEAVE_PERCH_CHANCE * deltaTime || this.isHungry()) {
            this.setState('flying');
        }
    }

    descend(deltaTime) {
        // Descending animation
        this.y += GameConfig.BIRD_DESCEND_SPEED * deltaTime;
        this.updatePosition(this.x, this.y);
        
        if (this.y >= GameConfig.GROUND_LEVEL) {
            this.y = GameConfig.GROUND_LEVEL;
            this.setState('walking');
            this.walkCount = 0;
        }
    }

    walk(deltaTime, entityManager) {
        this.walkCount++;
        const stepCount = 5 + Math.floor(Math.random() * 5);

        if (this.walkCount < stepCount) {
            const angle = Math.random() * Math.PI * 2;
            const distance = this.walkSpeed * deltaTime;
            this.x += Math.cos(angle) * distance;
            this.y += Math.sin(angle) * distance;
            this.updatePosition(this.x, this.y);

            // Look for worms
            const nearestWorm = entityManager.findNearestEntity(this, entityManager.entities.worms, GameConfig.BIRD_WORM_DETECTION_RANGE);
            if (nearestWorm) {
                this.setState('movingToWorm');
                this.targetWorm = nearestWorm;
            }
        } else {
            // Pause and look around
            setTimeout(() => {
                if (this.state === 'walking') {
                    this.walkCount = 0;
                }
            }, Math.random() * 2000 + 1000);
        }
    }

    moveToWorm(deltaTime, entityManager) {
        if (!this.targetWorm || !entityManager.entities.worms.includes(this.targetWorm)) {
            this.setState('walking');
            return;
        }

        const angle = Math.atan2(this.targetWorm.y - this.y, this.targetWorm.x - this.x);
        const distance = this.walkSpeed * deltaTime;
        this.x += Math.cos(angle) * distance;
        this.y += Math.sin(angle) * distance;
        this.updatePosition(this.x, this.y);

        if (MathUtils.getDistance(this, this.targetWorm) < GameConfig.BIRD_EATING_RANGE) {
            this.setState('eating');
            entityManager.removeEntity(this.targetWorm);
            this.targetWorm = null;
        }
    }

    eat(deltaTime) {
        this.updateHunger(GameConfig.BIRD_FEED_RATE * deltaTime);
        this.foodConsumed += GameConfig.BIRD_FEED_RATE * deltaTime;
        if (!this.isHungry()) {
            this.setState('ascending');
        }
    }

    ascend(deltaTime) {
        // Ascending animation
        this.y -= GameConfig.BIRD_ASCEND_SPEED * deltaTime;
        this.updatePosition(this.x, this.y);
        
        if (this.y <= GameConfig.SKY_LEVEL) {
            this.setState('flying');
        }
    }

    checkForButterflies(entityManager) {
        const nearbyButterfly = entityManager.findNearestEntity(this, entityManager.entities.butterflies, GameConfig.BIRD_BUTTERFLY_DETECTION_RANGE);
        if (nearbyButterfly) {
            this.updateHunger(GameConfig.BIRD_BUTTERFLY_FEED_AMOUNT);
            this.foodConsumed += GameConfig.BIRD_BUTTERFLY_FEED_AMOUNT;
            entityManager.removeEntity(nearbyButterfly);
        }
    }

    checkForNestCreation(entityManager) {
        if (this.foodConsumed >= GameConfig.BIRD_FOOD_FOR_NEST) {
            const nearestTree = entityManager.findNearestEntity(this, entityManager.entities.trees, GameConfig.BIRD_TREE_DETECTION_RANGE);
            if (nearestTree && nearestTree.canAddNest()) {
                nearestTree.addNest();
                this.foodConsumed = 0;
                entityManager.game.eventSystem.publish('nestCreated', { tree: nearestTree });
            }
        }
    }

    die(entityManager) {
        entityManager.game.eventSystem.publish('birdDied', { bird: this });
        entityManager.removeEntity(this);
    }
}
