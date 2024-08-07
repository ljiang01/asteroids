class HelpScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HelpScene' });
    }

    create() {
        // Display the instructions image or any other text/instructions
        // For example, displaying an image:
        this.background = this.add.image(0, 0, "spaceBackground").setOrigin(0, 0);
        this.background.setScale(2.1);

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

        // You can also add text instructions:
        this.add.text(
            this.game.config.width / 2, 
            250, 
            'Use arrow keys to move', 
            { 
                font: 'bold 40px Arial',
                fill: 'yellow',
                align: 'center',
                stroke: 'black',
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        this.add.text(
            this.game.config.width / 2, 
            300, 
            'Press SPACE to shoot', 
            { 
                font: 'bold 40px Arial',
                fill: 'yellow',
                align: 'center',
                stroke: 'black',
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        this.add.text(
            this.game.config.width / 2, 
            350, 
            'Avoid asteroids and survive!', 
            { 
                font: 'bold 40px Arial',
                fill: 'yellow',
                align: 'center',
                stroke: 'black',
                strokeThickness: 3 
            }
        ).setOrigin(0.5);

        // Add a button to return to the main menu
        this.addButton();
    }

    addButton() {
        // Add a button to return to the main menu
        let button = this.add.text(
            this.game.config.width / 2, 
            this.game.config.height / 2 + 150, 
            'Back', 
            { 
                font: 'bold 50px Arial',
                fill: 'yellow',
                align: 'center',
                stroke: 'black',
                strokeThickness: 3
            }
        ).setOrigin(0.5).setInteractive();

        button.on('pointerdown', () => {
            this.scene.start('mainMenu');
        });

        button.on('pointerover', () => {
            button.setStyle({ fill: 'cyan' });
        });

        button.on('pointerout', () => {
            button.setStyle({ fill: 'yellow' });
        });
    }
}
