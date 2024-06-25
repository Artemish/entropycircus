class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    init(stage_id) {
        console.log('In MainScene.js:init()', stage_id);
        this.stage_id = stage_id;
    }

    preload() { 
        this.load.image('gameover', 'assets/gameover.png');
        const shipdata = this.cache.json.get('shipdata');
        console.log("Found ship data: ", shipdata);
        shipdata.forEach((ship) => {
          console.log(`Loading asset for ${ship.shipcode}`);
          this.load.image(ship.shipcode, `assets/ships/${ship.shipcode}.png`);
        });

        this.load.json(this.stage_id, `assets/stages/${this.stage_id}.json`);
    }

    setBackground() {
        // Assuming your world is larger than the screen
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;
        const worldWidth = 2000; // Adjust based on your game world size
        const worldHeight = 2000; // Adjust based on your game world size

        console.log("Adding starfield");
        this.starField = this.add.tileSprite(0, 0, width*2, height*2, 'star_field_far');
    }

    getInViewShipCoords() {
      const camera = this.cameras.main;
      const worldView = camera.worldView;
      const cameraOrigin = camera.getWorldPoint(0, 0);

      var results = [];
      this.ships.getChildren().forEach((ship) => {
          if (ship == this.ship) {
            return;
          }

          const bounds = ship.getBounds();
          if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, worldView)) {
              results.push({
                  'x': ship.x - cameraOrigin.x,
                  'y': ship.y - cameraOrigin.y
              });
          }
      });

      return results;
    }

    create() {
        this.stage = this.cache.json.get(this.stage_id);
        this.ships = this.physics.add.group();
        this.missiles = this.physics.add.group();
        this.hitsound = this.sound.add('hitsound');
        this.shipIDMap = new Map();

        // console.log('Selected Ship:', this.ship);
        this.setBackground();

        let enemies = this.physics.add.group();

        this.spawn_ships();

        if (this.shipIDMap.has('PLAYER')) {
          this.ship = this.shipIDMap.get('PLAYER');

          // Setting up the physics for the ship
          this.physics.world.enable(this.ship);
        }

        if (this.stage.interactive) {
          this.input.on('pointerdown', () => {
              if (this.ship.active) {
                this.ship.fireMissile(800);
              }
          });

          // Register collision detection between ships
          this.physics.add.collider(this.ships, this.ships, this.handleShipCollision, null, this);

          // Register collision detection between ships and missiles
          this.physics.add.collider(this.ships, this.missiles, this.handleShipMissileCollision, this.should_missile_collide, this);

          // Register a callback for when the player ship is destroyed
          this.shipIDMap.get('PLAYER').once('destroy', this.onPlayerShipDestroyed, this);

          // Create a key object for the 'W' key
          this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
          this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
          this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        }

        if (this.stage.camera) {
          const followShip = this.shipIDMap.get(this.stage.camera);
          console.log('[MAIN] Camera following: ', followShip);
          this.cameras.main.startFollow(followShip, true, 1.0, 1.0);
        }

        if (this.stage.interactive) {
          // Define the arrow keys for input
          this.cursors = this.input.keyboard.createCursorKeys();
          this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

          // Get the UI scene
          this.uiScene = this.scene.get('UIScene');
        }

        console.log("Emitting event: scene_ready");
        this.scene.get('GameScene').events.emit('scene_ready', {scene: 'MainScene'});
    }

    dummyListener(data) {
      console.log("[EVENT] ", data);
    }

    onPlayerShipDestroyed() {
        // Get the center of the camera
        const camera = this.cameras.main;
        const centerX = camera.worldView.x + camera.worldView.width / 2;
        const centerY = camera.worldView.y + camera.worldView.height / 2;

        this.add.image(centerX, centerY, 'gameover').setOrigin(0.5); // Display Game Over image
        this.add.text(centerX, centerY+200, 'Press space to retry', { fontSize: '16px', fill: '#ffffff' }).setOrigin(0.5);

        // Firing mechanism
        this.spaceBar.on('down', () => {
            this.scene.restart();
        });
    }

    should_missile_collide(ship, missile) {
      return missile.firer != ship;
    }

    spawn_ships() {
        this.stage.ships.forEach(ship_info => this.spawn_ship(ship_info));
    }

    spawn_ship(ship_info, target) {
        var ship = new Ship(this, ship_info.pos.x, ship_info.pos.y, ship_info.ship);
        ship.setRotation(ship_info.pos.rot * (6.28 / 360));
        if (target) { 
          ship.set_target(target);
        }

        if (ship_info.id) {
          this.shipIDMap.set(ship_info.id, ship);
        }

        ship.body.velocity.y = 450;
        ship.body.setDrag(0);
    }

    handleShipCollision(ship1, ship2) {
        this.hitsound.play();
        // Handle collision between two ships
        // console.log('Collision detected between two ships', ship1, ship2);
        // Example: deal damage to both ships
        ship1.takeDamage(2);
        ship2.takeDamage(2);
    }

    handleShipMissileCollision(ship, missile) {
        // console.log("Ship->Missile colliding: ", ship, missile);
        this.hitsound.play();
        // Handle collision between ship and missile
        ship.takeDamage(2); // Example: deal 10 damage to the ship
        missile.destroy(); // Destroy the missile on impact
    }

    point_ship_towards_cursor() {
        const camera = this.cameras.main;
        const centerX = camera.displayWidth / 2;
        const centerY = camera.displayHeight / 2;

        // Get the pointer (mouse) position
        const pointer = this.input.activePointer;
        //console.log(camera);

        //console.log("Centering on: ", centerX, centerY, "->", pointer.x, pointer.y);
        // Calculate the angle between the ship and the pointer
        const angle = Phaser.Math.Angle.Between(centerX, centerY, pointer.x, pointer.y);

        // Set the ship's rotation to match the angle
        this.ship.setRotation(angle);
    }

    update() {
        // console.log(this.starField);
        this.starField.x = this.cameras.main.scrollX;
        this.starField.y = this.cameras.main.scrollY;

        this.ships.children.iterate((ship) => {ship.update();});

        // Filter ships to only those in view
        var coords = this.getInViewShipCoords();


        if (this.stage.interactive) {
            this.point_ship_towards_cursor();
            this.uiScene.renderMinimap(coords, this.cameras.main.midPoint);
        }

        if (this.ship.active) {
          // console.log("Main scene ship: ", this.ship);
          // Example variables for player speed
          const playerSpeedX = this.ship.body.velocity.x;
          const playerSpeedY = this.ship.body.velocity.y;

          // Update the tile sprite's position based on player movement
          // The modulus ensures that the position wraps around, creating an infinite scrolling effect
          this.starField.tilePositionX = (this.starField.tilePositionX + playerSpeedX * 0.1) % 4096;
          this.starField.tilePositionY = (this.starField.tilePositionY + playerSpeedY * 0.1) % 4096;

          // If your game world has defined bounds, you can use modulus like this:
          // Assuming worldWidth and worldHeight represent the size of your game world
          // this.starField.tilePositionX = this.starField.tilePositionX % 4096;
          // this.starField.tilePositionY = this.starField.tilePositionY % 4096;

          // Control the ship's movement based on arrow key input
          if (this.interactive) {
            if (this.aKey.isDown) {
                this.ship.body.setAngularVelocity(-150);
            } else if (this.dKey.isDown) {
                this.ship.body.setAngularVelocity(150);
            } else {
                this.ship.body.setAngularVelocity(0);
            }

            if (this.wKey.isDown) {
                this.physics.velocityFromRotation(this.ship.rotation, this.ship.moveSpeed * 20, this.ship.body.acceleration);
            } else {
                this.ship.body.setAcceleration(0);
            }
          }
        }
    }
}
