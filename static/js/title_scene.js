// TitleScene class definition
class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        this.load.json('shipdata', 'assets/ships.json');
        this.load.json('levels', 'assets/levels.json');
        this.load.json('characters', 'assets/characters.json');
        this.load.image('plus', 'assets/plus.png');
        this.load.image('minus', 'assets/minus.png');
        this.load.image('background', 'assets/background.jpg');
        this.load.image('star_field_far', 'assets/star_field_far.png');
        this.load.image('star_field_close', 'assets/star_field_close.png');
        this.load.image('nasa_level_1_bg', 'assets/NASA_level_1.jpg');
        this.load.image('bullet', 'assets/bullet.webp');

        this.load.audio('hitsound', 'assets/sfx/machinegun_hit.mp3');
        this.load.audio('missile_hit', 'assets/sfx/missile_hit.mp3');
        this.load.audio('missile_fired', 'assets/sfx/missile_fired.mp3');
        this.load.audio('gameover_music', 'assets/music/game_over.mp3');
        this.load.audio('menu_select', 'assets/sfx/menu_select.mp3');
    }

    create() {
        console.log("Creating Title Scene");
        this.title = this.add.text(400, 100, 'Entropy Circus', { fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);
        // Add text objects for the menu options
        this.newGameText = this.add.text(400, 300, 'NEW GAME', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
        this.exitText = this.add.text(400, 400, 'EXIT', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);

        // Add a selection triangle
        this.selectionTriangle = this.add.text(250, 300, '▶', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);

        // Initialize selection index (0 for NEW GAME, 1 for EXIT)
        this.selectionIndex = 0;

        // Input keys for navigation
        this.input.keyboard.on('keydown-DOWN', this.handleDown.bind(this));
        this.input.keyboard.on('keydown-UP', this.handleUp.bind(this));
        this.input.keyboard.on('keydown-ENTER', this.handleSelect.bind(this));
        this.input.keyboard.on('keydown-SPACE', this.handleSelect.bind(this));
        
        this.input.on('pointerdown', this.handleSelect.bind(this));

        this.selectSound = this.sound.add('menu_select');
    }

    handleDown() { 
      console.log("DOWN");
      if (this.selectionIndex < 1) {
        this.selectionIndex = 1;
        this.selectionTriangle.setY(400);
        this.selectSound.play();
      }
    }

    handleUp() { 
      console.log("UP");
      if (this.selectionIndex > 0) {
        this.selectionIndex -= 1;
        this.selectionTriangle.setY(300);
        this.selectSound.play();
      }
    }

    handleSelect() {
        console.log("SELECT", this.selectionIndex);
        if (this.selectionIndex === 0) {
            this.selectSound.play();
            this.startNewGame();
        } else if (this.selectionIndex === 1) {
            this.exitGame();
        }
    }

    startNewGame() {
        // Logic to start a new game
        console.log('Starting new game...');
        // Transition to the game scene or reset game state
        this.scene.start('GameScene');
    }

    exitGame() {
        // Logic to exit the game
        console.log('Exiting game...');
        // For a web game, you might not actually be able to close the window,
        // but you could return to a main menu or show an exit screen
    }
}

