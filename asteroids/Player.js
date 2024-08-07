class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, lives = 3) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.setPosition(x, y);
        this.speed = 4;
        this.keys = scene.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,SPACE');
        this.keys.SPACE.emitOnRepeat = false;
        this.keys.SPACE.repeat = false;
        this.firerate = 500;
        this.lastFired = Date.now() + this.firerate;
        this.spaceKeyUp = true;
        this.hitTimer = Date.now() + 500;
        this.lives = lives; // Introduce life counter with a default value of 3
        this.setDamping(true);
        this.setDrag(0.5);
        this.setMaxVelocity(200);
        this.velocityFromAngle = Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromAngle;
    }

    update() {
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

        // controls
         
        if (this.keys.UP.isDown) {
            let newVec = new Phaser.Math.Vector2(0, 0)
            this.velocityFromAngle(this.angle + 90, this.speed, newVec);
            this.setVelocity(this.body.velocity.x + newVec.x, this.body.velocity.y + newVec.y);
        }
        else if (this.keys.DOWN.isDown) {
          
            let newVec = new Phaser.Math.Vector2(0, 0)
            this.velocityFromAngle(this.angle - 90, this.speed, newVec);
            this.setVelocity(this.body.velocity.x + newVec.x, this.body.velocity.y + newVec.y);
        }
        else {
            this.setAcceleration(0);
        }
        
        
        if (this.keys.RIGHT.isDown){
            this.setAngle(this.angle + 3);
        }
        else if (this.keys.LEFT.isDown){
            this.setAngle(this.angle - 3);
        }
        

        if (this.keys.SPACE.isDown){
            if (this.lastFired + this.firerate < Date.now() && this.spaceKeyUp){
                this.spaceKeyUp = false;
                this.shootBeam();
            }
        }
        if (this.keys.SPACE.isUp){
            this.spaceKeyUp = true;
        }
       
    }

    shootBeam(){
        this.lastFired = Date.now();
        new Beam(this.scene, this.scene.projectiles, this.angle);
    }

    // general purpose on hit function to make collisions easier in playGame.js
    // use the parameter to determine what to do based on what you were hit by
    onHit(hitBy) {
        if (hitBy.texture.key === 'lifeOrbs') {
            this.scene.remainingLives = (this.scene.remainingLives < 10) ? (this.scene.remainingLives + 1) : this.scene.remainingLives;
            // Display added heart on the screen
            this.scene.updateHearts(this.scene.remainingLives);
        }
        else if (hitBy.texture.key === 'freez') {
            this.scene.pauseAsteroids();
        }
        else {
            if (this.hitTimer < Date.now() - 500) {
                this.scene.remainingLives -= 1
                this.scene.updateHearts(this.scene.remainingLives);
            }
            this.hitTimer = Date.now()
        }
    }
}