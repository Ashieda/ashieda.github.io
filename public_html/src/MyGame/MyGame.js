/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    // The camera to view the scene
    this.mCamera = null;

    this.mMsg = null;

    this.mLineSet = [];
    this.mCurrentLine = null;
    this.mP1 = null;
    
    this.testDirt = null;
    
    this.dirtTexture = "assets/MC_Dirt.png";
    this.dirtTile = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    // loads the textures
    gEngine.Textures.loadTexture(this.dirtTexture);
};

MyGame.prototype.unloadScene = function () {
    // Game loop not running, unload all assets

    gEngine.Textures.unloadTexture(this.dirtTexture);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(30, 27.5), // position of the camera
        100,                       // width of camera
        [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(-19, -8);
    this.mMsg.setTextHeight(3);
    
    this.testDirt = new TextureRenderable(this.dirtTexture);
    this.testDirt.setColor([0, 0, 0, 0]);
    this.testDirt.getXform().setPosition(5, 5);
    this.testDirt.getXform().setSize(5, 5);
    
    this.dirtTile = new Tile(this.testDirt);
    this.dirtTile.setRarity(50);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    var i, l;
    for (i = 0; i < this.mLineSet.length; i++) {
        l = this.mLineSet[i];
        l.draw(this.mCamera);
    }
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    
    this.testDirt.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    var msg = "Lines: " + this.mLineSet.length + " ";
    var echo = "";
    var x, y;

    msg += echo;
    this.mMsg.setText(msg);
};