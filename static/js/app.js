var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [SetupScene, MainScene, UIScene] // Ensure both scenes are included
};

var game = new Phaser.Game(config);
