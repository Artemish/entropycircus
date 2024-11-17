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
      // this.script.forEach((scriptLine) => {
      //   this.load.image(scriptLine.speaker, `assets/portraits/anime_ring_leader_maybe.jpg`);
      //   // this.load.image(scriptLine.speaker, `assets/portraits/${scriptLine.speaker}.png`);
      // });

      this.load.image("jester_22",     "assets/portraits/anime_jester.jpg");
      this.load.image("ringleader",    "assets/portraits/anime_ring_leader_maybe.jpg");
      this.load.image("tanizaki",      "assets/portraits/anime_ensign_Tanizaki.jpg");
      this.load.image("captain_rand",  "assets/portraits/anime_captain_rand.jpg");
      this.load.image("high_command",  "assets/portraits/anime_high_command_member.jpg");
      this.load.image("admiral_luci",  "assets/portraits/anime_admiral_luci.jpg");
    }

    create() {
        // Get screen dimensions
        const { width, height } = this.cameras.main;

        // Define dialogue box dimensions
        const dialogBoxHeight = 180;
        const dialogBoxX = 30; // 20 pixels from the bottom
        const dialogBoxY = height - dialogBoxHeight - 20; // 20 pixels from the bottom
        const textOffsetX = dialogBoxX + dialogBoxHeight + 30; // Text offset from the left
        const textOffsetY = dialogBoxY + 30; // Text offset from the top of the dialogue box

        // Create a black background rectangle for the dialogue box
        this.boxBackground = this.add.rectangle(
          width / 2,
          height - dialogBoxHeight / 2 - 10,
          width - 40,
          dialogBoxHeight,
          0x000000
        ).setOrigin(0.5);

        const portraitSize = dialogBoxHeight - 20 ;

        // Create the portrait sprite
        this.portrait = this.add.sprite(
            dialogBoxX + dialogBoxHeight / 2,
            dialogBoxY + dialogBoxHeight / 2,
            this.script[0].speaker
        ).setDisplaySize(portraitSize, portraitSize);

        this.nameText = this.add.text(
            dialogBoxX + dialogBoxHeight / 2,
            dialogBoxY+dialogBoxHeight-2,
            '',
            { fontSize: '16px', fill: '#e0e0e0', }
        ).setOrigin(0.5);

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

        let characters = this.cache.json.get('characters');

        this.nameText.setText(characters[speaker].name);
        this.text.setText(`${lines.join(' ')}`);
        this.currentScriptIndex++;
        this.updatePortrait(speaker);
    }

    updatePortrait(speaker) {
      // Update the portrait image based on the speaker
      this.portrait.setTexture(speaker);
    }
}
