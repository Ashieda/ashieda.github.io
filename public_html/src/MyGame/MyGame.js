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

    this.greenTree1 = "assets/Green_Tree_1.png";
    this.greenTree2 = "assets/Green_Tree_2.png";
    this.greenTree3 = "assets/Green_Tree_3.png";
    this.pinkTree1 = "assets/Pink_Tree_1.png";
    this.pinkTree2 = "assets/Pink_Tree_2.png";
    this.pinkTree3 = "assets/Pink_Tree_3.png";
    this.yellowTree1 = "assets/Yellow_Tree_1.png";
    this.yellowTree2 = "assets/Yellow_Tree_2.png";
    this.yellowTree3 = "assets/Yellow_Tree_3.png";


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

    this.startX = null;
    this.startY = null;
    this.endX = null;
    this.endY = null;

    this.tempStruct = [];

    this.mUserStruct = null;
    this.tempStruct2 = null;

    this.worldWidth = null;
    this.worldHeight = null;

}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    // loads the textures
    gEngine.Textures.loadTexture(this.dirtTexture);
    gEngine.Textures.loadTexture(this.stoneTexture);
    gEngine.Textures.loadTexture(this.diamondTexture);
    gEngine.Textures.loadTexture(this.pinkBrickTexture);
    gEngine.Textures.loadTexture(this.dyeImage);
    gEngine.Textures.loadTexture(this.greenTree1);
    gEngine.Textures.loadTexture(this.greenTree2);
    gEngine.Textures.loadTexture(this.greenTree3);
    gEngine.Textures.loadTexture(this.yellowTree1);
    gEngine.Textures.loadTexture(this.yellowTree2);
    gEngine.Textures.loadTexture(this.yellowTree3);
    gEngine.Textures.loadTexture(this.pinkTree1);
    gEngine.Textures.loadTexture(this.pinkTree2);
    gEngine.Textures.loadTexture(this.pinkTree3);
};

