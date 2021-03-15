/*
* File: GenerationObject.js
* This is a Generation Class/Object used for procedural object generation and placement
*/

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GenerationObject(textureAsset, sizeArr, generationRate) {
	this.mName = textureAsset;
	this.mTextureRend = new TextureRenderable(textureAsset);
	this.mTextureRend.setColor([0, 0, 0, 0]);
	this.mTextureRend.getXform().setSize(sizeArr[0], sizeArr[1]);

        this.mBound = null;
        this.generationRate = generationRate;

        //this.attachedTile = null;
        //this.columnNum = 0;
}

GenerationObject.prototype.clone = function(){
    var textureAsset = this.mName;
    var size = this.mTextureRend.getXform().getSize();
    return new GenerationObject(textureAsset, size, this.generationRate);
};

GenerationObject.prototype.getTextureAsset = function () { return this.mName; };

GenerationObject.prototype.getRenderable = function () {
	return this.mTextureRend;
};

GenerationObject.prototype.setPos = function(xPos, yPos){
    console.log("New position: (" + xPos + ", " + yPos + ")");
    this.mTextureRend.getXform().setPosition(xPos, yPos);
};

//GenerationObject.prototype.setAttachedTile = function(tile){
//    this.attachedTile = tile;
//};
//
//GenerationObject.prototype.getAttachedTile = function(tile){
//    return this.attachedTile;
//};

//GenerationObject.prototype.setColNum = function(colNum){
//    this.columNum = colNum;
//};
//
//GenerationObject.prototype.getColNum = function(){
//    return this.columnNum;
//};

GenerationObject.prototype.getPos = function(){
    return this.mTextureRend.getXform().getPosition();
};

GenerationObject.prototype.getSize = function (){
    return this.mTextureRend.getXform().getSize();
};

GenerationObject.prototype.addBound = function(posArr, sizeArr) {
    this.mBound = new BoundingBox(posArr, sizeArr);
};

GenerationObject.prototype.getBound = function() {
	return this.mBound;
};

GenerationObject.prototype.getRate = function(){
    return this.generationRate;
};

GenerationObject.prototype.objCollision = function(objectBound){
    return this.mBound.intersectsBound(objectBound);
};
