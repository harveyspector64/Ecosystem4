// src/entities/Butterfly.js

import { Entity } from './Entity.js';
import { GameConfig } from '../config/GameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class Butterfly extends Entity {
    constructor(x, y, homeBush) {
        super(x, y, 'butterfly');
        this.homeBush = homeBush;
        this.carriesPollen = false;
        this.pollenSource = null;
        this.setState('flying');
        this.flightAngle = Math.random() * Math.PI * 2;
        this.flightSpeed = GameConfig.BUTTERFLY_FLIGHT_SPEED;
        this.flutterAmplitude = GameConfig.BUTTERFLY_FLUTTER_AMPLITUDE;
        this.flutterFrequency = GameConfig.BUTTERFLY_FLUTTER_FREQUENCY;
        this.timeAlive = 0;
    }

    update(deltaTime, entityManager) {
        this.timeAlive += deltaTime;

        switch (this.state) {
            case 'flying':
                this.fly(deltaTime, entityManager);
                break;
            case 'feeding':
                this.feed(deltaTime);
                break;
        }

        this.updateHunger(-GameConfig.BUTTERFLY_HUNGER_RATE * deltaTime);

        if (this.isHungry() && this.state !== 'feeding') {
            this.findFlower(entityManager);
        }

        if (this.hunger <= 0) {
            this.die(entityManager);
        }
    }

    fly(deltaTime, entityManager) {
        // Calculate base movement
        let dx = Math.cos(this.flightAngle) * this.flightSpeed * deltaTime;
        let dy = Math.sin(this.flightAngle) * this.flightSpeed * deltaTime;

        // Add flutter effect
        dx += Math.sin(this.timeAlive * this.flutterFrequency) * this.flutterAmplitude;
        dy += Math.cos(this.timeAlive * this.flutterFrequency) * this.flutterAmplitude;

        // Update position
        let newX = this.x + dx;
        let newY = this.y + dy;

        // Check boundaries and adjust if necessary
        const playArea = document.getElementById('play-area');
        if (newX < 0 || newX > playArea.clientWidth || newY < 0 || newY > playArea.clientHeight) {
            this.flightAngle = Math.random() * Math.PI * 2; // Change direction if hitting boundary
        } else {
            this.updatePosition(newX, newY);
        }

        // Occasionally change direction
        if (Math.random() < GameConfig.BUTTERFLY_DIRECTION_CHANGE_CHANCE * deltaTime) {
            this.flightAngle += (Math.random() - 0.5) * Math.PI / 2;
        }

        // Check for nearby bushes to pollinate
        this.checkForPollination(entityManager);
    }

    feed(deltaTime) {
        this.updateHunger(GameConfig.BUTTERFLY_FEED_RATE * deltaTime);
        if (!this.isHungry()) {
            this.setState('flying');
        }
    }

    findFlower(entityManager) {
        const nearestBush = entityManager.findNearestEntity(this, entityManager.entities.bushes, GameConfig.BUTTERFLY_DETECTION_RADIUS);
        if (nearestBush) {
            const bushPos = nearestBush.getPosition();
            this.updatePosition(bushPos.x, bushPos.y);
            this.setState('feeding');
        }
    }

    checkForPollination(entityManager) {
        const nearbyBush = entityManager.findNearestEntity(this, entityManager.entities.bushes, GameConfig.BUTTERFLY_POLLINATION_RANGE);
        if (nearbyBush) {
            this.pollinate(nearbyBush, entityManager);
        }
    }

    pollinate(bush, entityManager) {
        if (this.carriesPollen && bush !== this.pollenSource) {
            if (Math.random() < GameConfig.POLLINATION_CHANCE) {
                entityManager.game.eventSystem.publish('createNewBush', { nearBush: bush });
            }
            this.carriesPollen = false;
            this.pollenSource = null;
        } else {
            this.carriesPollen = true;
            this.pollenSource = bush;
        }
        bush.pollinate();
    }

    die(entityManager) {
        entityManager.game.eventSystem.publish('butterflyDied', { butterfly: this });
        entityManager.removeEntity(this);
    }
}
