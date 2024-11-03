export default class Keys {
    constructor(gameScene) {
        gameScene.W = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        gameScene.A = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        gameScene.D = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        gameScene.UP = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    };
};

// EOF
