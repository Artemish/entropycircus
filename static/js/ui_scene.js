class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: true });
    }

    create() {
        // Create graphics object for minimap
        this.minimapGraphics = this.add.graphics();
    }

    // update() {
    //     this.renderMinimap();
    // }
    

    renderMinimap(ships, midpoint) {
        // console.log("Ships in scene: ", ships);

        const borderSize = 4;    // Size of the border

        // Get the camera view width and height
        const cameraWidth = this.cameras.main.width;
        const cameraHeight = this.cameras.main.height;

        const aspectRatio = cameraWidth / cameraHeight;
        const minimapHeight = 100; // Size of the minimap
        const minimapWidth = minimapHeight * aspectRatio; // Size of the minimap

        const startX = cameraWidth - minimapWidth - borderSize;
        const startY = 0;

        // Clear the previous minimap rendering
        this.minimapGraphics.clear();

        // Draw the black square with a white border
        this.minimapGraphics.lineStyle(borderSize, 0xffffff); // White border
        this.minimapGraphics.fillStyle(0x000000, 1);          // Black background
        this.minimapGraphics.strokeRect(startX, startY, minimapWidth, minimapHeight);
        this.minimapGraphics.fillRect(startX, startY, minimapWidth, minimapHeight);

        // Draw the blue dot representing the player in the center of the minimap
        const centerX = startX + minimapWidth / 2 + borderSize;
        const centerY = startY + minimapHeight / 2 + borderSize;
        this.minimapGraphics.fillStyle(0x0000ff, 1); // Blue color
        this.minimapGraphics.fillCircle(centerX, centerY, 5);

        this.minimapGraphics.fillStyle(0xff0000, 1); // Blue color
        ships.forEach((coords) => {
          const shipX = Math.floor((coords.x / cameraWidth) * minimapWidth) + startX;
          const shipY = Math.floor((coords.y / cameraHeight) * minimapHeight) + startY;
          this.minimapGraphics.fillCircle(shipX, shipY, 5);
        });
    }
}
