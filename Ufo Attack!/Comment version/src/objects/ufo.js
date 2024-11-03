// Ufo class representing UFO objects in the game, including their behavior and interactions with other objects.
// This class also includes nested classes for HealthBar and Bomb, which manage the health representation and bomb behavior, respectively.

import Method from "../keys&methods/methods.js";

export default class Ufo extends Phaser.Physics.Arcade.Image {

    // Constructor to initialize the UFO with position and properties
    constructor(gameScene, ufosGroup) {
        var method = new Method(gameScene);             // Create a new instance of Method to access utility functions
        var ufoData = method.ufoData();                 // Retrieve UFO data for positioning and behavior
        super(gameScene, 400, ufoData.Y_spawn, "ufo");  // Call parent constructor to create the UFO image
        this.gameScene = gameScene;                     // Reference to the game scene
        this.method = new Method();                     // Another instance of Method for additional utilities
        this.ufoData = ufoData;                         // Store the retrieved UFO data

        this.gameScene.add.existing(this);          // Add the UFO to the scene
        this.gameScene.physics.add.existing(this);  // Enable physics for the UFO
        ufosGroup.add(this);                        // Add UFO to the provided UFOs group

        // Set initial properties of the UFO
        this.setScale(0.65, 0.9);   // Scale the UFO image
        this.setOrigin(0.5);   // Set the origin for positioning
        this.setAlpha(1);           // Set visibility
        this.setDepth(4);           // Set rendering depth

        this.alive = true;  // Flag indicating if the UFO is alive
        this.health = 20;   // Initial health of the UFO

        // Create a health bar for the UFO
        this.healthBar = new HealthBar(this.gameScene, this.x, this.y-18.5, this.health, this.ufoData);
        
        this.init(); // Initialize UFO behaviors
    };

    // Method to initialize UFO behaviors and movements
    init() {

        // Delay bomb generation for 1.5 seconds
        this.gameScene.time.delayedCall(1500, () => this.startBombGeneration(), null, this);

        this.ufoSpawnTween = this.gameScene.tweens.add({ // Tween for UFO movement from spawn to end position
            targets: this,
            x: {from: this.ufoData.X_spawn, to: this.ufoData.X_end},
            duration: this.ufoData.speed,
            onComplete: () => {
                this.ufoMovementTween = this.gameScene.tweens.add({ // Once the spawn movement completes, start a looping tween
                    targets: this,
                    x: {from: this.ufoData.X_end, to: this.ufoData.X_back},
                    duration: this.ufoData.speed,
                    yoyo: -1,   // Reverse the movement
                    loop: -1,   // Loop indefinitely
                });
            },
        });
    };

    // Method to start bomb generation at intervals
    startBombGeneration() {
        if (this.alive == true) { // Check if the UFO is still alive
            // console.log("bombing started")
            this.bombGenerationEvent = this.gameScene.time.addEvent({
                delay: Phaser.Math.FloatBetween(500, 800),  // Random delay between bomb drops
                loop: -1,                                   // Loop indefinitely
                callback: () => {
                    if (this.method.getONEorZERO()) {       // Randomly decide how many bombs to drop
                        this.dropBomb(); // Drop two bombs
                        this.dropBomb();
                    }
                    else {
                        this.dropBomb(); // Drop one bomb
                    };
                },
            });
        } else {
            // console.log("Ufo destroyed before bombing")
        };
    };

    // Method to create and drop a bomb
    dropBomb() {

        // Get bomb data based on current UFO position
        var bombData = this.method.bombData(this.x);

        // Create a new bomb instance
        this.newBomb = new Bomb(this.gameScene, bombData.X_spawn, this.y, this.gameScene.getBombsGroup());
    };

    // Method to apply damage to the UFO
    takeDamage(amount) {
        this.health -= amount;                  // Decrease health by the damage amount
        this.healthBar.decreaseHealth(amount);  // Update the health bar
        if (this.health <= 0) {                 // Check if health is zero or less
            this.healthBar.destroyHealthbar()   // Destroy the health bar
            this.destroyUfo();                  // Destroy the UFO
        };
    };

    // Method to handle UFO destruction
    destroyUfo() {
        this.gameScene.playAudio("boom");       // Play explosion sound
        this.alive = false;                     // Set alive status to false
        if (this.bombGenerationEvent) {
            this.bombGenerationEvent.remove();  // Stop bomb generation if active
        };
        this.destroy();                                                 // Destroy the UFO instance
        this.UFOs_alive = this.gameScene.registry.get("UFOs alive");    // Get current number of alive UFOs
        this.gameScene.registry.set("UFOs alive", this.UFOs_alive - 1); // Decrement the count of alive UFOs
        if (this.gameScene.registry.get("UFOs alive") == 0) {           // Check if all UFOs are destroyed
            this.gameScene.player.isInvincible = true;                  // Make the player invincible
            this.gameScene.winScene();                                  // Trigger win scene
        };
        console.log("Ufo destroyed");                                   // Log UFO destruction
    };
};

