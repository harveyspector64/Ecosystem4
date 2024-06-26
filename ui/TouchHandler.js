// src/ui/TouchHandler.js

export class TouchHandler {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.draggedEmoji = null;
        this.draggedElement = null;
    }

    setup() {
        this.uiManager.emojiPanel.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(e) {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target.classList.contains('emoji') && !target.classList.contains('disabled')) {
            e.preventDefault(); // Prevent scrolling
            this.draggedEmoji = target.textContent;
            this.draggedElement = target.cloneNode(true);
            this.draggedElement.style.position = 'absolute';
            this.draggedElement.style.pointerEvents = 'none';
            this.draggedElement.style.opacity = '0.7';
            document.body.appendChild(this.draggedElement);
            this.updateDraggedPosition(touch);
        }
    }

    handleTouchMove(e) {
        if (this.draggedElement) {
            e.preventDefault(); // Prevent scrolling while dragging
            const touch = e.touches[0];
            this.updateDraggedPosition(touch);
        }
    }

    handleTouchEnd(e) {
        if (this.draggedEmoji) {
            const touch = e.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
            if (dropTarget === this.uiManager.game.renderer.playArea) {
                const rect = this.uiManager.game.renderer.playArea.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                this.uiManager.handleEmojiDrop(this.draggedEmoji, x, y);
            }
            document.body.removeChild(this.draggedElement);
            this.draggedEmoji = null;
            this.draggedElement = null;
        }
    }

    updateDraggedPosition(touch) {
        this.draggedElement.style.left = `${touch.clientX - 20}px`;
        this.draggedElement.style.top = `${touch.clientY - 20}px`;
    }
}
