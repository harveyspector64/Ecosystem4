export class DragDropHandler {
    constructor(uiManager) {
        this.uiManager = uiManager;
    }

    initialize() {
        this.uiManager.emojiPanel.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.uiManager.game.renderer.playArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uiManager.game.renderer.playArea.addEventListener('drop', this.handleDrop.bind(this));
    }

    handleDragStart(e) {
        if (e.target.classList.contains('emoji') && !e.target.classList.contains('disabled')) {
            e.dataTransfer.setData('text/plain', e.target.textContent);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        const emoji = e.dataTransfer.getData('text/plain');
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.uiManager.handleEmojiDrop(emoji, x, y);
    }
}
