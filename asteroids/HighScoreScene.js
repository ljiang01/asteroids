class HighScoreScene extends Phaser.Scene {
    constructor() {
        super("highScoreMenu");
    }

    preload() {
        // Load the background image
        this.load.image("spaceBackground", "../images/space_background.jpeg");
    }

    create() {
        // Display the background image
        this.background = this.add.image(0, 0, "spaceBackground");
        this.background.setOrigin(0, 0);
        this.background.setScale(2.1);

        // Display the title
        this.add.text(
            this.game.config.width / 2,
            100,
            'High Scores',
            {
                font: '100px Impact',
                fill: '',
                align: 'center',
                stroke: 'yellow',
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        // Fetch and display high scores
        this.loadHighScoresdb();

        var backButton = this.add.text(
            this.game.config.width / 2,
            this.game.config.height - 50,
            'Back',
            {
                font: 'bold 50px Arial',
                fill: 'yellow',
                align: 'center'
            }
        ).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', function () {
            this.scene.start("mainMenu");
        }, this);

        backButton.on('pointerover', () => {
            backButton.setStyle({ fill: 'cyan' });
        });

        backButton.on('pointerout', () => {
            backButton.setStyle({ fill: 'yellow' });
        });
    }

    loadHighScoresdb() {
        fetch('getSql.php')
        .then(response => response.text())
        .then(highScoresData => {
            // var str = highScoresData
            var str = "";
            var obj = JSON.parse(highScoresData);
            for (var i = 0; i < obj.length; i++) {
                str += `${obj[i].username}     ${obj[i].score}\n`;
            }
            // Display high scores in an HTML list
            const highScoresList = this.add.text(
                this.game.config.width / 2,
                this.game.config.height / 2,
                str,
                {
                    font: 'bold 30px Arial',
                    fill: 'yellow',
                    align: 'center'
                }
            ).setOrigin(0.5);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}