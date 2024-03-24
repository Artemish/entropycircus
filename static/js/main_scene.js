class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    init(data) {
        this.selectedShips = data.selectedShips;
        this.currentlySelectedShip = null;
        this.scene.launch('UIScene');
    }

    preload() { 
        this.load.image('background', 'assets/background.jpg');
    }

    create() {
        // Here, you can use this.selectedShips to add game pieces to the board.
        // For example, you could iterate over the selectedShips and create sprites based on their shipcode and count.
        console.log('Selected Ships:', this.selectedShips);

        // Assuming 'background' is the key for your loaded image
        var bg = this.add.image(0, 0, 'background');

        // Set the origin to the top-left corner
        bg.setOrigin(0, 0);

        // Scale the image
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        // Example positioning logic
        let xPosition = 100;
        const yPosition = 100;

        this.selectedShips.forEach(shipData => {
            for (let i = 0; i < shipData.count; i++) {
                const texture = shipData.shipcode; // Assumes texture name matches shipcode
                const ship = new Ship(this, xPosition, yPosition, texture, shipData);
                
                // Adjust xPosition for the next ship, just as an example
                xPosition += 50;
            }
        });

        this.attackButtons = [];

        this.game.events.on('attackSelected', this.attackSelected, this);
    }

    attackSelected(attack) {
        console.log("Attack selected in main scene: ", attack);
    }

    selectShip(ship) {
        if (this.attackMode) {
            // Apply the selected attack's damage to the target ship
            console.log(`Applying ${this.selectedAttack.damage} damage to ${ship.shipCode}`);
            ship.takeDamage(this.calculateDamage(this.selectedAttack.damage)); // Implement this based on your damage calculation logic
            
            this.attackMode = false; // Reset attack mode
            this.clearAttackOptions();
            return; // Skip selection logic if in attack mode
        }

        if (this.currentlySelectedShip) {
            this.currentlySelectedShip.clearMoveRange(); // Clear the previous ship's move range
            this.currentlySelectedShip.indicateSelection(false); // Additional method to change visual selection indication
        }

        ship.drawMoveRange(); // Draw the selected ship's move range
        ship.indicateSelection(true); // Change visual selection indication

        this.game.events.emit('shipSelected', ship);

        // Select the new ship
        this.currentlySelectedShip = ship;
    }


    handleAttack(attack, attackingShip) {
        // Example of handling an attack; real implementation depends on your game mechanics
        console.log(`Attack with ${attack.name} from ${attackingShip.shipCode}`);
        
        // Here you might set a mode where the next ship clicked is the target of this attack
        this.attackMode = true;
        this.selectedAttack = attack;

        // Optionally deselect the attacking ship
        if (this.currentlySelectedShip) {
            this.currentlySelectedShip.indicateSelection(false);
            this.currentlySelectedShip = null;
        }
    }

    calculateDamage(damageExpression) {
        // Parse and calculate damage based on the attack's damage expression
        // This is a placeholder, you'll need to implement this based on your game's rules
        return 2; // Example fixed damage, replace with actual calculation
    }
}

class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, shipData) {
        super(scene, x, y, texture);
        
        // Custom properties based on shipData
        this.shipCode = shipData.shipcode;
        this.radius = shipData.radius;
        this.pointCost = shipData.point_cost;
        this.shields = shipData.shields;
        this.hull = shipData.hull;
        this.moveSpeed = shipData.movespeed;
        this.evasion = shipData.evasion;
        this.attacks = shipData.attacks;

        // Assuming the ship images are square and you want the ship's diameter to match 2 * radius
        const originalImageSize = this.width; // This assumes the image is square
        const desiredDiameter = shipData.radius * 2;
        const scale = desiredDiameter / originalImageSize;
        this.setScale(scale);

        this.displayWidth = this.radius * 2;
        this.displayHeight = this.radius * 2;

        // Add the ship object to the scene
        scene.add.existing(this);

        // Custom ship properties
        this.shipCode = shipData.shipcode;

        this.setInteractive().on('pointerdown', () => {
            scene.selectShip(this);
            console.log("Selecting ship: ", this);
        });

        this.moveRange = shipData.movespeed * 10; // Example: movespeed to pixels
        this.moveRangeGraphic = null; // Placeholder for the range graphic
        // Other properties...

        // Apply a circular mask for a rounded appearance
        // this.applyCircularMask(scene);

        // Add a border around the ship
        // this.addBorder(scene, shipData.radius);
    }

    drawMoveRange() {
        // Remove existing move range graphic if any
        if (this.moveRangeGraphic) {
            this.moveRangeGraphic.clear();
            this.moveRangeGraphic.destroy();
        }

        // Draw a new move range circle
        this.moveRangeGraphic = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xffff00 } });
        this.moveRangeGraphic.strokeCircle(this.x, this.y, this.moveRange);
    }

    clearMoveRange() {
        if (this.moveRangeGraphic) {
            this.moveRangeGraphic.clear();
            this.moveRangeGraphic.destroy();
            this.moveRangeGraphic = null;
        }
    }

    applyCircularMask(scene) {
        const mask = scene.make.graphics().fillCircle(this.x, this.y, this.width / 2);
        mask.createGeometryMask();
        this.setMask(mask);
    }

    addBorder(scene, radius) {
        // Drawing a border circle that matches the ship's scale
        const border = scene.add.circle(this.x, this.y, radius, 0xffffff, 1).setStrokeStyle(2, 0x000000);
        border.setScale(this.scale); // Match the ship's scale
    }

    // Example method: damage the ship
    takeDamage(amount) {
        this.shields -= amount;
        if (this.shields < 0) {
            this.hull += this.shields;
            this.shields = 0;
        }
        if (this.hull <= 0) {
            this.destroy();
        }
    }

    indicateSelection(selected) {
        this.setTint(selected ? 0x00dd00 : 0xffffff); // Green tint if selected, remove tint otherwise
    };
}

