class MainScene extends Phaser.Scene {
    constructor () {
        super('mainMenu');
    }

    preload() {
        this.load.image('spaceBackground', '../images/space_background.jpeg');
        this.load.audio('beamSound', 'assets/audio/beam.mp3');
        this.load.audio('gameOverSound', 'assets/audio/arcade_game_over.wav');
        this.load.audio('backgroundMusic', 'assets/audio/arcade_music_2.mp3');
        this.load.spritesheet('player', './assets/nova-a-blue-1.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet('bigAsteroid', './assets/bigAsteroid.png', {
            frameWidth: 100,
            frameHeight: 93
        });
        this.load.spritesheet('mediumAsteroid', './assets/mediumAsteroid.png', {
            frameWidth: 80,
            frameHeight: 67
        });
        this.load.spritesheet('smallAsteroid', './assets/smallAsteroid.png', {
            frameWidth: 32,
            frameHeight: 26
        });
        //Player Beam
        this.load.spritesheet('beam', 'assets/spritesheets/shoot-2.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('hearts', './assets/pixel-heart.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        //Loading explosion Spite
        this.load.spritesheet('explosion', 'assets/spritesheets/explosion.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("lifeOrbs", "assets/spritesheets/pixel-heart.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet("freez", "assets/spritesheets/freez2.png", {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        this.background = this.add.image(0,0, 'spaceBackground');
        this.background.setOrigin(0,0);
        this.background.setScale(2.1);

        var logo = this.add.image(
            this.game.config.width / 2,
            175,
            'logo'
        ).setOrigin(0.5, 0);

        logo.setScale(0.3);

        this.add.text(
            this.game.config.width / 2,
            100,
            'Asteroids',
            {
                font: '100px Impact',
                fill: 'yellow',
                align: 'center',
                stroke: 'black',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        var playButton = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2 + 50,
            'Start',
            {
                font: 'bold 50px Arial',
                fill: 'yellow',
                align: 'center'
            }
        ).setOrigin(0.5).setInteractive();

        playButton.on('pointerdown', function () {
            this.scene.start('playGame');
            // this.scene.start('gameOver'); 
        }, this);

        playButton.on('pointerover', () => {
            playButton.setStyle({ fill: 'cyan' });
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ fill: 'yellow' });
        });

        var helpButton = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2 + 150,
            'Help',
            {
                font: 'bold 50px Arial',
                fill: 'yellow',
                align: 'center'
            }
        ).setOrigin(0.5).setInteractive();

        helpButton.on('pointerdown', function () {
            this.scene.start('HelpScene');
        }, this);

        helpButton.on('pointerover', () => {
            helpButton.setStyle({ fill: 'cyan' });
        });

        helpButton.on('pointerout', () => {
            helpButton.setStyle({ fill: 'yellow' });
        });

        var highScoreButton = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2 + 250,
            'Highscores',
            {
                font: 'bold 50px Arial',
                fill: 'yellow',
                align: 'center'
            }
        ).setOrigin(0.5).setInteractive();

        highScoreButton.on('pointerdown', function () {
            this.scene.start('highScoreMenu');
        }, this);

        highScoreButton.on('pointerover', () => {
            highScoreButton.setStyle({ fill: 'cyan' });
        });

        highScoreButton.on('pointerout', () => {
            highScoreButton.setStyle({ fill: 'yellow' });
        });

        //play explosion animation
        if (!this.anims.exists('explode')){
            this.anims.create({
                key: 'explode',
                frames: this.anims.generateFrameNumbers('explosion'),
                frameRate: 20,
                repeat: 0,
                hideOnComplete: true
            });
        }

        if (!this.anims.exists("beam_anim")){
            this.anims.create({
                key: "beam_anim",
                frames: this.anims.generateFrameNumbers("beam"),
                frameRate: 20,
                repeat: -1
            });
        }

        // this.player = new Player(this, this.game.config.width/2, this.game.config.height*.90);
    }
}