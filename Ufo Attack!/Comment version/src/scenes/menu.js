// This file defines the 'Menu' scene of the Phaser game. It includes methods for preloading game assets,
// displaying text on the screen, and transitioning to the main game scene when the player presses the SPACE key.

import Method from "../keys&methods/methods.js"

export default class Menu extends Phaser.Scene {

    // Constructor for the Menu scene. It assigns a key to the scene for easy access.
    constructor() {
        super({key: "menu"});
    };

    // Preload function loads all the assets (images, audio, etc.) used in the game.
    preload() {
        this.load.audio("jump", "assets/sounds/jump.mp3");      // Load jump sound
        this.load.audio("shoot", "assets/sounds/shoot.mp3");    // Load shooting sound
        this.load.audio("win", "assets/sounds/win.mp3");        // Load win sound
        this.load.audio("damage", "assets/sounds/damage.mp3");  // Load damage sound
        this.load.audio("boom", "assets/sounds/boom.mp3");      // Load explosion sound
        this.load.audio("dead", "assets/sounds/dead.mp3");      // Load death sound
        this.load.audio("theme", "assets/sounds/theme.mp3");    // Load theme music

        this.load.image("sky", "assets/images/sky.png");        // Load sky image
        this.load.image("cloud", "assets/images/cloud.png");    // Load cloud image
        this.load.image("ufo", "assets/images/platform.png");   // Load UFO image
        this.load.image("bomb", "assets/images/bomb.png");      // Load bomb image
        this.load.image("star", "assets/images/star.png");      // Load star image

        this.load.spritesheet('dude', "./assets/images/dude.png", {frameWidth: 32, frameHeight: 48});   // Load spritesheet for the player character, with each frame being 32x48 pixels
        this.load.bitmapFont("arcade", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");           // Load bitmap font for the arcade-style text
    };

    // The create method is executed when the scene is initialized. It sets up the visual elements of the menu.
    create() {
        this.cameras.main.setBackgroundColor(0x00bee0); // Set background color of the scene
        this.method = new Method(this); // Initialize helper methods from external class

        // Create the game title text, game controls text and start game prompt using the newText method
        var gameTitle = this.newText("UFO Attack!", this.method.center("X"), "*", 1, this.method.center("Y"), "/", 2, 60);
        var startGame = this.newText("Press SPACE to start the game!", this.method.center("X"), "*", 1, this.method.center("Y"), "*", 1.4, 25);
        var W_jump = this.newText("W - Jump", this.method.center("X"), "/", 2, this.method.center("Y"), "*", 0.75, 20)
        var A_left = this.newText("A - Move left", this.method.center("X"), "/", 2, this.method.center("Y"), "*", 0.85, 20);
        var D_right = this.newText("D - Move right", this.method.center("X"), "/", 2, this.method.center("Y"), "*", 0.95, 20);
        var up_arrow = this.newText("Shoot with UP-arrow", this.method.center("X"), "/", 2, this.method.center("Y"), "*", 1.1, 20);

        // Display the game title text, game controls text and start game prompt using the showText method
        this.showText(gameTitle.text, gameTitle.X, gameTitle.Y, gameTitle.fontSize, 0.5, 0.5);
        this.showText(startGame.text, startGame.X, startGame.Y, startGame.fontSize, 0.5, 0.5);
        this.showText(W_jump.text, W_jump.X, W_jump.Y, W_jump.fontSize, 0, 0.5);
        this.showText(A_left.text, A_left.X, A_left.Y, A_left.fontSize, 0, 0.5);
        this.showText(D_right.text, D_right.X, D_right.Y, D_right.fontSize, 0, 0.5);
        this.showText(up_arrow.text, up_arrow.X, up_arrow.Y, up_arrow.fontSize, 0, 0.5);

        // Add an event listener for the SPACE key, which will trigger the startGame method when pressed.
        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);

        console.log("This is the menu screen.");
    };

    // Helper method that constructs and returns an object representing a text label.
    // Parameters define the text string, X and Y positions, operations for modifying positions, and font size.
    newText(string, X_value, X_operation, X_factor, Y_value, Y_operation, Y_factor, size) {
        return {
            text: string, // The string to be displayed
            X: (X_operation == "*") ? X_value * X_factor : X_value / X_factor, // Calculate X position based on operation
            Y: (Y_operation == "*") ? Y_value * Y_factor : Y_value / Y_factor, // Calculate Y position based on operation
            fontSize: size, // Set the font size for the text
        };
    };

    // Displays bitmap text on the screen at a specified X, Y position with a given font size.
    showText(text, X_value, Y_value, fontSize, X_origin, Y_origin) {
        this.text = this.add.bitmapText(X_value, Y_value, "arcade", text, fontSize) // Add the text to the scene
        .setOrigin(X_origin, Y_origin)  // Set the origin for text alignment
        .setAlpha(1)                    // Set full opacity
        .setDepth(1);                   // Set the drawing depth
    };

    // This method starts the game scene when called. It transitions to the "game" scene
    // and gives information to the scene like the name of the game and version number.
    startGame() {
        this.scene.start("game", {gameName: "UFO Attack!", versionNumber: "version: " + 1}); // Start the game
    };
};

// EOF
