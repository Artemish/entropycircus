class SetupScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SetupScene' });
    }

    preload() {
        this.load.json('ships', 'assets/ships.json');
        this.load.image('plus', 'assets/plus.png');
        this.load.image('minus', 'assets/minus.png');

        // Load ship icons based on ship codes provided in ships.json.
        // In a real project, consider preloading these or dynamically loading after fetching the JSON content.
        this.load.image('fighter', 'assets/ships/fighter.jpg');
        this.load.image('gunship', 'assets/ships/gunship.jpg');
        this.load.image('dropship', 'assets/ships/dropship.jpg');
    }

    create() {
        const shipsData = this.cache.json.get('ships');
        let totalPoints = 0;
        let yOffset = 10; // Starting vertical offset for the first row

        shipsData.forEach((ship, index) => {
            const shipIcon = this.add.image(50, yOffset + (index * 60), ship.shipcode);
            shipIcon.displayWidth = 50;
            shipIcon.displayHeight = 50;

            const displayName = this.add.text(100, yOffset + (index * 60), ship.display, { fontSize: '20px' });
            const minusButton = this.add.image(350, yOffset + 10 + (index * 60), 'minus').setInteractive();
            minusButton.displayWidth = 30;
            minusButton.displayHeight = 30;

            const countText = this.add.text(380, yOffset + (index * 60), '0', { fontSize: '20px' });
            const plusButton = this.add.image(420, yOffset + 10 + (index * 60), 'plus').setInteractive();
            plusButton.displayWidth = 30;
            plusButton.displayHeight = 30;

            // Initialize ship count
            ship.count = 0;

            plusButton.on('pointerdown', () => {
                ship.count++;
                countText.setText(ship.count.toString());
                totalPoints += ship.point_cost;
                updateTotalPoints();
            });

            minusButton.on('pointerdown', () => {
                if (ship.count > 0) {
                    ship.count--;
                    countText.setText(ship.count.toString());
                    totalPoints -= ship.point_cost;
                    updateTotalPoints();
                }
            });
        });

        const totalPointsText = this.add.text(10, yOffset + (shipsData.length * 60), 'Total Points: 0', { fontSize: '20px' });

        const updateTotalPoints = () => {
            totalPointsText.setText(`Total Points: ${totalPoints}`);
        };

        // Button to advance to the main game
        const startGameButton = this.add.text(10, yOffset + (shipsData.length * 60) + 40, 'Start Game', { fontSize: '24px', backgroundColor: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.startGame(shipsData));
    }

    startGame(shipsData) {
        const selectedShips = shipsData.filter(ship => ship.count > 0);
        this.scene.start('MainScene', { selectedShips });
    }
}
