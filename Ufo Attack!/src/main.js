import Menu from "./scenes/menu.js"
import Game from "./scenes/game.js";
import GameOver from "./scenes/gameover.js";
import Win from "./scenes/win.js";

const configurations = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    width: 800,
    height: 600,
    pixelArt: true,
    parent: "game_window",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            fps: 60,
            debug: false,
        },
    },
    scene: [Menu, Game, GameOver, Win],
};

const game = new Phaser.Game(configurations);
window.focus();

// EOF
