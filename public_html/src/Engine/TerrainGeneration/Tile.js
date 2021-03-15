/*
* File: Tile.js
* This is a Tile Class/Object used for procedural terrain generation
*/

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Tile(textureAsset, posArr, sizeArr) {
	this.mName = textureAsset;
	this.mTexture = new TextureRenderable(textureAsset);
	this.mTexture.setColor([0, 0, 0, 0]);
	this.mTexture.getXform().setPosition(posArr[0], posArr[1]);
	this.mTexture.getXform().setSize(sizeArr[0], sizeArr[1]);

	this.mBound = new BoundingBox(posArr, sizeArr[0], sizeArr[1]);

	this.topNeighbor = null;
	this.botNeighbor = null;
	this.leftNeighbor = null;
	this.rightNeighbor = null;
}

Tile.prototype.clone = function() {
    var textureAsset = this.mName;
    var posArr = this.mTexture.getXform().getPosition();
    var sizeArr = this.mTexture.getXform().getSize();
    
    var newTile = new Tile(textureAsset, posArr, sizeArr);
    return newTile;
};

Tile.prototype.getTextureAsset = function () { return this.mName; };

Tile.prototype.setTexture = function (texture) {
	this.mTexture = texture;
};

Tile.prototype.getTexture = function () {
	return this.mTexture;
};

Tile.prototype.setTopNeighbor = function(tile){
    this.topNeighbor = tile;
};

Tile.prototype.setBotNeighbor = function(tile){
    this.botNeighbor = tile;
};

Tile.prototype.setLeftNeighbor = function(tile){
    this.leftNeighbor = tile;
};

Tile.prototype.setRightNeighbor = function(tile){
    this.rightNeighbor = tile;
};

Tile.prototype.getBound = function() {
	return this.mBound;
};

Tile.prototype.objCollision = function(objectBound){
    return this.mBound.intersectsBound(objectBound);
};

Tile.prototype.clone = function() {
    var textureAsset = this.mName;
    var posArr = this.mTexture.getXform().getPosition();
    var sizeArr = this.mTexture.getXform().getSize();

    var newTile = new Tile(textureAsset, posArr, sizeArr);
    return newTile;
};

// Debugging helper function
Tile.prototype.print = function () {
	return "Tile " + this.mName + " Print(): " + "\n" +
		   "W: " + this.mTexture.getXform().getWidth() +
		   "| H: " + this.mTexture.getXform().getHeight() + "\n" +
		   "xPos: " + this.mTexture.getXform().getXPos() +
		   "| yPos: " + this.mTexture.getXform().getYPos() + "\n";
};
