class Missile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, ship, speed_increment) {
        var start_x = ship.x + (ship.radius * 2 * Math.cos(ship.rotation));
        var start_y = ship.y + (ship.radius * 2 * Math.sin(ship.rotation));
        const speed = Math.sqrt(ship.body.velocity.x ** 2 + ship.body.velocity.y ** 2) + speed_increment; // Add missile base speed

        super(scene, start_x, start_y, 'bullet');

        this.firer = ship;

        scene.add.existing(this);
        scene.physics.world.enable(this);

        // Add to group immediately,
        // since adding it to a group resets its velocity 
        this.scene.missiles.add(this);

        this.rotation = ship.rotation;
        this.body.rotation = ship.body.rotation;

        this.body.setVelocity(
          Math.cos(ship.rotation) * speed,
          Math.sin(ship.rotation) * speed
        );

        this.body.setMass(0.1);

        this.displayWidth = ship.radius * 5;
        this.displayHeight = ship.radius * 5;
    }
}
