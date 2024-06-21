// src/rendering/Renderer.js

export class Renderer {
    constructor() {
        this.playArea = null;
        this.entities = new Set();
    }

    initialize(playAreaElement) {
        this.playArea = playAreaElement;
    }

    addToScene(element) {
        this.playArea.appendChild(element);
        this.entities.add(element);
    }

    removeFromScene(element) {
        if (this.entities.has(element)) {
            this.playArea.removeChild(element);
            this.entities.delete(element);
        }
    }

    clear() {
        this.entities.forEach(entity => {
            this.playArea.removeChild(entity);
        });
        this.entities.clear();
    }

    updateEntityPosition(element, x, y) {
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }

    applyDayNightEffect(isNight) {
        if (isNight) {
            this.playArea.classList.add('night-mode');
        } else {
            this.playArea.classList.remove('night-mode');
        }
    }

    shake(element, intensity = 5, duration = 500) {
        const originalPosition = element.style.transform;
        const start = performance.now();

        const animate = (time) => {
            const elapsed = time - start;
            if (elapsed < duration) {
                const x = (Math.random() - 0.5) * intensity;
                const y = (Math.random() - 0.5) * intensity;
                element.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(animate);
            } else {
                element.style.transform = originalPosition;
            }
        };

        requestAnimationFrame(animate);
    }

    fadeIn(element, duration = 1000) {
        element.style.opacity = 0;
        element.style.transition = `opacity ${duration}ms`;
        setTimeout(() => {
            element.style.opacity = 1;
        }, 10);
    }

    fadeOut(element, duration = 1000) {
        element.style.opacity = 1;
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = 0;
    }

    renderEntity(entity) {
        // This method can be expanded to handle more complex rendering logic
        this.updateEntityPosition(entity.element, entity.x, entity.y);
    }
}
