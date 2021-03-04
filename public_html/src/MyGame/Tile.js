/*
* File: Tile.js 
* This is a Tile Class/Object used for procedural terrain generation
*/

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Tile(texture) {
	this.mTexture = texture;
	this.mRarity = 0; // Value should be between 0 and 100
	
	var width = texture.getXform().getWidth();
	var height = texture.getXform().getHeight();
	var xPos = texture.getXform().getXPos();
	var yPos = texture.getXform().getYPos();
	this.mBound = new BoundingBox([xPos, yPos], width, height);
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

// Debugging helper function
Tile.prototype.print = function () {
	return "Tile Print(): " + "\n" +
		   "W: " + this.mTexture.getXform().getWidth() +
		   "| H: " + this.mTexture.getXform().getHeight() + "\n" +
		   "xPos: " + this.mTexture.getXform().getXPos() +
		   "| yPos: " + this.mTexture.getXform().getYPos() + "\n";
}