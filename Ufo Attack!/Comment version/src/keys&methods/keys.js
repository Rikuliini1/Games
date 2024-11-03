// Keys class to handle keyboard input for the game scene

export default class Keys {

    // Constructor receives the game scene as a parameter
    constructor(gameScene) {

        // Add keys to the game scene and map them to specific keyboard key codes
        gameScene.W = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);    // W key for moving up
        gameScene.A = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    // A key for moving left
        gameScene.D = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);    // D key for moving right
        gameScene.UP = gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);  // UP-arrow key for jumping
    
        // Note: Keyboard does not recognize W, D, and SPACE simultaneously!
        // This is a known limitation with how some browsers handle keyboard input.
    };
};

// EOF
