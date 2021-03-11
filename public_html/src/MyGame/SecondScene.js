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

function SecondScene() {
    // The camera to view the scene
    this.mCamera = null;

    this.mMsg = null;

    this.testDirt = null;
    this.crimTexture = "assets/TR_Crimstone.png";
    this.dirtTexture = "assets/TR_Dirt.png";
    this.grassyDirtTexture = "assets/TR_GrassyDirt.png";
    this.ebonTexture = "assets/TR_Ebonstone.png";
    this.pinkBrickTexture = "assets/Terraria_PinkBrick.png";
    this.dirtTile = null;
    this.arr = null;
    this.nextPos = null;
    this.tileSize = null;

    this.mWorldMatrix = null;
    this.mTiers = null;
    this.mCameraCenter = null;

}
gEngine.Core.inheritPrototype(SecondScene, Scene);

SecondScene.prototype.loadScene = function () {
    // loads the textures
    gEngine.Textures.loadTexture(this.dirtTexture);
    gEngine.Textures.loadTexture(this.grassyDirtTexture);
    gEngine.Textures.loadTexture(this.crimTexture);
    gEngine.Textures.loadTexture(this.ebonTexture);
    gEngine.Textures.loadTexture(this.pinkBrickTexture);
};

SecondScene.prototype.unloadScene = function () {
    // Game loop not running, unload all assets

    gEngine.Textures.unloadTexture(this.dirtTexture);
    gEngine.Textures.unloadTexture(this.grassyDirtTexture);
    gEngine.Textures.unloadTexture(this.crimTexture);
    gEngine.Textures.unloadTexture(this.ebonTexture);
    gEngine.Textures.unloadTexture(this.pinkBrickTexture);
};

SecondScene.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(30, 27.5), // position of the camera
        100,                       // width of camera
        [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray

    this.mCameraCenter = [30, 27.5];

    this.arr = [];
    this.nextPos = [-17.5, -7.5];
    this.tileSize = [3, 3];

    this.mWorldMatrix = null;
    this.mTiers = [ [0, 1],
                    [99, 100],
                    [3, 4],
                    [3, 5],
                    [7, 10],
                    [11,12]];

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(-19, -8);
    this.mMsg.setTextHeight(3);

    // this.dirtTile.setRarity(50);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
SecondScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    if (this.mWorldMatrix !== null)
      this.mWorldMatrix.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
SecondScene.prototype.update = function () {
  if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
  {
    var arrOfLayers = [this.pinkBrickTexture,
                       this.crimTexture,
                       this.ebonTexture,
                       this.dirtTexture,
                       this.grassyDirtTexture];
    var layerTiers = [2, 0, 2, 2, 0];

    this.mWorldMatrix = new WorldMatrix(arrOfLayers,                   // array of the layers
                                        layerTiers,                    // array of the tiers for the layers
                                        this.mTiers,                   // array of standard tier values
                                        [-20 + (this.tileSize[0]/2),   // starting position
                                         -10 + (this.tileSize[1]/2)],
                                        this.tileSize);                // tile size

    this.mWorldMatrix.generateWorld(100/this.tileSize[0], 75/this.tileSize[1]);
  }

  if (gEngine.Input.isKeyClicked(gEngine.Input.keys.T))
  {
    this.mWorldMatrix.smoothTerrain();
  }

  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
  {
    if (this.mCameraCenter[1] < 60)
    {
      this.mCameraCenter[1] += (60 - this.mCameraCenter[1])*0.3;
    }
  }else {
    if (this.mCameraCenter[1] > 27.5)
    {
      this.mCameraCenter[1] -= (this.mCameraCenter[1] - 27.5)*0.3;
    }
  }

  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
  {
    if (this.mCameraCenter[0] > 22.5)
    {
      this.mCameraCenter[0] -= (this.mCameraCenter[1] - 22.5)*0.3;
    }
  }else {
    if (this.mCameraCenter[0] < 30)
    {
      this.mCameraCenter[0] += (30 - this.mCameraCenter[0])*0.3;
    }
  }

  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
  {
    if (this.mCameraCenter[0] < 37.5)
    {
      this.mCameraCenter[0] += (37.5 - this.mCameraCenter[1])*0.3;
    }
  }else {
    if (this.mCameraCenter[0] > 30)
    {
      this.mCameraCenter[0] -= (this.mCameraCenter[0] - 30)*0.3;
    }
  }

  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
  {
    if (this.mCameraCenter[1] > 20)
    {
      this.mCameraCenter[1] -= (this.mCameraCenter[1] - 20)*0.3;
    }
  }else {
    if (this.mCameraCenter[1] < 27.5)
    {
      this.mCameraCenter[1] += (27.5 - this.mCameraCenter[1])*0.3;
    }
  }

  this.mCamera.setWCCenter(this.mCameraCenter[0], this.mCameraCenter[1]);

  if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
    var x = Math.floor(this.mCamera.mouseWCX());
    var y = Math.floor(this.mCamera.mouseWCY());
    if(this.mWorldMatrix !== null){
        var clickedTile = this.mWorldMatrix.getTile(x,y);
        if(clickedTile !== null)
            //this.mWorldMatrix.emptySpace(clickedTile, .3);
            console.log(clickedTile.print());
    }

  }
};
