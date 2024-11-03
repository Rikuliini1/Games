import Method from "../keys&methods/methods.js"

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({key: "gameover"});
    };

    create() {
        this.cameras.main.setBackgroundColor(0xcc0000);
        this.sound.play("dead");
        this.method = new Method(this);
        var timeData = this.registry.get("time");

        var time = this.newText(("Your time: " + timeData), this.method.center("X"), "*", 1, this.method.center("Y"), "/", 2.5, 25);
        var win = this.newText("GAME OVER", this.method.center("X"), "*", 1, this.method.center("Y"), "/", 1.2, 50);
        var restart = this.newText("Press SPACE or Click to restart!", this.method.center("X"), "*", 1, this.method.center("Y"), "*", 1.2, 25);

        this.showText(time.text, time.X, time.Y, time.fontSize, 0.5, 0.5);
        this.showText(win.text, win.X, win.Y, win.fontSize, 0.5, 0.5);
        this.showText(restart.text, restart.X, restart.Y, restart.fontSize, 0.5, 0.5);

        this.input.keyboard.on("keydown-SPACE", this.startGame, this);
        this.input.on("pointerdown", () => this.startGame(), this);

        console.log("Game over! Player has died.");
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
        .setAlpha(0)
        .setDepth(1);

        this.textTween = this.tweens.add({
            targets: this.text,
            duration: 2500,
            alpha: 1,
        });
    };

    startGame() {
        this.scene.start("game");
    };
};

// EOF
