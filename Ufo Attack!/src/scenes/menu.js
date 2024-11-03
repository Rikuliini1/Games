import Method from "../keys&methods/methods.js"

export default class Menu extends Phaser.Scene {
    constructor() {
        super({key: "menu"});
    };

    preload() {
        this.load.audio("jump", "assets/sounds/jump.mp3");
        this.load.audio("shoot", "assets/sounds/shoot.mp3");
        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("damage", "assets/sounds/damage.mp3");
        this.load.audio("boom", "assets/sounds/boom.mp3");
        this.load.audio("dead", "assets/sounds/dead.mp3");
        this.load.audio("theme", "assets/sounds/theme.mp3");

        this.load.image("sky", "assets/images/sky.png");
        this.load.image("cloud", "assets/images/cloud.png");
        this.load.image("ufo", "assets/images/platform.png");
        this.load.image("bomb", "assets/images/bomb.png");
        this.load.image("star", "assets/images/star.png");

        this.load.spritesheet('dude', "./assets/images/dude.png", {frameWidth: 32, frameHeight: 48});
        this.load.bitmapFont("arcade", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
    };

    create() {
        this.cameras.main.setBackgroundColor(0x00bee0);
        this.method = new Method(this);

        var gameTitle = this.newText("UFO Attack!", this.method.center("X"), "*", 1, this.method.center("Y"), "/", 2, 60);
        var startGame = this.newText("Press SPACE to start the game!", this.method.center("X"), "*", 1, this.method.center("Y"), "*", 1.4, 25);
        var W_jump = this.newText("W - Jump", this.method.center("X"), "/", 2, this.method.center("Y"), "*", 0.75, 20)
        var A_left = this.newText("A - Move left", this.method.center("X"), "/", 2, this.method.center("Y"), "*", 0.85, 20);
        var D_right = this.newText("D - Move right", this.method.center("X"), "/", 2, this.method.center("Y"), "*", 0.95, 20);
        var up_arrow = this.newText("Shoot with UP-arrow", this.method.center("X"), "/", 2, this.method.center("Y"), "*", 1.1, 20);

        this.showText(gameTitle.text, gameTitle.X, gameTitle.Y, gameTitle.fontSize, 0.5, 0.5);
        this.showText(startGame.text, startGame.X, startGame.Y, startGame.fontSize, 0.5, 0.5);
        this.showText(W_jump.text, W_jump.X, W_jump.Y, W_jump.fontSize, 0, 0.5);
        this.showText(A_left.text, A_left.X, A_left.Y, A_left.fontSize, 0, 0.5);
        this.showText(D_right.text, D_right.X, D_right.Y, D_right.fontSize, 0, 0.5);
        this.showText(up_arrow.text, up_arrow.X, up_arrow.Y, up_arrow.fontSize, 0, 0.5);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);

        console.log("This is the menu screen.");
    };

    newText(string, X_value, X_operation, X_factor, Y_value, Y_operation, Y_factor, size) {
        return {
            text: string,
            X: (X_operation == "*") ? X_value * X_factor : X_value / X_factor,
            Y: (Y_operation == "*") ? Y_value * Y_factor : Y_value / Y_factor,
            fontSize: size,
        };
    };

    showText(text, X_value, Y_value, fontSize, X_origin, Y_origin) {
        this.text = this.add.bitmapText(X_value, Y_value, "arcade", text, fontSize)
            .setOrigin(X_origin, Y_origin)
            .setAlpha(1)
            .setDepth(1);
    };

    startGame() {
        this.scene.start("game", {gameName: "UFO Attack!", versionNumber: "version: " + 1});
    };
};

// EOF
