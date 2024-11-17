class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create(data) {
        this.parentSceneKey = data.parentSceneKey;
        console.log(`Pausing with parent: ${this.parentSceneKey}`);

        // Add the menu background
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);

        // Add menu text
        this.add.text(400, 200, 'Paused', { fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        this.add.text(400, 400, 'Press ESC to Resume', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5, 0.5);

        // Listen for the Escape key to resume the game
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.resume(this.parentSceneKey);
        });
      
        // Get the current game width and height
        const { width, height } = this.scale;

        // Add a dark semi-transparent overlay to deemphasize the parent scene
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.depth = -1;
    }
}