MyGame.prototype.unloadScene = function () {
    // Game loop not running, unload all assets

    gEngine.Textures.unloadTexture(this.dirtTexture);
    gEngine.Textures.unloadTexture(this.stoneTexture);
    gEngine.Textures.unloadTexture(this.diamondTexture);
    gEngine.Textures.unloadTexture(this.pinkBrickTexture);
    gEngine.Textures.unloadTexture(this.dyeImage);
    gEngine.Textures.unloadTexture(this.greenTree1);
    gEngine.Textures.unloadTexture(this.greenTree2);
    gEngine.Textures.unloadTexture(this.greenTree3);
    gEngine.Textures.unloadTexture(this.yellowTree1);
    gEngine.Textures.unloadTexture(this.yellowTree2);
    gEngine.Textures.unloadTexture(this.yellowTree3);
    gEngine.Textures.unloadTexture(this.pinkTree1);
    gEngine.Textures.unloadTexture(this.pinkTree2);
    gEngine.Textures.unloadTexture(this.pinkTree3);
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
    this.tileSize = [1, 1];

    this.mWorldMatrix = null;
    this.mTiers = [ [0, 1],
                    [8, 10],
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

    this.startX = 0;
    this.startY = 0;
    this.endX = 100;
    this.endY = 75;

    this.tempStruct2 = [];
    var tempTile2 = new Tile(this.pinkBrickTexture, [0, 0], [3, 3]);
    for (var x = 0; x < 5; x++) {
      var col = [];
      for (var y = 0; y < 7; y++) {
        var tempTile = new Tile(this.diamondTexture, [0, 0], [3, 3]);
        col.push(tempTile);
      }
      this.tempStruct2.push(col);
    }
    console.log("final result: " + this.tempStruct2);


    this.tempStruct = [
      [tempTile, tempTile2, tempTile, tempTile2, tempTile],
      [tempTile, tempTile2, tempTile, tempTile2],
      [tempTile, tempTile2, tempTile, tempTile2, tempTile, tempTile2],
      [tempTile, tempTile2, tempTile, tempTile2, tempTile]
    ];

    this.mUserStruct = new UserStruct(this.tempStruct2);

    this.worldWidth = 500;
    this.worldHeight = 75;
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    if (this.mWorldMatrix !== null)
      this.mWorldMatrix.draw(this.mCamera, this.startX, this.startY, this.endX, this.endY);

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
    var layerTiers = [3, 0, 4, 1];

    this.mWorldMatrix = new WorldMatrix(arrOfLayers,                    // array of the layers
                                        layerTiers,                    // array of the tiers for the layers
                                        this.mTiers,                   // array of standard tier values
                                        [-20 + (this.tileSize[0]/2),   // starting position
                                         -10 + (this.tileSize[1]/2)],
                                        this.tileSize);                // tile size
    // this.mWorldMatrix.randomizeLayers();

    // this.mWorldMatrix.setSeed(12345);
    this.mWorldMatrix.generateWorld(this.worldWidth, this.worldHeight);
  }

  if (gEngine.Input.isKeyClicked(gEngine.Input.keys.T))
  {
    // this.mWorldMatrix.smoothTerrain();
    // console.log(this.mUserStruct.getStruct());
    // this.mUserStruct.addNoiseUpdated(0, 4);
    // console.log(this.mUserStruct.getStruct());
    // this.mWorldMatrix.insertStructure([0, 10], [0, 10], 100, this.tempStruct2);

    this.mWorldMatrix.presetHills(0, 35, 3);
    this.mWorldMatrix.presetValleys(36, 55, 10, 5);
    this.mWorldMatrix.presetHills(56, 75, 3);
    this.mWorldMatrix.presetPlateau(76, 125, 20, 5);
    this.mWorldMatrix.presetValleys(126, 175, 10, 5);
    this.mWorldMatrix.presetMountains(176, 230, 50, 5);
    this.mWorldMatrix.presetValleys(231, 250, 10, 5);
    this.mWorldMatrix.presetPlains(251, 350, 5);
    this.mWorldMatrix.presetMountains(351, 400, 50, 5);
    this.mWorldMatrix.presetPlateau(401, 445, 20, 5);
    this.mWorldMatrix.presetValleys(446, 480, 10, 5);
    this.mWorldMatrix.presetHills(481, 499, 3);

    this.mWorldMatrix.addGenerationObj(this.greenTree1, [8, 16], .02);
    this.mWorldMatrix.addGenerationObj(this.greenTree2, [8, 16], .02);
    this.mWorldMatrix.addGenerationObj(this.greenTree3, [8, 16], .02);
    this.mWorldMatrix.addGenerationObj(this.yellowTree1, [8, 16], .02);
    this.mWorldMatrix.addGenerationObj(this.yellowTree2, [8, 16], .02);
    this.mWorldMatrix.addGenerationObj(this.yellowTree3, [8, 16], .02);
    this.mWorldMatrix.addGenerationObj(this.pinkTree1, [8, 16], .02);
    this.mWorldMatrix.addGenerationObj(this.pinkTree2, [8, 16], .02);
    this.mWorldMatrix.addGenerationObj(this.pinkTree3, [8, 16], .02);
    console.log(this.mWorldMatrix.getGeneration());
    this.mWorldMatrix.generateWorld(this.worldWidth, this.worldHeight);

    for (var f = 0; f < this.mWorldMatrix.length; f++) {
      this.mWorldMatrix.attemptObjGeneration(f);
    }

  }

  if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Z)) {
    this.mUserStruct.addNoise(1, 3);
    this.mWorldMatrix.insertStructure([5, 100], [10, 12], 1, this.mUserStruct.getStruct());
  }

var delta = 1;
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.L)) {
    if (this.endX < this.worldWidth) {
      this.startX += delta;
      this.endX += delta;
      this.mCameraCenter[0] += delta;
    }
  }

  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.K)) {
    if (this.startY > 0) {
      this.startY -= delta;
      this.endY -= delta;
      this.mCameraCenter[1] -= delta;
    }
  }

  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.J)) {
    if (this.startX > 0) {
      this.startX -= delta;
      this.endX -= delta;
      this.mCameraCenter[0] -= delta;
    }
  }

  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.I)) {
    if (this.endY < this.worldHeight) {
      this.startY += delta;
      this.endY += delta;
      this.mCameraCenter[1] += delta;
    }
  }

  //******************Handle Dye's Movement************************
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
  //****************************************************************

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
