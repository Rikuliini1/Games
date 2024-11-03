// Player class and Star class for the game, built using Phaser's physics arcade system.
// The Player class controls the player character's movement, animations, health, and interactions with the game world.
// The Star class represents a projectile shot by the player, handling its behavior and destruction.

export default class Player extends Phaser.Physics.Arcade.Sprite {

    // Constructor to initialize the player object
    constructor(gameScene, x, y) {
        super(gameScene, x, y, "dude"); // Call parent class Phaser.Sprite constructor to create player sprite at (x, y)
        this.gameScene = gameScene;     // Reference to the game scene

        this.gameScene.add.existing(this);          // Add player sprite to the game scene
        this.gameScene.physics.add.existing(this);  // Enable physics for the player sprite

        // Set player properties
        this.setScale(1);       // Default scale of the player
        this.setOrigin(0.5);    // Set origin for proper positioning and rotation
        this.setAlpha(1);       // Player is fully visible
        this.setDepth(1);       // Set depth for layering

        // Player state
        this.alive = true;          // Flag to track if the player is alive
        this.health = 3;            // Player starts with 3 health points
        this.isInvincible = false;  // Flag to track invincibility after taking damage
        
        // Physics properties
        this.body.gravity.y = 5000;             // Set gravity for the player
        this.body.collideWorldBounds = true;    // Ensure the player doesn't fall out of the game world

        // Player animations
        this.anims.create({key: "walk_left", frames: this.anims.generateFrameNumbers("dude", {start: 0, end: 3}), frameRate: 6});
        this.anims.create({key: "face_forward", frames: [{key: "dude", frame: 4}]});
        this.anims.create({key: "walk_right", frames: this.anims.generateFrameNumbers("dude", {start: 5, end: 8}), frameRate: 6});
    };

    // Move the player based on input ('left', 'right', or 'stop')
    move(action) {
        if (action == "left") {
            this.setVelocityX(-300);            // Move left with velocity
            this.anims.play("walk_left", true); // Play 'walk left' animation
        }
        else if (action == "right") {
            this.setVelocityX(300);                 // Move right with velocity
            this.anims.play("walk_right", true);    // Play 'walk right' animation
        }
        else if (action == "stop") {
            this.setVelocityX(0);                   // Stop horizontal movement
            this.anims.play("face_forward", true);  // Play 'facing forward' animation
        };
    };

    // Make the player jump, with optional direction
    jump(direction) {
        if (!this.body.blocked.down) { // Prevent jumping mid-air
            return(null);
        } else {
            if (direction == "left") {
                var start = 360;    // Start spinning from angle 360 degrees
                var end = 0;        // End at 0 degrees
            }
            else if (direction == "right") {
                var start = 0;      // Start spinning from 0 degrees
                var end = 360;      // End at 360 degrees
            };

            // Tween for jump spin
            this.jumpTween = this.scene.tweens.add({
                targets: this,  // Tween targets the player
                duration: 500,  // Tween lasts for 500ms (half a second)
                angle: {from: start, to: end},
            });
            this.gameScene.playAudio("jump");                   // Play jump sound effect
            this.body.setVelocityY(-this.body.gravity.y / 3.5); // Apply upward velocity for jump
        };
    };

    // Shoot a star projectile from the player's position
    shootStar() {
        this.gameScene.playAudio("shoot"); // Play shooting sound effect

        // Create and shoot a new star
        this.newStar = new Star(this.gameScene, this.x, this.y, this.gameScene.getStarsGroup()); 
    };

    // Handle player taking damage
    takeDamage() {
        this.gameScene.playAudio("damage");                 // Play damage sound effect
        this.isInvincible = true;                           // Make the player invincible for a short period
        this.health -= 1;                                   // Reduce player health by 1
        console.log("Hit!", "Player health:", this.health); // Log player's health for debugging
        if (this.health <= 0) {
            this.destroyPlayer();                           // If health reaches 0, destroy the player
            return(null);
        };

        // Flicker effect during invincibility
        this.flickerTimer = this.gameScene.time.addEvent({
            delay: 80,  // Flicker every 80ms
            loop: -1,   // Loop until invincibility ends
            callback: () => {
                this.alpha = (this.alpha == 1) ? 0.2 : 1; // Toggle transparency to create flicker effect
            },
        });

        // Set timer to end invincibility after 2.5 seconds
        this.invincibilityTimer = this.gameScene.time.delayedCall(2500, () => {
            this.flickerTimer.remove(); // Stop flicker effect
            this.alpha = 1;             // Restore full visibility
            this.isInvincible = false;  // End invincibility
        }, null, this);
    };

    // Destroy the player, play fading out animation, and trigger game over
    destroyPlayer() {
        this.alive = false;     // Set player as dead
        this.setVelocity(0);    // Stop player movement
        this.setGravity(0);     // Remove gravity
        this.anims.stop();      // Stop any animations
        this.jumpTween?.stop(); // Stop jump tween if active

        // Fade out effect before removing player
        this.fadeout = this.gameScene.time.addEvent({
            delay: 50,
            loop: -1,
            callback: () => {
                if (this.alpha <= 0) {          // When player is invisible
                    this.fadeout.remove();      // Stop fading
                    this.destroy();             // Destroy player sprite
                    this.gameScene.gameOver();  // Trigger game over
                } else {
                    this.alpha -= 0.05;         // Gradually decrease alpha for fade out
                };
            },
        });
    };
};

// Star class, representing the player's projectile in the game
class Star extends Phaser.Physics.Arcade.Image {

    // Constructor to initialize the star object
    constructor(gameScene, x, y, starsGroup) {
        super(gameScene, x, y, "star"); // Call parent constructor to create a star image

        gameScene.add.existing(this);           // Add star to the game scene
        gameScene.physics.add.existing(this);   // Enable physics for the star
        starsGroup.add(this);                   // Add star to the stars group

        // Set star properties
        this.setScale(1);       // Default size scale
        this.setOrigin(0.5);    // Set origin for positioning
        this.setAlpha(1);       // Star is fully visible
        this.setDepth(0);       // Set depth for rendering layer
        this.damage = 1;        // Damage the star deals
        
        this.body.velocity.y = -1000; // Set the star's upward velocity (shooting speed)

        // Continuously check if the star has gone out of bounds
        this.outOfBoundsEvent = gameScene.time.addEvent({
            delay: 10,  // Check every 10ms
            loop: -1,   // Continuously check
            callback: () => {
                this.checkIfOutOfBounds(); // Call the method to check bounds
            },
        });
    };

    // Check if the star has gone off-screen
    checkIfOutOfBounds() {
        if (this.y < -100) {                // If the star goes above the screen
            this.outOfBoundsEvent.remove(); // Stop the out of bounds checking
            this.destroyStar();             // Destroy the star object
        };
    };

    // Destroy the star and stop its out of bounds event
    destroyStar() {
        this.outOfBoundsEvent.remove(); // Remove the event listener
        this.destroy();                 // Destroy the star object
    };
};

// EOF
