// Generator class to handle the creation of game objects, such as clouds and UFOs, at set intervals in the game.
// This class is responsible for managing the timed generation of clouds and UFOs, and updating the game state accordingly.

import Ufo from "../objects/ufo.js";
import Method from "../keys&methods/methods.js";

export default class Generator {

    // Constructor to initialize the Generator
    constructor(gameScene) {
        this.gameScene = gameScene; // Reference to the game scene
        this.clouds = 0;            // Track the number of clouds generated
        
        // Start the generation process immediately
        this.gameScene.time.delayedCall(0, () => this.init(), null, this); 
    };

    // Initialize cloud and UFO generation
    init() {
        this.generateCloud(); // Start generating clouds

        // Schedule first UFO generation after 1.5 seconds
        this.gameScene.time.delayedCall(1500, () => this.generateUfo(), null, this);
    };

    // Generate a cloud object
    generateCloud(array) {
        this.clouds += 1; // Increment cloud count
        if (Array.isArray(array)) {
            // console.log(array[0], array[1])
        } else {
            // console.log(this.clouds, "clouds created")
        };
        this.newCloud = new Cloud(this.gameScene); // Create a new cloud

        // Recursively schedule the next cloud generation at a random interval
        this.gameScene.time.delayedCall(Phaser.Math.Between(500, 1000),
            (arr) => this.generateCloud(arr), [[this.clouds, "clouds created"]], this);
    };

    // Generate a UFO object
    generateUfo() {
        if (this.gameScene.registry.get("UFOs") == 2) { // Check the registry for the current number of UFOs. Stop if there are already 2 UFOs.
            // console.log("no more ufos");
            return(null);
        };
        this.newUfo = new Ufo(this.gameScene, this.gameScene.getUfosGroup());   // Create a new UFO and update the UFO count in the registry
        this.UFOs_reg = this.gameScene.registry.get("UFOs");                    // Get current UFO count
        this.gameScene.registry.set("UFOs", this.UFOs_reg + 1);                 // Increment UFO count
        // console.log(this.gameScene.registry.get("UFOs"), "UFO attacks !!!")

        // Recursively schedule the next UFO generation after 1.5 seconds
        this.gameScene.time.delayedCall(1500, () => this.generateUfo(), null, this);
    };
};

// Cloud class representing the visual and movement behavior of clouds in the game
class Cloud extends Phaser.GameObjects.Image {

    // Constructor to initialize a Cloud object
    constructor(gameScene) {
        var method = new Method();                          // Create an instance of the Method class to retrieve cloud data
        var cloudData = method.cloudData();                 // Fetch cloud spawning data (Y position, scale, depth)
        super(gameScene, 850, cloudData.Y_spawn, "cloud");  // Call parent constructor to create cloud at (850, Y_spawn)
        this.gameScene = gameScene;                         // Reference to the game scene
        
        this.gameScene.add.existing(this); // Add cloud object to the game scene
        
        // Set cloud properties based on data from cloudData
        this.setScale(cloudData.scale); // Set cloud scale
        this.setOrigin(0.5);            // Set origin for proper positioning
        this.setAlpha(1);               // Cloud is fully visible
        this.setDepth(cloudData.depth); // Set depth for layering
        
        this.init(); // Call init function to start cloud movement
    };

    // Initialize cloud movement across the screen
    init() {
        this.cloudMovementTween = this.scene.tweens.add({ // Create a tween to move the cloud from right to left
            targets: this,
            x: {from: 850, to: -100},       // Move from the right side (x=850) to the left side (x=-100)
            duration: 2000 / this.scale,    // Move from the right side (x=850) to the left side (x=-100)
            onComplete: () => {
                this.destroyCloud();        // Destroy the cloud once it moves off-screen
            },
        });
    };

    // Destroy the cloud once it's off-screen
    destroyCloud() {
        this.destroy(); // Remove the cloud object from the game
    };
};

// EOF
