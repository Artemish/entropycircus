// TitleScene class definition
class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        this.load.json('shipdata', 'assets/ships.json');
        this.load.json('levels', 'assets/levels.json');
        this.load.image('plus', 'assets/plus.png');
        this.load.image('minus', 'assets/minus.png');
        this.load.image('background', 'assets/background.jpg');
        this.load.image('star_field_far', 'assets/star_field_far.png');
        this.load.image('star_field_close', 'assets/star_field_close.png');
        this.load.image('bullet', 'assets/bullet.webp');
        this.load.audio('hitsound', 'assets/hitsound.wav');
    }

    create() {
        this.title = this.add.text(400, 100, 'Entropy Circus', { fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);
        // Add text objects for the menu options
        this.newGameText = this.add.text(400, 300, 'NEW GAME', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        this.exitText = this.add.text(400, 400, 'EXIT', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);

        // Add a selection triangle
        this.selectionTriangle = this.add.text(250, 300, '▶', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);

        // Initialize selection index (0 for NEW GAME, 1 for EXIT)
        this.selectionIndex = 0;

        // Input keys for navigation
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        // Move selection triangle based on arrow key input
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.selectionIndex > 0) {
            this.selectionIndex--;
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down) && this.selectionIndex < 1) {
            this.selectionIndex++;
        }

        console.log(this.selectionIndex);

        // Update triangle position based on selection index
        if (this.selectionIndex === 0) {
            this.selectionTriangle.setY(300);
        } else if (this.selectionIndex === 1) {
            this.selectionTriangle.setY(400);
        }

        // Handle selection (ENTER key)
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            if (this.selectionIndex === 0) {
                this.startNewGame();
            } else if (this.selectionIndex === 1) {
                this.exitGame();
            }
        }
    }

    startNewGame() {
        // Logic to start a new game
        console.log('Starting new game...');
        // Transition to the game scene or reset game state
        this.scene.start('MainScene');
    }

    exitGame() {
        // Logic to exit the game
        console.log('Exiting game...');
        // For a web game, you might not actually be able to close the window,
        // but you could return to a main menu or show an exit screen
    }
}

