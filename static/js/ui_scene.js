class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene'});
        this.attackButtons = [];
        this.moveButton = null;
    }

    preload() {
        this.load.image('ui-background', 'assets/ui-background.jpg');
    }

    create() {
        // Create a container at the desired offset
        let uiContainer = this.add.container(0, 400);
        // Add UI elements to the container. Their positions are now relative to the container's origin
        let scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        uiContainer.add(scoreText);

        // Assuming 'background' is the key for your loaded image
        var bg = this.add.image(0, 0, 'ui-background');
        bg.setOrigin(0,0);

        uiContainer.add(bg);

        // Scale the image
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = 200;

        this.container = uiContainer;

        // You can listen for events from the MainScene or other parts of your game
        // to update the UI accordingly
        this.game.events.on('shipSelected', this.shipSelected, this);
        this.game.events.on('attackSelected', this.attackSelected, this);
    }

    clearShipOptions() {
        this.attackButtons.forEach(button => button.destroy());
        this.attackButtons = [];

        if (this.moveButton) {
          this.moveButton.destroy();
          this.moveButton = null;
        }
    }

    addMoveButton() {
        this.moveButton = this.add.text(10, 20, "Move", { fontSize: '20px', backgroundColor: '#444' })
        this.container.add(this.moveButton);

        this.game.events.emit('moveSelected');
    }

    showShipOptions(ship) {
        const attacks = ship.attacks;
        console.log("Rendering attacks: ", attacks);

        // Clear existing attack buttons
        this.clearShipOptions();

        this.addMoveButton();

        attacks.forEach((attack, index) => {
            const button = this.add.text(
              70 + index * 100, 20, attack.name,
              { fontSize: '20px', backgroundColor: '#444' })
            .setInteractive()
            .on('pointerdown', () => this.game.events.emit('attackSelected', attack));

            button.attack = attack;

            this.container.add(button);
            this.attackButtons.push(button);
        });
    }

    shipSelected(ship) {
        console.log("Rendering UI for ship..");
        this.showShipOptions(ship);
    }

    attackSelected(attack) {
        console.log("Attack selected: ", attack);
    }
}
