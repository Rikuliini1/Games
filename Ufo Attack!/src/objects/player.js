export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(gameScene, x, y) {
        super(gameScene, x, y, "dude");
        this.gameScene = gameScene;

        this.gameScene.add.existing(this);
        this.gameScene.physics.add.existing(this);

        this.setScale(1);
        this.setOrigin(0.5);
        this.setAlpha(1);
        this.setDepth(1);

        this.alive = true;
        this.health = 3;
        this.isInvincible = false;
        
        this.body.gravity.y = 5000;
        this.body.collideWorldBounds = true;
        
        this.anims.create({key: "walk_left", frames: this.anims.generateFrameNumbers("dude", {start: 0, end: 3}), frameRate: 6});
        this.anims.create({key: "face_forward", frames: [{key: "dude", frame: 4}]});
        this.anims.create({key: "walk_right", frames: this.anims.generateFrameNumbers("dude", {start: 5, end: 8}), frameRate: 6});
    };

    move(action) {
        if (action == "left") {
            this.setVelocityX(-300);
            this.anims.play("walk_left", true);
        }
        else if (action == "right") {
            this.setVelocityX(300);
            this.anims.play("walk_right", true);
        }
        else if (action == "stop") {
            this.setVelocityX(0);
            this.anims.play("face_forward", true);
        };
    };

    jump(direction) {
        if (!this.body.blocked.down) {
            return(null);
        } else {
            if (direction == "left") {
                var start = 360;
                var end = 0;
            }
            else if (direction == "right") {
                var start = 0;
                var end = 360;
            };

            this.jumpTween = this.scene.tweens.add({
                targets: this,
                duration: 500,
                angle: {from: start, to: end},
            });
            this.gameScene.playAudio("jump");
            this.body.setVelocityY(-this.body.gravity.y / 3.5);
        };
    };

    shootStar() {
        this.gameScene.playAudio("shoot");
        this.newStar = new Star(this.gameScene, this.x, this.y, this.gameScene.getStarsGroup());
    };

    takeDamage() {
        this.gameScene.playAudio("damage");
        this.isInvincible = true;
        this.health -= 1;
        this.gameScene.livesText.setText("Lives: " + this.health);
        console.log("Hit!", "Player health:", this.health);
        if (this.health <= 0) {
            this.destroyPlayer();
            return(null);
        };
        this.flickerTimer = this.gameScene.time.addEvent({
            delay: 80,
            loop: -1,
            callback: () => {
                this.alpha = (this.alpha == 1) ? 0.2 : 1;
            },
        });

        this.invincibilityTimer = this.gameScene.time.delayedCall(2500, () => {
            this.flickerTimer.remove();
            this.alpha = 1;
            this.isInvincible = false;
        }, null, this);
    };

    destroyPlayer() {
        this.alive = false;
        this.setVelocity(0);
        this.setGravity(0);
        this.anims.stop();
        this.jumpTween?.stop();
        this.fadeout = this.gameScene.time.addEvent({
            delay: 50,
            loop: -1,
            callback: () => {
                if (this.alpha <= 0) {
                    this.fadeout.remove();
                    this.destroy();
                    this.gameScene.gameOver();
                } else {
                    this.alpha -= 0.05;
                };
            },
        });
    };
};

class Star extends Phaser.Physics.Arcade.Image {
    constructor(gameScene, x, y, starsGroup) {
        super(gameScene, x, y, "star");

        gameScene.add.existing(this);
        gameScene.physics.add.existing(this);
        starsGroup.add(this);

        this.setScale(1);
        this.setOrigin(0.5);
        this.setAlpha(1);
        this.setDepth(0);
        this.damage = 1;

        this.body.velocity.y = -1000;

        this.outOfBoundsEvent = gameScene.time.addEvent({
            delay: 10,
            loop: -1,
            callback: () => {
                this.checkIfOutOfBounds();
            },
        });
    };

    checkIfOutOfBounds() {
        if (this.y < -100) {
            this.outOfBoundsEvent.remove();
            this.destroyStar();
        };
    };

    destroyStar() {
        this.outOfBoundsEvent.remove();
        this.destroy();
    };
};

// EOF
