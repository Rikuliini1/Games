// Game class for the Phaser game engine, managing the main gameplay scene.
// This class handles player input, game object creation, collision detection,
// score management, and transitions between different game states (win/lose).
// It also manages the loading and playing of audio assets for a better gaming experience.

import Player from "../objects/player.js";          // Import the Player class for player functionality
import Generator from "../objects/generator.js";    // Import the Generator class for generating game objects
import Keys from "../keys&methods/keys.js";         // Import the Keys class for managing key inputs
import Method from "../keys&methods/methods.js";    // Import the Method class for utility functions

export default class Game extends Phaser.Scene {

    // Constructor for the Game scene, setting the key for scene management
    constructor() {
        super({key: "game"});
    };

    // Initialize method, called when the scene is started
    init(data) {
        this.name = data.gameName;                  // Store the game name from data
        this.version = data.versionNumber;          // Store the version number from data
        console.log(this.name, "/", this.version);  // Log the game name and version to the console
    };

    // Preload method, loads all necessary assets before the scene is created
    preload() {
        this.keys = new Keys(this);     // Initialize key management
        this.method = new Method(this); // Initialize utility methods

        // Initialize registry values for tracking game state
        this.registry.set("time", 0);               // Set initial time to 0
        this.registry.set("UFOs", 0);               // Initialize UFO count
        this.registry.set("UFOs alive", 2);         // Set the number of UFOs alive
        this.registry.set("first UFO spawn", -1);   // Track the first UFO spawn time
    };

    // Create method, called after preload, sets up game objects and mechanics
    create() {
        this.loadAudios();  // Load audio files
        this.playMusic();   // Start playing background music

        // Set background image and configure its properties
        this.backgroundImage = this.add.image(this.method.center("X"), this.method.center("Y"), 'sky')
            .setScale(1)        // Set the scale
            .setOrigin(0.5)     // Set the origin to the center
            .setAlpha(1)        // Set full opacity
            .setDepth(0);       // Set the drawing depth

        // Create bitmap text for displaying the time, positioning it at the top center
        this.timeText = this.add.bitmapText(this.method.center("X"), 20, "arcade", this.registry.get("time"), 25)
            .setScale(1)        // Set the scale
            .setOrigin(0.5)     // Center the text
            .setAlpha(1)        // Set full opacity
            .setDepth(100)      // Set a high depth to draw it on top
            .setTint(0x252525); // Set text color

        // Instantiate player and object generator
        this.player = new Player(this, this.method.center("X") - 200, this.sys.game.config.height);
        this.objectGenerator = new Generator(this);

        // Create groups for game objects
        this.ufosGroup = this.physics.add.group();  // Group for UFOs
        this.bombsGroup = this.physics.add.group(); // Group for bombs
        this.starsGroup = this.physics.add.group(); // Group for stars

        // Set up collision detection between player and bombs
        this.physics.add.overlap(this.player, this.bombsGroup, (player, bomb) => this.onPlayerBombCollision(player, bomb, "Taking damage"), null, this);
        
        // Set up collision detection between stars and UFOs
        this.physics.add.overlap(this.starsGroup, this.ufosGroup, this.onStarUfoCollision, null, this);

        // Event to update the score every second
        this.updateScoreEvent = this.time.addEvent({
            delay: 1000,            // Delay of 1000 ms (1 second)
            loop: -1,               // Loop indefinitely
            callback: () => {
                this.updateScore()  // Call the updateScore method
            },
        });
    };

