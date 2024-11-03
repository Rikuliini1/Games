import Method from "../keys&methods/methods.js";

export default class Ufo extends Phaser.Physics.Arcade.Image {
    constructor(gameScene, ufosGroup) {
        var method = new Method(gameScene);
        var ufoData = method.ufoData();
        super(gameScene, 400, ufoData.Y_spawn, "ufo");
        this.gameScene = gameScene;
        this.method = new Method();
        this.ufoData = ufoData;
    
        this.gameScene.add.existing(this);
        this.gameScene.physics.add.existing(this);
        ufosGroup.add(this);

        this.setScale(0.65, 0.9);
        this.setOrigin(0.5);
        this.setAlpha(1);
        this.setDepth(4);

        this.alive = true;
        this.health = 30;
        this.healthBar = new HealthBar(this.gameScene, this.x, this.y-18.5, this.health, this.ufoData);
        
        this.init();
    };

    init() {
        this.gameScene.time.delayedCall(1500, () => this.startBombGeneration(), null, this);
        this.ufoSpawnTween = this.gameScene.tweens.add({
            targets: this,
            x: {from: this.ufoData.X_spawn, to: this.ufoData.X_end},
            duration: this.ufoData.speed,
            onComplete: () => {
                this.ufoMovementTween = this.gameScene.tweens.add({
                    targets: this,
                    x: {from: this.ufoData.X_end, to: this.ufoData.X_back},
                    duration: this.ufoData.speed,
                    yoyo: true,
                    loop: -1,
                });
            },
        });
    };

    startBombGeneration() {
        if (this.alive == true) {
            // console.log("bombing started")
            this.bombGenerationEvent = this.gameScene.time.addEvent({
                delay: Phaser.Math.FloatBetween(400, 600),
                loop: -1,
                callback: () => {
                    if (this.method.getONEorZERO()) {
                        this.dropBomb();
                        this.dropBomb();
                    }
                    else {
                        this.dropBomb();
                    };
                },
            });
        } else {
            // console.log("Ufo destroyed before bombing")
        };
    };

    dropBomb() {
        var bombData = this.method.bombData(this.x);
        this.newBomb = new Bomb(this.gameScene, bombData.X_spawn, this.y, this.gameScene.getBombsGroup());
    };

    takeDamage(amount) {
        this.health -= amount;
        this.healthBar.decreaseHealth(amount);
        if (this.health <= 0) {
            this.healthBar.destroyHealthbar()
            this.destroyUfo();
        };
    };

    destroyUfo() {
        this.gameScene.playAudio("boom");
        this.alive = false;
        if (this.bombGenerationEvent) {
            this.bombGenerationEvent.remove();
        };
        this.destroy();
        this.UFOs = this.gameScene.registry.get("UFOs");
        this.gameScene.registry.set("UFOs", (this.UFOs - 1));
        this.gameScene.ufosText.setText("UFOs: " + (this.UFOs - 1));
        if (this.gameScene.registry.get("UFOs") == 0) {
            if (this.gameScene.registry.get("no more UFOs") == true) {
                this.gameScene.player.isInvincible = true;
                this.gameScene.winScene();
            };
        };
        console.log("Ufo destroyed");
    };
};

class HealthBar extends Phaser.GameObjects.Rectangle {
    constructor(gameScene, x, y, ufoHealth, ufoData) {
        super(gameScene, x, y, 70, 2, 0xff0000);
        this.gameScene = gameScene;
        this.ufoData = ufoData;

        this.gameScene.add.existing(this);

        this.setScale(1);
        this.setOrigin(0.5);
        this.setAlpha(1);
        this.setDepth(8);

        this.fullHealth = this.width;
        this.oneHealthDamage = this.width / ufoHealth;

        this.ghostHealth = this.gameScene.add.rectangle(x, y, 70, 2, 0xffffff)
            .setScale(1)
            .setOrigin(0.5)
            .setAlpha(1)
            .setDepth(7);

        this.border = this.gameScene.add.rectangle(x, y, 72, 4, 0x000000)
            .setScale(1)
            .setOrigin(0.5)
            .setAlpha(1)
            .setDepth(6);

        this.init();
    };

    init() {
        this.moveHealthbar();
        this.moveGhostHealth();
        this.moveBorder();
    };

    moveHealthbar() {
        this.healthbarTween = this.gameScene.tweens.add({
            targets: this,
            x: {from: this.ufoData.X_spawn, to: this.ufoData.X_end},
            duration: this.ufoData.speed,
            onComplete: () => {
                this.ufoMovementTween = this.gameScene.tweens.add({
                    targets: this,
                    x: {from: this.ufoData.X_end, to: this.ufoData.X_back},
                    duration: this.ufoData.speed,
                    yoyo: -1,
                    loop: -1,
                });
            },
        });
    };

    moveGhostHealth() {
        this.borberTween = this.gameScene.tweens.add({
            targets: this.ghostHealth,
            x: {from: this.ufoData.X_spawn, to: this.ufoData.X_end},
            duration: this.ufoData.speed,
            onComplete: () => {
                this.ufoMovementTween = this.gameScene.tweens.add({
                    targets: this.ghostHealth,
                    x: {from: this.ufoData.X_end, to: this.ufoData.X_back},
                    duration: this.ufoData.speed,
                    yoyo: -1,
                    loop: -1,
                });
            },
        });
    };

    moveBorder() {
        this.borberTween = this.gameScene.tweens.add({
            targets: this.border,
            x: {from: this.ufoData.X_spawn, to: this.ufoData.X_end},
            duration: this.ufoData.speed,
            onComplete: () => {
                this.ufoMovementTween = this.gameScene.tweens.add({
                    targets: this.border,
                    x: {from: this.ufoData.X_end, to: this.ufoData.X_back},
                    duration: this.ufoData.speed,
                    yoyo: -1,
                    loop: -1,
                });
            },
        });
    };

    decreaseHealth(amount) {
        this.newWidth = this.width - (this.oneHealthDamage * amount);
        this.width = this.newWidth;
        this.ghostHealth.width = this.ghostHealth.width;
        this.ghostHealthTween?.stop();
        this.ghostHealthTween = this.scene.tweens.add ({
            delay: 500,
            targets: this.ghostHealth,
            duration: 1000,
            width: {from: this.ghostHealth.width, to: this.newWidth},
        });
    };

    destroyHealthbar() {
        this.border.destroy();
        this.ghostHealthTween?.stop();
        this.ghostHealth.destroy();
        this.destroy();
    };
};

class Bomb extends Phaser.Physics.Arcade.Image {
    constructor(gameScene, x, y, bombsGroup) {
        super(gameScene, x, y, "bomb");
        this.gameScene = gameScene;

        this.gameScene.add.existing(this);
        this.gameScene.physics.add.existing(this);
        bombsGroup.add(this);

        this.setScale(1.3);
        this.setOrigin(0.5);
        this.setAlpha(1);
        this.setDepth(3);
        this.damage = 1;

        this.body.gravity.y = 300;

        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;

        gameScene.physics.world.on('worldbounds', (body) => {
            if (body.gameObject == this) {
                this.destroy();
            };
        });
        // console.log(`Bomb properties: x=${this.x}, y=${this.y}, gravityY=${this.body.gravity.y}`);
    };
};

// EOF
