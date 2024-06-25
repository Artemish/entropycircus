class DialogueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DialogueScene' });
    }

    init(script) {
        console.log('[DIALOGUE] init with script: ', script);
        this.script = script;
        this.currentScriptIndex = 0;
    }

    preload() {
      this.load.json('characters', 'assets/characters.json');
      this.script.forEach((scriptLine) => {
        this.load.image(scriptLine.speaker, `assets/portraits/anime_ring_leader_maybe.jpg`);
        // this.load.image(scriptLine.speaker, `assets/portraits/${scriptLine.speaker}.png`);
      });
    }

    create() {
        // Get screen dimensions
        const { width, height } = this.cameras.main;

        // Define dialogue box dimensions
        const dialogBoxHeight = 150;
        const dialogBoxX = 30; // 20 pixels from the bottom
        const dialogBoxY = height - dialogBoxHeight - 20; // 20 pixels from the bottom
        const textOffsetX = dialogBoxX + dialogBoxHeight + 30; // Text offset from the left
        const textOffsetY = dialogBoxY + 30; // Text offset from the top of the dialogue box

        // Create a black background rectangle for the dialogue box
        this.add.rectangle(width / 2, height - dialogBoxHeight / 2 - 20, width - 40, dialogBoxHeight, 0x000000)
            .setOrigin(0.5);

        // Create the portrait sprite
        this.portrait = this.add.sprite(dialogBoxX + dialogBoxHeight / 2, dialogBoxY + dialogBoxHeight / 2, this.script[0].speaker)
            .setDisplaySize(dialogBoxHeight, dialogBoxHeight);

        // Create the text object
        this.text = this.add.text(textOffsetX, textOffsetY, '', {
            fontSize: '24px',
            fill: '#ffffff',
            wordWrap: { width: width - textOffsetX - 60 } // Wrap text within the dialogue box
        });

        this.input.on('pointerdown', this.showNextDialogue, this);
        this.showNextDialogue();
    }

    showNextDialogue() {
        if (this.currentScriptIndex >= this.script.length) {
            this.scene.get('GameScene').processNextEvent();
            this.scene.stop();
            return;
        }

        const { speaker, lines } = this.script[this.currentScriptIndex];

        this.text.setText(`${speaker}: ${lines.join(' ')}`);
        this.currentScriptIndex++;
        this.updatePortrait(speaker);
    }

    updatePortrait(speaker) {
      // Update the portrait image based on the speaker
      this.portrait.setTexture(speaker);
    }
}

//  Technical details from ChatGPT
//  create(data) {
//      this.script = data.script;
//
//      // Get the camera view width and height
//      const cameraWidth = this.cameras.main.width;
//      const cameraHeight = this.cameras.main.height;
//
//      // Create graphics object for the overlay
//      this.overlayGraphics = this.add.graphics();
//
//      // Character portrait box dimensions
//      const portraitWidth = 100;
//      const portraitHeight = 100;
//
//      // Text box dimensions
//      const textBoxWidth = 300;
//      const textBoxHeight = 100;
//
//      // Position the portrait box in the bottom right corner
//      const portraitX = cameraWidth - portraitWidth - 10;
//      const portraitY = cameraHeight - portraitHeight - 10;
//
//      // Position the text box to the right of the portrait box
//      const textBoxX = portraitX - textBoxWidth - 10;
//      const textBoxY = portraitY;
//
//      // Draw the portrait box (white border, gray background)
//      this.overlayGraphics.lineStyle(2, 0xffffff); // White border
//      this.overlayGraphics.fillStyle(0x808080, 1); // Gray background
//      this.overlayGraphics.strokeRect(portraitX, portraitY, portraitWidth, portraitHeight);
//      this.overlayGraphics.fillRect(portraitX, portraitY, portraitWidth, portraitHeight);
//
//      // Draw the text box (white border, light gray background)
//      this.overlayGraphics.lineStyle(2, 0xffffff); // White border
//      this.overlayGraphics.fillStyle(0xd3d3d3, 1); // Light gray background
//      this.overlayGraphics.strokeRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);
//      this.overlayGraphics.fillRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);
//
//      // Add placeholder text in the text box
//      this.add.text(textBoxX + 10, textBoxY + 10, "Character Name\nSome dialogue text here.", {
//          fontSize: '16px',
//          fill: '#000000',
//          wordWrap: { width: textBoxWidth - 20 }
//      });
//
//      // Add placeholder image for character portrait
//      // This assumes you have a placeholder image with key 'portrait' loaded in the game
//      this.add.image(portraitX + portraitWidth / 2, portraitY + portraitHeight / 2, 'portrait');
//  }
