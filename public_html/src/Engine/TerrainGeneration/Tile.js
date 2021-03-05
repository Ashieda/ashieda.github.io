/*
* File: Tile.js 
* This is a Tile Class/Object used for procedural terrain generation
*/

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Tile(textureAsset, posArr, sizeArr) {
	this.mTexture = new TextureRenderable(textureAsset);
	this.mTexture.setColor([1, 1, 1, 1]);
	this.mTexture.getXform.setPosition(posArr[0], posArr[1]);
	this.mTexture.getXform.setSize(sizeArr[0], sizeArr[1]);

	this.mBound = new BoundingBox(posArr, sizeArr[0], sizeArr[1]);
	this.mRarity = 0; // Value should be between 0 and 100
}

Tile.prototype.setTexture = function (texture) {
	this.mTexture = texture;
};

Tile.prototype.getTexture = function () {
	return this.mTexture;
};

Tile.prototype.setRarity = function (value) {
	if (value < 0 || value > 100) {
		console.log("ERROR: setRarity value is " + value + ", must be between 0 and 100");
		return;
	}
	this.mRarity = value;
};

Tile.prototype.checkOtherTile = function (other) {
	return this.mBound.intersectsBound(other.mBound);
};

Tile.prototype.draw = function (camera) {
	this.mTexture.draw(camera);
};

// Debugging helper function
Tile.prototype.print = function () {
	return "Tile Print(): " + "\n" +
		   "W: " + this.mTexture.getXform().getWidth() +
		   "| H: " + this.mTexture.getXform().getHeight() + "\n" +
		   "xPos: " + this.mTexture.getXform().getXPos() +
		   "| yPos: " + this.mTexture.getXform().getYPos() + "\n";
};