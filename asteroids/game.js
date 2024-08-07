window.onload = function() {
    var config = {
        width: 750,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        backgroundColor: 0x0B0012,
        scene: [MainScene, HelpScene, playScene, GameOverScene, HighScoreScene]
    }
    var game = new Phaser.Game(config)
}