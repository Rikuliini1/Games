// Method class provides utility methods and data for cloud, bomb, and UFO spawning in the game.
// This class handles calculations like determining random positions, movement paths, and center points of the screen.

export default class Method {

    // Constructor to initialize the Method class
    constructor(gameScene) {
        this.gameScene = gameScene; // Reference to the game scene
    };

    // Return either 0 or 1 randomly (used for deciding random outcomes in the game)
    getONEorZERO() {return(Phaser.Math.Between(0, 1))};

    // Calculate the center of the game screen on the specified axis ("X" or "Y")
    center(axis) {
        if (axis == "X") {
            let system_width = this.gameScene.sys.game.config.width;    // Get the width of the game canvas
            let center_width;
            return(center_width = system_width / 2);                    // Return the center width
        }
        else if (axis == "Y") {
            let system_height = this.gameScene.sys.game.config.height;  // Get the height of the game canvas
            let center_height;
            return(center_height = system_height / 2);                  // Return the center height
        };
    };

    // Generate random data for cloud objects (Y spawn position, scale, and depth)
    cloudData() {
        return {
            Y_spawn: Phaser.Math.FloatBetween(20, 170), // Random Y position between 20 and 170
            scale: Phaser.Math.FloatBetween(0.5, 1.5),  // Random scale between 0.5 and 1.5
            depth: (this.getONEorZERO() == 1) ? 2 : 5,  // Random depth, either 2 or 5
        };
    };

    // Generate random X spawn point for bombs, based on the UFO's current X position
    bombData(ufo_X_point) {
        return {
            X_spawn: ufo_X_point + Phaser.Math.FloatBetween(-120, 120), // Random X position on the UFO
        };
    };

    // Generate data for UFO spawning and movement (X and Y spawn points, movement paths, and speed)
    ufoData() {
        // Determine whether the UFO spawns on the right side (930) or the left side (-130)
        if (this.getONEorZERO()) {
            var ufo_X_spawn = 930;  // UFO spawns from the right
            var X_end = 130;        // End point on the left
            var X_back = 670;       // Intermediate point for return movement
        } else {
            var ufo_X_spawn = -130; // UFO spawns from the left
            var X_end = 670;        // End point on the right
            var X_back = 130;       // Intermediate point for return movement
        };

        // Determine Y spawn point based on whether it's the first or second UFO
        if (this.gameScene.registry.get("UFOs") == 0) { // If it's the first UFO
            let i;
            if (i = this.getONEorZERO()) {                              // Randomly choose the Y spawn range
                var ufo_Y_spawn = Phaser.Math.FloatBetween(60, 85);     // Lower altitude
            } else {
                var ufo_Y_spawn = Phaser.Math.FloatBetween(125, 160);   // Higher altitude
            };
            this.gameScene.registry.set("first UFO spawn", i);          // Store the first UFO spawn index
        }
        else if (this.gameScene.registry.get("UFOs") == 1) { // If it's the second UFO
            let i = this.gameScene.registry.get("first UFO spawn");     // Retrieve the first UFO's Y spawn index
            if (i == 1) {
                var ufo_Y_spawn = Phaser.Math.FloatBetween(125, 160);   // Higher altitude
            } else {
                var ufo_Y_spawn = Phaser.Math.FloatBetween(60, 85);     // Lower altitude
            };
        };

        var ufo_speed = Phaser.Math.FloatBetween(1500, 3500); // Random speed for UFO movement

        return {
            X_spawn: ufo_X_spawn,   // UFO's X spawn position
            Y_spawn: ufo_Y_spawn,   // UFO's Y spawn position
            X_end: X_end,           // End position for UFO's movement
            X_back: X_back,         // Intermediate position for UFO's return movement
            speed: ufo_speed,       // Speed of UFO movement
        };
    };
};

// EOF
