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

    this.testDirt = null;
    this.dirtTexture = "assets/MC_Dirt.png";
    this.stoneTexture = "assets/MC_Stone.png";
    this.diamondTexture = "assets/MC_Diamond.png";
    this.pinkBrickTexture = "assets/Terraria_PinkBrick.png";
    this.dyeImage = "assets/Dye.png";
    this.dirtTile = null;
    this.arr = null;
    this.nextPos = null;
    this.tileSize = null;

    this.mWorldMatrix = null;
    this.mTiers = null;
    this.mCameraCenter = null;
    
    //Storage variables for tiles Dye collides with
    this.topCollidingTile = null;
    this.botCollidingTile = null;
    this.leftCollidingTile = null;
    this.rightCollidingTile = null;
    
    this.canMoveDown = true;
    this.canMoveUp = true;
    this.canMoveLeft = true;
    this.canMoveRight = true;

}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    // loads the textures
    gEngine.Textures.loadTexture(this.dirtTexture);
    gEngine.Textures.loadTexture(this.stoneTexture);
    gEngine.Textures.loadTexture(this.diamondTexture);
    gEngine.Textures.loadTexture(this.pinkBrickTexture);
    gEngine.Textures.loadTexture(this.dyeImage);
};

MyGame.prototype.unloadScene = function () {
    // Game loop not running, unload all assets

    gEngine.Textures.unloadTexture(this.dirtTexture);
    gEngine.Textures.unloadTexture(this.stoneTexture);
    gEngine.Textures.unloadTexture(this.diamondTexture);
    gEngine.Textures.unloadTexture(this.pinkBrickTexture);
    gEngine.Textures.unloadTexture(this.dyeImage);
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

    this.mCameraCenter = [30, 27.5];

    this.arr = [];
    this.nextPos = [-17.5, -7.5];
    this.tileSize = [3, 3];

    this.mWorldMatrix = null;
    this.mTiers = [ [0, 1],
                    [99, 100],
                    [3, 4],
                    [3, 5],
                    [7, 10] ];

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(-19, -8);
    this.mMsg.setTextHeight(3);
    
    this.mHero = new SpriteRenderable(this.dyeImage);
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(30, 55);
    this.mHero.getXform().setSize(3, 4);
    this.mHero.createBoundingBox(30, 55, 3, 4);

    // this.dirtTile.setRarity(50);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    if (this.mWorldMatrix !== null)
      this.mWorldMatrix.draw(this.mCamera);
  
  this.mHero.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
  if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
  {
    var arrOfLayers = [this.pinkBrickTexture,
                       this.diamondTexture,
                       this.stoneTexture,
                       this.dirtTexture];
    var layerTiers = [3, 0, 4, 3];

    this.mWorldMatrix = new WorldMatrix(arrOfLayers,                   // array of the layers
                                        layerTiers,                    // array of the tiers for the layers
                                        this.mTiers,                   // array of standard tier values
                                        [-20 + (this.tileSize[0]/2),   // starting position
                                         -10 + (this.tileSize[1]/2)],
                                        this.tileSize);                // tile size
    // this.mWorldMatrix.randomizeLayers();                    
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
  
  //******************Handle Dye's Movement************************//
  var posDelta = 0.5;
  
  if(this.canMoveUp && gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)){
      this.mHero.getXform().incYPosBy(posDelta);
  }
  
  if(this.canMoveDown && gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)){
      this.mHero.getXform().incYPosBy(-posDelta);
  }
  
  if(this.canMoveLeft && gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)){
      this.mHero.getXform().incXPosBy(-posDelta);
  }
  
  if(this.canMoveRight && gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)){
      this.mHero.getXform().incXPosBy(posDelta);
  }
  
  //Update the bounding box position
  var heroX = this.mHero.getXform().getXPos();
  var heroY = this.mHero.getXform().getYPos();
  var heroWidth = this.mHero.getXform().getWidth();
  var heroHeight = this.mHero.getXform().getHeight();
  this.mHero.setBound(heroX, heroY, heroWidth, heroHeight);
  //****************************************************************//
  
  if(this.mWorldMatrix !== null){
    var worldMatrix = this.mWorldMatrix.getMatrix();
    //Check for collision between tiles and Dye
    for(var i = 0; i < worldMatrix.length; ++i){
        for(var j = 0; j < worldMatrix[i].length; ++j){
            var tile = worldMatrix[i][j];
            var tileBound = tile.getBound();
            var heroBound = this.mHero.getBound();
            var tileX = tile.getTexture().getXform().getXPos();
            var tileY = tile.getTexture().getXform().getYPos();

            //Restrict Dye's movement based on where she hit the tile
            if(tile.objCollision(heroBound)){
                if(heroBound.minY() < tileBound.maxY() && heroY > tileY){
                    this.canMoveDown = false;
                    this.botCollidingTile = tile;
                }
                if(heroBound.minX() < tileBound.maxX() && heroX > tileX){
                    this.canMoveLeft = false;
                    this.leftCollidingTile = tile;
                }
                if(heroBound.maxY() > tileBound.minY() && heroY < tileY){
                    this.canMoveUp = false;
                    this.topCollidingTile = tile;
                }
                if(heroBound.maxX() > tileBound.minX() && heroX < tileX){
                    this.canMoveRight = false;
                    this.rightCollidingTile = tile;
                }
            }

        }
    }
    
    if(this.botCollidingTile !== null){
        var heroBound = this.mHero.getBound();
        if( ! this.botCollidingTile.objCollision(heroBound))
            this.canMoveDown = true;
    }
    
    if(this.leftCollidingTile !== null){
        var heroBound = this.mHero.getBound();
        if( ! this.leftCollidingTile.objCollision(heroBound))
            this.canMoveLeft = true;
    }
    
    if(this.topCollidingTile !== null){
        var heroBound = this.mHero.getBound();
        if( ! this.topCollidingTile.objCollision(heroBound))
            this.canMoveUp = true;
    }
    
    if(this.rightCollidingTile !== null){
        var heroBound = this.mHero.getBound();
        if( ! this.rightCollidingTile.objCollision(heroBound))
            this.canMoveRight = true;
    }
    
  }


  this.mCamera.setWCCenter(this.mCameraCenter[0], this.mCameraCenter[1]);

  if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
    var x = Math.floor(this.mCamera.mouseWCX());
    var y = Math.floor(this.mCamera.mouseWCY());
    if(this.mWorldMatrix !== null){
        var clickedTile = this.mWorldMatrix.getTile(x,y);
        if(clickedTile !== null)
            console.log(clickedTile.print());
    }

  }

  this.mCamera.updateCam();
};
