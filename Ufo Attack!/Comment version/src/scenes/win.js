// This file defines the 'Win' scene for the Phaser game, which is displayed when the player wins the game.
// It shows the player's final time, a congratulatory message, and allows the player to restart the game by pressing SPACE or clicking.

import Method from "../keys&methods/methods.js"

export default class Win extends Phaser.Scene {

    // Constructor for the Win scene. It assigns a key to the scene for easy access.
    constructor() {
        super({key: "win"});
    };

    // The create method is executed when the scene is initialized. It sets up the visual elements of the win screen.
    create() {
        this.cameras.main.setBackgroundColor(0x00cc06); // Set the background color to a green shade
        this.sound.play("win");                         // Play the victory sound effect
        this.method = new Method(this);                 // Initialize helper methods from external class
        var timeData = this.registry.get("time");       // Get the player's final time (stored as "time" in the registry)

        // Create and position text labels for the final time, win message, and restart instructions using the newText method
        var time = this.newText(("Your time: " + timeData), this.method.center("X"), "*", 1, this.method.center("Y"), "/", 2.5, 25);
        var win = this.newText("YOU WIN!", this.method.center("X"), "*", 1, this.method.center("Y"), "/", 1.2, 50);
        var restart = this.newText("Press SPACE or Click to restart!", this.method.center("X"), "*", 1, this.method.center("Y"), "*", 1.2, 25);

        // Display the text labels using the showText method, with the text fading in over time
        this.showText(time.text, time.X, time.Y, time.fontSize, 0.5, 0.5);
        this.showText(win.text, win.X, win.Y, win.fontSize, 0.5, 0.5);
        this.showText(restart.text, restart.X, restart.Y, restart.fontSize, 0.5, 0.5);

        // Add event listeners for restarting the game when SPACE is pressed or the mouse is clicked
        this.input.keyboard.on("keydown-SPACE", this.startGame, this);
        this.input.on("pointerdown", () => this.startGame(), this);

        console.log("Gongratulations! You won.");
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
    // The text fades in over a period of 2.5 seconds using a tween animation.
    showText(text, X_value, Y_value, fontSize, X_origin, Y_origin) {
        this.text = this.add.bitmapText(X_value, Y_value, "arcade", text, fontSize) // Add the text to the scene
            .setOrigin(X_origin, Y_origin)  // Set the origin for text alignment
            .setAlpha(0)                    // Start the text with 0 opacity (invisible)
            .setDepth(1)                    // Set the drawing depth

        // Animate the text to fade in by changing its alpha to 1 over 2.5 seconds
        this.textTween = this.tweens.add({
            targets: this.text, // Target of the animation
            duration: 2500,     // Duration of the fade-in effect
            alpha: 1,           // End opacity
        });
    };

    // This method restarts the game scene when called. It transitions back to the "game" scene.
    startGame() {
        this.scene.start("game"); // Restart the game
    };
};

// EOF
