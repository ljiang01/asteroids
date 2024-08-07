class Powerup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityY(50); // Adjust the downward velocity as needed
    }

    onHit(hitBy) {
        this.destroy();
    }
}