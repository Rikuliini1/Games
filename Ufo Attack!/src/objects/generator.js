import Ufo from "../objects/ufo.js";
import Method from "../keys&methods/methods.js";

export default class Generator {
    constructor(gameScene) {
        this.gameScene = gameScene;
        this.clouds = 1;
        this.gameScene.time.delayedCall(0, () => this.init(), null, this);
    };

    init() {
        this.generateCloud();
        this.gameScene.time.delayedCall(1500, () => this.generateUfo(0), null, this);
    };

    generateCloud(array) {
        this.clouds += 1;
        if (Array.isArray(array)) {
            // console.log(array[0], array[1])
        } else {
            // console.log("1 cloud created")
        };
        this.newCloud = new Cloud(this.gameScene);
        this.gameScene.time.delayedCall(Phaser.Math.Between(500, 1000),
            (arr) => this.generateCloud(arr), [[this.clouds, "clouds created"]], this);
    };

    generateUfo(i) {
        if (i == this.gameScene.registry.get("total UFOs")) {
            // console.log("no more ufos");
            return(null);
        };
        this.newUfo = new Ufo(this.gameScene, this.gameScene.getUfosGroup());
        this.UFOs = this.gameScene.registry.get("UFOs");
        this.gameScene.registry.set("UFOs", (this.UFOs + 1));
        this.gameScene.ufosText.setText("UFOs: " + (this.UFOs + 1))
        if ((i + 1) == this.gameScene.registry.get("total UFOs")) {
            this.gameScene.registry.set("no more UFOs", true)
        };
        console.log(this.gameScene.registry.get("UFOs"), "UFO attacks !!!")
        this.gameScene.time.delayedCall(1500, () => this.generateUfo(i+1), null, this);
    };
};

class Cloud extends Phaser.GameObjects.Image {
    constructor(gameScene) {
        var method = new Method();
        var cloudData = method.cloudData();
        super(gameScene, 850, cloudData.Y_spawn, "cloud");
        this.gameScene = gameScene;
        
        this.gameScene.add.existing(this);
        
        this.setScale(cloudData.scale);
        this.setOrigin(0.5);
        this.setAlpha(1);
        this.setDepth(cloudData.depth);
        
        this.init();
    };

    init() {
        this.cloudMovementTween = this.scene.tweens.add({
            targets: this,
            x: {from: 850, to: -100},
            duration: 2000 / this.scale,
            onComplete: () => {
                this.destroyCloud();
            },
        });
    };

    destroyCloud() {
        this.destroy();
    };
};

// EOF
