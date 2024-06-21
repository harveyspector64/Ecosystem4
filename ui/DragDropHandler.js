// src/ui/DragDropHandler.js

export class DragDropHandler {
    constructor(uiManager) {
        this.uiManager = uiManager;
    }

    setup() {
        this.uiManager.emojiPanel.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.uiManager.playArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uiManager.playArea.addEventListener('drop', this.handleDrop.bind(this));
    }

    handleDragStart(e) {
        if (e.target.classList.contains('emoji') && !e.target.classList.contains('disabled')) {
            e.dataTransfer.setData('text/plain', e.target.textContent);
        }
    }

    handleDragOver(e) {
        e.preventDefault(); // Necessary to allow dropping
    }

    handleDrop(e) {
        e.preventDefault();
        const emoji = e.dataTransfer.getData('text/plain');
        if (emoji) {
            const rect = this.uiManager.playArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.uiManager.handleEmojiDrop(emoji, x, y);
        }
    }
}
