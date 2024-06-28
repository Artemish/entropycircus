class Ping extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, firingShip) {
        super(scene, x, y, 'ping');

        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.speed = 500; // Speed of the Ping projectile
        this.latchDistance = 30; // Distance to latch onto the target
        this.searchRange = 400; // Range to search for targets
        this.currentTarget = null; // No initial target
        this.firingShip = firingShip; // Reference to the ship that fired the Ping
        this.latched = false; // To check if the Ping has latched onto a target

        // Set the initial rotation
        this.setRotation(firingShip.rotation);
        this.body.debugShowBody = true;

        // Set the initial velocity based on the rotation
        scene.physics.velocityFromRotation(this.rotation, this.speed, this.body.velocity);

        this.scene.events.on('update', this.update, this);
    }

    update() {
        // TODO figure out how this is possible
        if (this.scene === undefined) {
          return;
        }

        if (this.latched && this.currentTarget) {
            // Follow the latched target's movements
            this.x = this.currentTarget.x;
            this.y = this.currentTarget.y;
        } else if (this.currentTarget) {
            // Check the distance to the target
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.currentTarget.x, this.currentTarget.y);
            const distance = Phaser.Math.Distance.Between(this.x, this.y, this.currentTarget.x, this.currentTarget.y);

            this.setRotation(angle);
            if (distance <= this.latchDistance) {
                this.latchOntoTarget();
            } else {
              // Move towards the current target
              this.scene.physics.moveToObject(this, this.currentTarget, this.speed);
            }
        } else {
            this.searchForTarget();
        }
    }

    searchForTarget() { 
        // Find the closest target within the search range using spatial query
        let closestDistance = this.searchRange;

        let nearby = this.scene.physics.overlapCirc(this.x, this.y, this.searchRange);
        nearby.forEach((target) => {
            const obj = target.gameObject;
            if (obj instanceof Ship && obj !== this.firingShip) {
                const distance = Phaser.Math.Distance.Between(this.x, this.y, obj.x, obj.y);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    this.currentTarget = obj;
                }
            }
        });
    }

    latchOntoTarget() {
        // Latch onto the target (you can add additional behavior here)
        console.log('Ping latched onto target:', this.currentTarget);

        // Update the latched status
        this.latched = true;

        // Optionally, you can add effects or behaviors upon latching
        // For example, make the Ping follow the target, change its appearance, etc.
        this.x = this.currentTarget.x;
        this.y = this.currentTarget.y;
        this.body.stop(); // Stop any further physics movements

        // You can also emit an event or call a method on the target to indicate it has been pinged
        this.currentTarget.emit('pinged', this);
    }
}
