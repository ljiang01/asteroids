class Beam extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, parent, angle){
        var x = scene.player.x;
        var y = scene.player.y;
        super(scene, x, y, "beam");
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.play("beam_anim");
        Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromAngle(angle + 90, 400, this.body.velocity)
        this.parent = parent;
        scene.projectiles.add(this);
        scene.sound.play('beamSound', {volume: 0.01});
        this.timeSpawned = Date.now();
    }

    onHit(hitBy) {
        if (hitBy.texture.key === 'lifeOrbs') {
            this.scene.remainingLives = (this.scene.remainingLives < 10) ? (this.scene.remainingLives + 1) : this.scene.remainingLives;
            // Display added heart on the screen
            this.scene.updateHearts(this.scene.remainingLives);
        }
        else if (hitBy.texture.key === 'freez') {
            this.scene.pauseAsteroids();
        }
        else{
            this.scene.updateScore(1);
        }
        this.scene.destroyListObject(this);
    }

    update(){
        if (this.x > this.scene.game.config.width + this.width/2){
            this.x = 0 - this.width/2;
        }
        if (this.x < 0 - this.width/2){
            this.x = this.scene.game.config.width + this.width/2;
        }
        if (this.y > this.scene.game.config.height + this.height/2){
            this.y = 0 - this.height/2;
        }
        if (this.y < 0 - this.height/2){
            this.y = this.scene.game.config.height + this.height/2;
        }

        if (this.timeSpawned + 1000 < Date.now()){
            this.scene.destroyListObject(this);
        }
    }
}