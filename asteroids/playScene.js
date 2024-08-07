class playScene extends Phaser.Scene {
    constructor() {
        super('playGame');
        this.spawnTimer = 0; // Timer to track asteroid spawning intervals
        this.j = 1;
    }

    randInt(max) {
        return Math.floor(Math.random() * max);
    }

    create () {
        this.background = this.add.image(0,0, 'spaceBackground');
        this.background.setOrigin(0,0);
        this.background.setScale(2.1);
        this.projectiles = this.add.group();
        this.healthOrbs = this.add.group();
        this.freezOrbs = this.add.group();
        this.highScore = 0;
        this.loadHighScore();

        this.score = 0;
        this.scoreText = this.add.text(
            this.game.config.width*0.75,
            50,
            'Current Score: 0', {
                font: 'bold 30px Arial',
                fill: 'white',
                align: 'center'
            }
        ).setOrigin(0.5, 0);

        this.highScoreText = this.add.text(
            this.game.config.width*0.75,
            50,
            'Your High Score: ' + this.highScore, {
                font: 'bold 30px Arial',
                fill: 'white',
                align: 'center'
            }
        ).setOrigin(0.5,1);

        this.remainingLives = 3;
        this.remainingLivesText = this.add.text(
            50,
            20,
            'Lives:', {
                font: 'bold 20px Arial',
                fill: 'white',
                align: 'center'
            }
        ).setOrigin(0.5, 0);

        this.heartsGroup = this.add.group();
        this.updateHearts(this.remainingLives);

        this.asteroids = this.add.group();

        this.player = new Player(this, this.game.config.width/2, this.game.config.height/2);

        this.physics.add.overlap(this.player, this.asteroids.children.entries, this.Collision, null, this);

        this.physics.add.overlap(this.asteroids.children.entries, this.asteroids.children.entries, this.bounce, null, this);

        // add overlap for beam and asteriod
        this.physics.add.overlap(this.projectiles.children.entries, this.asteroids.children.entries, this.Collision, null, this);

        this.physics.add.overlap(this.projectiles.children.entries, this.healthOrbs, this.Collision, null, this);

        this.physics.add.overlap(this.player, this.healthOrbs, this.Collision, null, this);

        this.physics.add.overlap(this.projectiles.children.entries, this.freezOrbs, this.Collision, null, this);

        this.physics.add.overlap(this.player, this.freezOrbs, this.Collision, null, this);

        //checks if the power ups are active
        this.healthOrbActive = false;

        this.freezOrbActive = false;

        //spawn power up after timer count
        this.time.delayedCall(this.randInt(3000) + 1000, this.spawnHealthOrbs, [], this);

        this.time.delayedCall(this.randInt(3000) + 1000, this.spawnFreezOrbs, [], this);
        
        // Play background music
        this.sound.play('backgroundMusic', { 
            volume: 0.05,
            loop: true 
        });
    }

    resetScene(){
        // Reset any properties to their initial values
        this.score = 0;
        this.spawns = 1;
        this.remainingLives = 3;
        this.spawnTimer = 0; 
        this.j = 1;

        // Clear or reset any game objects
        this.asteroids.destroy();
        this.projectiles.destroy();
        this.player = null; // Reset player state

    }

    async updateScore(points){
        // Update the displayed score text
        this.score += points;
        this.scoreText.setText('Current Score: ' + this.score);
        localStorage.setItem('score', this.score);
    }

    loadHighScore() {
        // Loading the highest score from local storage
        const storedHighScore = localStorage.getItem('asteroidHighScore');
        if (storedHighScore) {
            this.highScore = parseInt(storedHighScore, 10);
        }
    }

    // method for bouncing two colliding asteroids
    bounce (asteroid1, asteroid2){
        let xDiff = Math.abs(asteroid1.x - asteroid2.x);
        let yDiff = Math.abs(asteroid1.y - asteroid2.y);

        if (xDiff > yDiff){
            if (asteroid1.x > asteroid2.x){
                asteroid1.xSpeed = Math.abs(asteroid1.xSpeed);
                asteroid2.xSpeed = Math.abs(asteroid2.xSpeed)*(-1);
            }else {
                asteroid1.xSpeed = Math.abs(asteroid1.xSpeed)*(-1);
                asteroid2.xSpeed = Math.abs(asteroid2.xSpeed);
            }
        }
        else {
            if (asteroid1.y > asteroid2.y){
                asteroid1.ySpeed = Math.abs(asteroid1.ySpeed);
                asteroid2.ySpeed = Math.abs(asteroid2.ySpeed)*(-1);
            }else {
                asteroid1.ySpeed = Math.abs(asteroid1.ySpeed)*(-1);
                asteroid2.ySpeed = Math.abs(asteroid2.ySpeed);
            }
        }  
    }
    
    update(time, delta) {
        // Update spawnTimer
        this.spawnTimer += delta;

        if (this.spawnTimer > 30000){
            this.increaseAsteroidSpeed();
            this.spawnTimer = 0;
        }
        
        // if there are no asteroids, spawn more
        if (this.asteroids.children.entries.length == 0){
            for (let i = 0; i < this.j; i++){
                this.spawnAsteroid(this.game.config.width * this.randInt(2), this.game.config.height * this.randInt(2), 'bigAsteroid');
            }
            
            if (this.j < 30){
                this.j++;
            }
            
        }

        // update the gameObjects
        this.player.update();
        for (let i = 0; i < this.asteroids.children.entries.length; i++){
            this.asteroids.children.entries[i].update();
        }
        for (let i = 0; i < this.projectiles.children.entries.length; i++){
            this.projectiles.children.entries[i].update();
        }

        // verify if lives has reached 0
        if (this.remainingLives === 0){
            this.remainingLives = -1;
            this.killPlayer();
        }

    }

    async killPlayer(){
        this.player.play('explode');

        this.player.setVelocity(0);
        this.player.spaceKeyUp = false;

        // wait for the explosion animation to finish before deleting the rest of the beam
        await new Promise(r => setTimeout(r, 1500));
        this.resetScene();

        // Stop music and play game over sound
        this.sound.stopAll();
        this.sound.play('gameOverSound', { 
            volume: 0.1,
            loop: false 
        });

        this.scene.start('gameOver');
    }

    spawnAsteroid(x, y, type){
        let newAsteroid = new Asteroid(this, x, y, type);
        this.asteroids.add(newAsteroid);
        return newAsteroid;
    }

    // General purpose colission handling
    Collision(thing1, thing2) {
        thing1.onHit(thing2);
        thing2.onHit(thing1);
    }

    // Method to increase asteroid speed over time
    increaseAsteroidSpeed() {
        // Iterate through asteroids and increase their speed
        this.asteroids.children.iterate((asteroid) => {
            asteroid.increaseSpeed(); // Implement increaseSpeed() method in Asteroid class
        });
    }

    // Method to spawn new asteroids
    spawnNewAsteroids() {
        // Spawn more asteroids
        for (let i = 0; i < 2; i++) {
            this.spawnAsteroid(this.game.config.width * this.randInt(2), this.game.config.height * this.randInt(2), 'bigAsteroid');
        }
    }
    
    async destroyListObject(gameObject){
        gameObject.setTexture('explosion');
        gameObject.play('explode');

        gameObject.ySpeed = 0;
        gameObject.xSpeed = 0;

        gameObject.parent.remove(gameObject);

        // wait for the explosion animation to finish before deleting the rest of the beam
        await new Promise(r => setTimeout(r, 1500));
        
        gameObject.destroy(); 
    }

    updateHearts(remainingLives) {
        // Clear previous hearts
        this.heartsGroup.clear(true, true);

        // Display hearts based on remaining lives
        for (let i = 0; i < remainingLives; i++) {
            //let heart = this.heartsGroup.create(80 + (i * 30), 20, 'heart').setOrigin(0, 0);
            if (i < 5) {
                let heart = this.heartsGroup.create(80 + (i * 30), 20, 'hearts').setOrigin(0, 0);
                heart.setDepth(1);
            }
            else if ( i < 10 || i > 4) {
                let heart = this.heartsGroup.create(80 + ((i - 5) * 30), 50, 'hearts').setOrigin(0, 0);
                heart.setDepth(1);
            }

        }
    }

    spawnHealthOrbs() {
        // Randomly position the health drop at the top of the screen
        const x = Phaser.Math.Between(0, this.game.config.width);
        const lifeOrbs = new Powerup(this, x, 0, 'lifeOrbs');
    
        // Add the health drop to the group
        this.healthOrbs.add(lifeOrbs); 
    
        // If the health drop is not active, spawn the next one after n seconds
        if (!this.healthOrbActive) {
            this.time.delayedCall(30000 /* Milliseconds */, this.spawnHealthOrbs, [], this);
        }
    }

    spawnFreezOrbs() {
        // Randomly position the freez drop at the top of the screen
        const x = Phaser.Math.Between(0, this.game.config.width);
        const freezOrb = new Powerup(this, x, 0, 'freez');
    
        // Add the freez drop to the group
        this.freezOrbs.add(freezOrb); 
    
        // If the freez drop is not active, spawn the next one after n seconds
        if (!this.freezOrbActive) {
            this.time.delayedCall(35000 /* Milliseconds */, this.spawnFreezOrbs, [], this);
        }
    }

    pauseAsteroids() {
        // Pause movement of all asteroids
        this.asteroids.children.iterate((asteroid) => {
            asteroid.pause();
        });
        
        // Resume asteroid movement after a certain duration
        this.time.delayedCall(5000, this.resumeAsteroids, [], this); // Resume after 5 seconds
    }

    resumeAsteroids() {
        // Resume movement of all asteroids
        this.asteroids.children.iterate((asteroid) => {
            asteroid.resume();
        });
    }
}