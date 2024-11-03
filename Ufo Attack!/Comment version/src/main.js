// This file initializes and configures the Phaser game instance. It imports the game scenes (Menu, Game, GameOver, Win)
// and sets up the game with the necessary configurations such as physics, scaling,  and rendering options.
// It then creates a new Phaser game and attaches it to the DOM element with id="game_window".

import Menu from "./scenes/menu.js"
import Game from "./scenes/game.js";
import GameOver from "./scenes/gameover.js";
import Win from "./scenes/win.js";

const configurations = {
    type: Phaser.AUTO, // Set the rendering mode to Phaser.AUTO, which automatically chooses between WebGL and Canvas rendering.

    // Define the scale settings for the game, using Phaser's scaling mode.
    scale: {
        mode: Phaser.Scale.FIT, // FIT ensures the game resizes to fit within the available window while maintaining aspect ratio. 
    },
    width: 800,                 // Set the game width as 800 pixels
    height: 600,                // Set the game height as 600 pixels.
    pixelArt: true,             // Enable pixel art mode, which ensures crisp, non-smoothed scaling for retro-style graphics.
    parent: "game_window",      // Specify the DOM element in which the game canvas will be inserted.

    // Define the physics engine to be used. In this case, it's the Arcade physics engine.
    physics: {
        default: "arcade",      // Set the default physics system to "arcade".
        arcade: {
            gravity: {y: 0},    // Set the default gravity along the Y-axis to 0 (no gravity by default).
            fps: 60,            // Set the desired frames per second (FPS) for the game to 60.
            debug: false,       // Disable the debug mode for the physics engine. If set to true, it shows collision boundaries.
        },
    },
    scene: [Menu, Game, GameOver, Win], // Declare the scenes that will be used in the game. Phaser will load them in the order listed.
};

const game = new Phaser.Game(configurations); // Create a new Phaser game instance using the configurations specified above.
window.focus(); // Ensure the window gains focus automatically when the game is loaded.

// EOF
