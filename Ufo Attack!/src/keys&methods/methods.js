export default class Method {
    constructor(gameScene) {
        this.gameScene = gameScene;
    };

    getONEorZERO() {return(Phaser.Math.Between(0, 1))};

    center(axis) {
        if (axis == "X") {
            let system_width = this.gameScene.sys.game.config.width;
            let center_width;
            return(center_width = system_width / 2);
        }
        else if (axis == "Y") {
            let system_height = this.gameScene.sys.game.config.height;
            let center_height;
            return(center_height = system_height / 2);
        };
    };

    cloudData() {
        return {
            Y_spawn: Phaser.Math.FloatBetween(20, 170),
            scale: Phaser.Math.FloatBetween(0.5, 1.5),
            depth: (this.getONEorZERO() == 1) ? 2 : 5,
        };
    };

    bombData(ufo_X_point) {
        return {
            X_spawn: ufo_X_point + Phaser.Math.FloatBetween(-120, 120),
        };
    };

    ufoData() {
        if (this.getONEorZERO()) {
            var ufo_X_spawn = 930;
            var X_end = 130;
            var X_back = 670;
        } else {
            var ufo_X_spawn = -130;
            var X_end = 670;
            var X_back = 130;
        };

        if (this.gameScene.registry.get("UFOs") == 0) {
            let i;
            if (i = this.getONEorZERO()) {
                var ufo_Y_spawn = Phaser.Math.FloatBetween(60, 85);
            } else {
                var ufo_Y_spawn = Phaser.Math.FloatBetween(125, 160);
            };
            this.gameScene.registry.set("first UFO spawn", i);
        }
        else if (this.gameScene.registry.get("UFOs") == 1) {
            let i = this.gameScene.registry.get("first UFO spawn");
            if (i == 1) {
                var ufo_Y_spawn = Phaser.Math.FloatBetween(125, 160);
            } else {
                var ufo_Y_spawn = Phaser.Math.FloatBetween(60, 85);
            };
        };

        var ufo_speed = Phaser.Math.FloatBetween(1500, 3500);

        return {
            X_spawn: ufo_X_spawn,
            Y_spawn: ufo_Y_spawn,
            X_end: X_end,
            X_back: X_back,
            speed: ufo_speed,
        };
    };
};

// EOF