    // Update method, called every frame to handle game logic
    update() {

        // If player is not alive, exit the update function
        if (this.player.alive == false) {
            return(null);
        };

        // Handle player movement based on key inputs
        if (this.A.isDown && this.D.isDown) {
            this.player.move("stop"); // Stop moving if both keys are pressed
        }
        else if (this.A.isDown) {
            this.player.move("left"); // Move left if A key is pressed
        }
        else if (this.D.isDown) {
            this.player.move("right"); // Move right if D key is pressed
        }
        else {
            this.player.move("stop"); // Stop moving if no keys are pressed
        };

        // Handle player jumping based on key inputs
        if (Phaser.Input.Keyboard.JustDown(this.W)) {
            if (this.A.isDown && this.D.isDown) {
                this.player.jump(); // Jump normally if both left and right keys are pressed
            }
            else if (this.A.isDown) {
                this.player.jump("left"); // Jump and rotate to the left
            }
            else if (this.D.isDown) {
                this.player.jump("right"); // Jump and rotate to the right
            }
            else {
                this.player.jump(); // Jump normally
            };
        }
        else if (this.player.body.blocked.down) {
            this.player.rotation = 0; // Reset player rotation if grounded
        };

        // Handle shooting stars if UP-arrow key is pressed
        if (Phaser.Input.Keyboard.JustDown(this.UP)) {
            this.player.shootStar();
        };
    };

    // Update the score and refresh the display
    updateScore() {
        this.registry.set("time", this.registry.get("time") + 1);   // Increment time by 1
        this.timeText.setText(this.registry.get("time"));           // Update the displayed time
    };

    // Collision handling for player and bombs
    onPlayerBombCollision(player, bomb, string) {
        // console.log(string);
        if (player.isInvincible) {      // Check if the player is invincible
            return(null);               // Exit if invincible
        };
        bomb.destroy();                 // Destroy the bomb
        player.takeDamage(bomb.damage); // Apply damage to the player
    };

    // Collision handling for stars and UFOs
    onStarUfoCollision(star, ufo) {
        star.destroyStar();             // Destroy the star
        ufo.takeDamage(star.damage);    // Apply damage to the UFO
    };

    // Handle winning the game and transitioning to the win scene
    winScene() {
        this.updateScoreEvent.destroy();                        // Stop the score update event
        this.registry.set("time", this.registry.get("time"));   // Finalize the time
        this.time.delayedCall(2000, () => {                     // Delay before transitioning to win scene
            this.theme.stop();                                  // Stop the music
            this.scene.start("win");                            // Start the win scene
        }, null, this);
    };

    // Handle game over logic and transition to the game over scene
    gameOver() {
        this.updateScoreEvent.destroy();                        // Stop the score update event
        this.registry.set("time", this.registry.get("time"));   // Finalize the time
        this.time.delayedCall(1000, () => {                     // Delay before transitioning to game over scene
            this.theme.stop();                                  // Stop the music
            this.scene.start("gameover");                       // Start the game over scene
        }, null, this);
    };

    // Load audio files and store them for later use
    loadAudios() {
        this.audios = {
            jump: this.sound.add("jump"),     // Load jump sound
            shoot: this.sound.add("shoot"),   // Load shoot sound
            win: this.sound.add("win"),       // Load win sound
            damage: this.sound.add("damage"), // Load damage sound
            boom: this.sound.add("boom"),     // Load explosion sound
            dead: this.sound.add("dead"),     // Load death sound
        };
    };

    // Play a specific audio by key
    playAudio(key) {
        this.audios[key].play(); // Play the sound associated with the key
    };

    // Play the background music for the game
    playMusic() {
        this.theme = this.sound.add("theme");   // Add the theme music
        this.theme.stop();                      // Ensure it is stopped before playing
        this.theme.play({                       // Play the theme music with settings
            mute: false,    // Boolean indicating whether the sound should be muted or not. Default: false
            volume: 1,      // A value between 0 (silence) and 1 (full volume). Default: 1
            rate: 1,        // Defines the speed at which the sound should be played. Default: 1
            delay: 0,       // Time in seconds that should elapse before the sound actually starts its playback. Default: 0
            loop: -1,       // Whether or not the sound or current sound marker should loop. Default: false / -1: infinite
            seek: 0,        // Position of playback for this sound, in seconds. Default: 0
            detune: 0,      // Represents detuning of sound in cents. Default: 0
        });
    };

    // Getter methods for various groups
    getUfosGroup() { return(this.ufosGroup) };   // Return the UFOs group
    getBombsGroup() { return(this.bombsGroup) }; // Return the bombs group
    getStarsGroup() { return(this.starsGroup) }; // Return the stars group

};

// EOF
