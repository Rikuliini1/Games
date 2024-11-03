import Player from "../objects/player.js";
import Generator from "../objects/generator.js";
import Keys from "../keys&methods/keys.js";
import Method from "../keys&methods/methods.js";

export default class Game extends Phaser.Scene {
    constructor() {
        super({key: "game"});
    };

    init(data) {
        this.name = data.gameName;
        this.version = data.versionNumber;
        console.log(this.name, "/", this.version);
    };

    preload() {
        this.keys = new Keys(this);
        this.method = new Method(this);

        this.registry.set("time", 0);
        this.registry.set("UFOs", 0);
        this.registry.set("first UFO spawn", -1);
        this.registry.set("total UFOs", 2)
        this.registry.set("no more UFOs", false);
    };

    create() {
        this.loadAudios();
        this.playMusic();

        this.backgroundImage = this.add.image(this.method.center("X"), this.method.center("Y"), 'sky')
            .setScale(1)    
            .setOrigin(0.5)
            .setAlpha(1)
            .setDepth(0);

        this.timeText = this.add.bitmapText(this.method.center("X"), 20, "arcade", this.registry.get("time"), 25)
            .setScale(1)
            .setOrigin(0.5)
            .setAlpha(1)
            .setDepth(100)
            .setTint(0x252525);

        this.player = new Player(this, this.method.center("X") - 200, this.sys.game.config.height);
        this.objectGenerator = new Generator(this);

        this.livesText = this.add.bitmapText(this.method.center("X") / 6, 20, "arcade", ("Lives: " + this.player.health), 20)
            .setScale(1)
            .setOrigin(0.5)
            .setAlpha(1)
            .setDepth(100)
            .setTint(0x252525);

        this.ufosText = this.add.bitmapText(this.method.center("X") * 1.85, 20, "arcade", ("UFOs: " + this.registry.get("UFOs")), 20)
        .setScale(1)
        .setOrigin(0.5)
        .setAlpha(1)
        .setDepth(100)
        .setTint(0x252525);

        this.ufosGroup = this.physics.add.group();
        this.bombsGroup = this.physics.add.group();
        this.starsGroup = this.physics.add.group();

        this.physics.add.overlap(this.player, this.bombsGroup, (player, bomb) => this.onPlayerBombCollision(player, bomb, "Taking damage"), null, this);
        this.physics.add.overlap(this.starsGroup, this.ufosGroup, this.onStarUfoCollision, null, this);

        this.updateScoreEvent = this.time.addEvent({
            delay: 1000,
            loop: -1,
            callback: () => {
                this.updateScore()
            },
        });
    };

    update() {
        if (this.player.alive == false) {
            return(null);
        };

        if (this.A.isDown && this.D.isDown) {
            this.player.move("stop");
        }
        else if (this.A.isDown) {
            this.player.move("left");
        }
        else if (this.D.isDown) {
            this.player.move("right");
        }
        else {
            this.player.move("stop");
        };

        if (Phaser.Input.Keyboard.JustDown(this.W)) {
            if (this.A.isDown && this.D.isDown) {
                this.player.jump();
            }
            else if (this.A.isDown) {
                this.player.jump("left");
            }
            else if (this.D.isDown) {
                this.player.jump("right");
            }
            else {
                this.player.jump();
            };
        }
        else if (this.player.body.blocked.down) {
            this.player.rotation = 0;
        };

        if (Phaser.Input.Keyboard.JustDown(this.UP)) {
            this.player.shootStar();
        };
    };

    updateScore() {
        this.registry.set("time", this.registry.get("time") + 1);
        this.timeText.setText(this.registry.get("time"));
    };

    onPlayerBombCollision(player, bomb, string) {
        // console.log(string);
        if (player.isInvincible) {
            return(null);
        };
        bomb.destroy();
        player.takeDamage(bomb.damage);
    };

    onStarUfoCollision(star, ufo) {
        star.destroyStar();
        ufo.takeDamage(star.damage);
    };

    winScene() {
        this.updateScoreEvent.destroy();
        this.registry.set("time", this.registry.get("time"));
        this.time.delayedCall(2000, () => {
            this.theme.stop();
            this.scene.start("win");
        }, null, this);
    };

    gameOver() {
        this.updateScoreEvent.destroy();
        this.registry.set("time", this.registry.get("time"));
        this.time.delayedCall(1000, () => {
            this.theme.stop();
            this.scene.start("gameover");
        }, null, this);
    };

    loadAudios() {
        this.audios = {
            jump: this.sound.add("jump"),
            shoot: this.sound.add("shoot"),
            win: this.sound.add("win"),
            damage: this.sound.add("damage"),
            boom: this.sound.add("boom"),
            dead: this.sound.add("dead"),
        };
    };

    playAudio(key) {
        this.audios[key].play();
    };

    playMusic() {
        this.theme = this.sound.add("theme");
        this.theme.stop();
        this.theme.play({
            mute: false,
            volume: 1,
            rate: 1,
            delay: 0,
            loop: -1,
            seek: 0,
            detune: 0,
        });
    };

    getUfosGroup() { return(this.ufosGroup) };
    getBombsGroup() { return(this.bombsGroup) };
    getStarsGroup() { return(this.starsGroup) };

};

// EOF
