class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, shipcode, id, team) {
        const shipdata = scene.cache.json.get('shipdata');
        const ship = shipdata.find(ship => ship.shipcode == shipcode);

        console.log("Creating ship with shipcode: ", ship.shipcode);
        super(scene, x, y, ship.shipcode);

        this.scene = scene;

        this.id = id;
        this.team = team;
        // Custom properties based on ship
        this.shipCode = ship.shipcode;
        this.radius = ship.radius;
        this.pointCost = ship.point_cost;
        this.shields = ship.shields;
        this.hull = ship.hull;
        this.maxShields = ship.shields;
        this.maxHull = ship.hull;
        this.moveSpeed = ship.movespeed;
        this.evasion = ship.evasion;
        this.attacks = ship.attacks;

        // Add the ship object to the scene
        scene.add.existing(this);
        
        // Enable physics on this object
        scene.physics.world.enable(this);
        scene.ships.add(this);

        this.scene = scene;

        if (ship.mass) {
          this.body.setMass(ship.mass);
        }
        this.body.setDrag(20);
        this.body.setBounce(0);
        this.body.setMaxSpeed(30 * ship.movespeed);

        // Assuming the ship images are square and you want the ship's diameter to match 2 * radius
        const originalImageSize = this.width; // This assumes the image is square
        const desiredDiameter = ship.radius * 10; // Adjust this if you want a different scaling
        const scale = desiredDiameter / originalImageSize;
        this.setScale(scale);

        // Example: movespeed to pixels
        this.moveRange = ship.movespeed * 10;
        this.target = null;

        // Create graphics for health and shield bars
        // this.healthBar = scene.add.graphics();
        // this.shieldBar = scene.add.graphics();
        // this.updateBars();

        this.fireMissileTimer = null;

        // this.once('destroy', this.onPlayerShipDestroyed, this);
    }


    set_target(ship) {
      this.target = ship;
      this.fireMissileTimer = this.scene.time.addEvent({
          delay: Math.random() * 2500 + 750,          // delay in milliseconds
          callback: () => this.fireMissile(300),
          callbackScope: this,
          loop: true             // set to false if you don't want it to repeat
      });
    }

    interceptCourse(target, speed) {
        const tx = target.x + target.body.velocity.x;
        const ty = target.y + target.body.velocity.y;

        const angle_to_target = Phaser.Math.Angle.Between(this.x, this.y, tx, ty);
        const target_vector = {
          'x': (tx - this.x),
          'y': (ty - this.y),
        };

        const correction_vector = {
          'x': target_vector['x'] - this.body.velocity.x,
          'y': target_vector['y'] - this.body.velocity.y,
        };

        return correction_vector;
    }

    move_towards_target() {
        this.scene.physics.moveToObject(this, this.target, null, 2000);
        // const speed = this.moveSpeed * 5;
        // const intercept = this.interceptCourse(this.target, speed);

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        this.setRotation(angle);

    }

    // move_towards_target() { 
    //   // Calculate the angle between the ship and the pointer
    //   const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
    //   this.setRotation(angle);
    //   this.scene.physics.velocityFromRotation(this.rotation, this.moveSpeed * 20, this.body.acceleration);
    // }

    has_target() { 
      return ((this.target !== null) && (this.target.active));
    }

    update() { 
      if (this.has_target()) {
        this.move_towards_target();
      }
      // this.updateBars();
    }

    // Example method: damage the ship
    takeDamage(amount) {
        // console.log("Taking damage");
        this.shields -= amount;
        if (this.shields < 0) {
            this.hull += this.shields;
            this.shields = 0;
        }
        if (this.hull <= 0) {
            this.destroy();
        }
        // this.updateBars();
    }

    fireMissile(speed) {
        this.scene.sfx_missile_fired.play();
        const missile = new Missile(this.scene, this.x, this.y, this, speed);
    }

    firePing() {
        const ping = new Ping(this.scene, this.x, this.y, this);
    }

    destroy(fromScene) {
        // Cancel the fire missile timer
        if (this.fireMissileTimer) {
            this.fireMissileTimer.remove();
        }
        super.destroy(fromScene);
    }

    updateBars() {
        this.healthBar.clear();
        this.shieldBar.clear();

        // Calculate the width of the health and shield bars
        const healthBarWidth = 50;
        const shieldBarWidth = 50;

        // Health bar position and size
        const healthX = this.x - healthBarWidth / 2;
        const healthY = this.y + (this.height/10) / 2 + 15;
        const healthPercentage = Math.max(this.hull / this.maxHull, 0);
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(healthX, healthY, healthBarWidth * healthPercentage, 5);

        // Shield bar position and size
        const shieldX = this.x - shieldBarWidth / 2;
        const shieldY = this.y + (this.height/10) / 2 + 25;
        const shieldPercentage = Math.max(this.shields / this.maxShields, 0);
        this.shieldBar.fillStyle(0x0000ff);
        this.shieldBar.fillRect(shieldX, shieldY, shieldBarWidth * shieldPercentage, 5);
    }
}
