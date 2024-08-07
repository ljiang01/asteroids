class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, type)
    {
        super(scene, x, y, type);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // scene.physics.world.enableBody(this);
        this.setPosition(x, y);
        this.setAngle(Math.floor(Math.random() * 360));
        this.hitTimer = Date.now() + 500; // may need to remove this for initial spawns. This is meant for broken asteroids
        this.touching = false;
        this.rotationSpeed = scene.randInt(8) - 4
        this.ySpeed = scene.randInt(3) - 1.5;
        this.xSpeed = scene.randInt(3) - 1.5;
        if (this.rotationSpeed == 0){
            this.rotationSpeed = 1;
        }
        if (this.ySpeed == 0){
            this.ySpeed = 1;
        }
        if (this.xSpeed == 0){
            this.xSpeed = 1;
        }
        this.paused = false;
    }

    update (){
        if (!this.paused) {
            this.setAngle(this.angle + this.rotationSpeed);

            this.setPosition(this.x + this.xSpeed, this.y + this.ySpeed);
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
        }
    }

    // general purpose on hit function to make collisions easier in playGame.js
    // use the parameter to determine what to do based on what you were hit by
    onHit (hitBy){
        if(this.texture.key == "bigAsteroid"){
            let new1 = this.scene.spawnAsteroid(this.x, this.y, "mediumAsteroid");
            new1.xSpeed = this.xSpeed + this.xSpeed*(this.scene.randInt(5)/10);
            new1.ySpeed = this.ySpeed + this.ySpeed*(this.scene.randInt(5)/10);
            let new2 = this.scene.spawnAsteroid(this.x, this.y, "mediumAsteroid");
            new2.xSpeed = this.xSpeed + this.xSpeed*(this.scene.randInt(5)/10);
            new2.ySpeed = this.ySpeed + this.ySpeed*(this.scene.randInt(5)/10);
            this.destroy();
        }
        else if (this.texture.key == "mediumAsteroid"){
            let new1 = this.scene.spawnAsteroid(this.x, this.y, "smallAsteroid");
            new1.xSpeed = this.xSpeed + this.xSpeed*(this.scene.randInt(5)/10);
            new1.ySpeed = this.ySpeed + this.ySpeed*(this.scene.randInt(5)/10);
            let new2 = this.scene.spawnAsteroid(this.x, this.y, "smallAsteroid");
            new2.xSpeed = this.xSpeed + this.xSpeed*(this.scene.randInt(5)/10);
            new2.ySpeed = this.ySpeed + this.ySpeed*(this.scene.randInt(5)/10);
            this.destroy();
        }
        else {
            this.destroy();
        }
    }

    increaseSpeed() {
        if (this.ySpeed < 7){
            this.ySpeed += this.ySpeed * 0.15;
        }
        if (this.xSpeed < 7){
            this.xSpeed += this.xSpeed * 0.15;
        }
    }

    // Method to pause asteroid movement
    pause() {
        this.paused = true;
    }

    // Method to resume asteroid movement
    resume() {
        this.paused = false;
    }
}