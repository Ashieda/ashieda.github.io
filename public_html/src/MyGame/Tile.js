/*
* File: Tile.js 
* This is a Tile Class/Object used for procedural terrain generation
*/

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Tile(texture) {
	this.mTexture = texture;
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

};