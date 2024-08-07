class GameOverScene extends Phaser.Scene {
    constructor() {
        super('gameOver');
    }

    preload() {
        this.load.image("spaceBackground", "../images/space_background.jpeg");
    }

    create() {
        this.background = this.add.image(0,0, "spaceBackground");
        this.background.setOrigin(0,0);
        this.background.setScale(2.1);

        this.add.text(
            this.game.config.width / 2,
            100,
            'Game Over!',
            {
                font: '100px Impact',
                fill: 'yellow',
                align: 'center',
                stroke: 'black',
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        var backButton = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2 + 50,
            'Restart',
            {
                font: 'bold 50px Arial',
                fill: 'yellow',
                align: 'center'
            }
        ).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', function() {
            if (Number(this.storedScore) > Number(this.storedHighScore)){
                // save this.name and this.storedScore to the db
                sendButtonPressData(`${this.name} ${this.storedScore}`)
            }
            this.scene.start("mainMenu");
        }, this);

        backButton.on('pointerover', () => {
            backButton.setStyle({ fill: 'cyan' });
        });

        backButton.on('pointerout', () => {
            backButton.setStyle({ fill: 'yellow' });
        });

        // if there is a new highscore
        this.storedHighScore = localStorage.getItem('asteroidHighScore');
        this.storedScore = localStorage.getItem('score');
        if (Number(this.storedScore) > Number(this.storedHighScore)){
            localStorage.setItem('asteroidHighScore', this.storedScore);
            this.name = "";
            this.blinkTimer = Date.now()
            this.lastTimeDown = 0;
            this.keys = this.input.keyboard.addKeys('A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z');
            this.back = this.input.keyboard.addKeys('BACKSPACE');
            console.log(Object.entries(this.keys));
            this.add.text(
                this.game.config.width / 2,
                200,
                'New Highscore: ' + this.storedScore,
                {
                    font: 'bold 50px Arial',
                    fill: 'yellow',
                    align: 'center'
                }
            ).setOrigin(0.5);
            this.enterText = this.add.text(
                this.game.config.width / 2,
                this.game.config.height / 2,
                'Enter your name: |',
                {
                    font: 'bold 50px Arial',
                    fill: 'yellow',
                    align: 'left'
                }
            ).setOrigin(0.5);
        }
    }

    update() {
        if (Number(this.storedScore) > Number(this.storedHighScore)){
            if (Date.now() - this.blinkTimer > 500){
                if (this.enterText.text[this.enterText.text.length-1] == "|"){
                    this.enterText.setText("Enter your name: " + this.name);
                }else {
                    this.enterText.setText("Enter your name: " + this.name + "|");
                }
                this.blinkTimer = Date.now();
            }
            // keyboard input
            let keyEntries = Object.entries(this.keys)
            for (const i in keyEntries){
                if (keyEntries[i][1].isDown && this.lastTimeDown != keyEntries[i][1].timeDown && this.name.length < 5){
                    this.name += keyEntries[i][0];
                    this.enterText.setText("Enter your name: " + this.name + "|");
                    this.lastTimeDown = keyEntries[i][1].timeDown
                }
            }
            if (this.back.BACKSPACE.isDown && this.lastTimeDown != this.back.BACKSPACE.timeDown && this.name.length > 0){
                this.name = this.name.slice(0, this.name.length - 1);
                this.enterText.setText("Enter your name: " + this.name + "|");
                this.lastTimeDown = this.back.BACKSPACE.timeDown
            }
        }
    }
}

function sendButtonPressData(data) {
    fetch('mySql.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data=' + encodeURIComponent(data)
    })
    .then(response => response.text()) // Assuming the response is text
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}