// HealthBar class to represent the health of the UFO visually
class HealthBar extends Phaser.GameObjects.Rectangle {

    // Constructor to initialize the healthbar
    constructor(gameScene, x, y, ufoHealth, ufoData) {
        super(gameScene, x, y, 70, 2, 0xff0000);    // Create a rectangle for health bar
        this.gameScene = gameScene;                 // Reference to the game scene
        this.ufoData = ufoData;                     // Store UFO data

        this.gameScene.add.existing(this); // Add health bar to the scene

        // Set initial properties of the health bar
        this.setScale(1);           // Set scale
        this.setOrigin(0.5);   // Set origin
        this.setAlpha(1);           // Set visibility
        this.setDepth(7);           // Set rendering depth

        this.oneHealthDamage = this.width / ufoHealth; // Calculate damage per health unit

        // Create border rectangle for the health bar
        this.border = this.gameScene.add.rectangle(x, y, 72, 4, 0x000000)
            .setScale(1)            // Set scale
            .setOrigin(0.5)    // Set origin
            .setAlpha(1)            // Set visibility
            .setDepth(6);           // Set rendering depth
        
        this.init(); // Initialize health bar movement
    };

    // Method to initialize health bar movement
    init() {
        this.moveHealthbar();   // Start moving the health bar
        this.moveBorder();      // Start moving the border
    };

    // Method to animate the health bar movement
    moveHealthbar() {
        this.healthbarTween = this.gameScene.tweens.add({ // Tween for Healthbar movement from spawn to end position
            targets: this,
            x: {from: this.ufoData.X_spawn, to: this.ufoData.X_end},    // Start and end based on UFO location
            duration: this.ufoData.speed,                               // Duration based on UFO speed
            onComplete: () => {
                this.ufoMovementTween = this.gameScene.tweens.add({ // Once the spawn movement completes, start a looping tween
                    targets: this,
                    x: {from: this.ufoData.X_end, to: this.ufoData.X_back},
                    duration: this.ufoData.speed,
                    yoyo: -1,   // Reverse the movement
                    loop: -1,   // Loop indefinitely
                });
            },
        });
    };

    // Method to animate the border movement
    moveBorder() {
        this.borberTween = this.gameScene.tweens.add({ // Tween for Healthbar border movement from spawn to end position
            targets: this.border,
            x: {from: this.ufoData.X_spawn, to: this.ufoData.X_end},    // Start and end based on UFO location
            duration: this.ufoData.speed,                               // Duration based on UFO speed
            onComplete: () => {
                this.ufoMovementTween = this.gameScene.tweens.add({ // Once the spawn movement completes, start a looping tween
                    targets: this.border,
                    x: {from: this.ufoData.X_end, to: this.ufoData.X_back},
                    duration: this.ufoData.speed,
                    yoyo: -1,   // Reverse the movement
                    loop: -1,   // Loop indefinitely
                });
            },
        });
    };

    // Method to decrease health displayed on the health bar
    decreaseHealth(amount) {
        this.width = this.width - (this.oneHealthDamage * amount); // Decrease width based on damage amount
    };

    // Method to destroy the health bar
    destroyHealthbar() {
        this.border.destroy();  // Destroy the border
        this.destroy();         // Destroy the health bar
    };
};

// Bomb class representing a bomb object dropped by UFOs in the game.
// Handles the bomb's behavior, including its gravity, collision with world bounds, and destruction.
class Bomb extends Phaser.Physics.Arcade.Image {

    // Constructor to initialize the bomb object
    constructor(gameScene, x, y, bombsGroup) {
        super(gameScene, x, y, "bomb"); // Call parent constructor to create the bomb object
        this.gameScene = gameScene;     // Reference to the game scene

        this.gameScene.add.existing(this);          // Add the bomb to the game scene
        this.gameScene.physics.add.existing(this);  // Enable physics for the bomb
        bombsGroup.add(this);                       // Add the bomb to the group of bombs

        // Set initial properties for the bomb
        this.setScale(1.3);         // Set the size scale of the bomb
        this.setOrigin(0.5);   // Set the origin point for positioning
        this.setAlpha(1);           // Set visibility
        this.setDepth(3);           // Set rendering depth for layering
        this.damage = 1;            // Set the damage that the bomb will cause

        // Set physics properties
        this.body.gravity.y = 300;          // Apply downward gravity to the bomb
        this.setCollideWorldBounds(true);   // Enable collision with the world bounds (e.g., game edges)
        this.body.onWorldBounds = true;     // Set the bomb to respond to hitting the world bounds

        // Event listener for when the bomb hits the world bounds
        gameScene.physics.world.on('worldbounds', (body) => {
            if (body.gameObject == this) {  // Check if the object that hit the bounds is this bomb
                this.destroy();             // Destroy the bomb if it hits the world bounds
            };
        });
        // console.log(`Bomb properties: x=${this.x}, y=${this.y}, gravityY=${this.body.gravity.y}`);
    };
};

// EOF
