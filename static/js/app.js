var config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.RESIZE,
      parent: 'game-container',
      width: '100%',
      height: '100%',
    },
    fps: {
      target: 30,
      forceSetTimeOut: true
    },
    physics: {
        default: 'arcade', // Activates Arcade Physics
        arcade: {
            // gravity: { y: 300 }, 
            // debug: true, // Set to true to see physics debug drawings
        }
    },
    scene: [
      TitleScene,
      MainScene,
      UIScene,
      DialogueScene,
      GameScene,
      JournalLogScene,
    ] 
};

var game = new Phaser.Game(config);

window.addEventListener('resize', function (event) {
    // Optional: Custom logic to respond to the resize event
    console.log("Refreshing..");
    game.scale.refresh();
});
