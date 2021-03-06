/*
 *File WorldMatrix.js
 */

 "use strict";

/* Usage:
 * Passed in variables:
 *  layers should be a dictionary of {Renderable : integer} pairs
 *    We will, when populating the world matrix, create a Tile object
 *    which will take a Renderable object
 *
 *    The integer will signify which tier that layer is (1-5 inclusive).
 *    The tier will be used later to decide how numerous a element will appear
 *
 *  tier should be an array of arrays, with a fixed length of 5. each array
 *  inside tier should be a series of 2 numbers [lower bound, upper bound]. Each
 *  bound signifies the minimum height of element of that tier and the maximum
 *  heigh respectively. Example:
 *  tier = [ [0, 1],
 *           [2, 8],
 *           [3, 6],
 *           [5, 10],
 *           [0, 100] ];
 *  keep in mind the tiers will be considered in order [1, 2, 3, 4, 5]
 */
// layers is a dictionary of elements and their corresponding tiers
// tiers will be the bounds set by the user
function WorldMatrix(layers, layersTiers, tiers, tilePosition, tileSize) {
  this.mMatrix = [];

  this.mLayers = layers;
  this.mLayersTiers = layersTiers;
  this.mTiers = tiers;

  this.mTilePosition = tilePosition;
  this.mTileSize = tileSize;

}

WorldMatrix.prototype.getMatrix = function() { return this.mMatrix; };
WorldMatrix.prototype.setMatrix = function(matrix) { this.mMatrix = matrix; };

WorldMatrix.prototype.getLayers = function() { return this.mLayers; };
WorldMatrix.prototype.setLayers = function(layers) { this.mLayers = layers; };

WorldMatrix.prototype.getLayersTiers = function() { return this.mLayersTiers; };
WorldMatrix.prototype.setLayersTiers = function(layersTiers) { this.mLayersTiers = layersTiers; };

WorldMatrix.prototype.getTiers = function() { return this.mTiers; };
WorldMatrix.prototype.setTiers = function(tiers) { this.mTiers = tiers; };


// draw the world matrix, element by element, to the canvas
WorldMatrix.prototype.draw = function (cam)
{
  for (var x = 0; x < this.mMatrix.length; x++)
  {
    for (var y = 0; y < this.mMatrix[x].length; y++)
    {
      if (this.mMatrix[x][y] !== "test")
      {
        this.mMatrix[x][y].getTexture().draw(cam);
      }
    }

  }
};

// will randomize the order of the layers
WorldMatrix.prototype.randomizeLayers = function ()
{
  var output = [];
  var output2 = [];

  while (this.mLayers.length !== 0)
  {
    var index = Math.floor(Math.random()*this.mLayers.length);
    output.push(this.mLayers[index]);
    output2.push(this.mLayersTiers[index]);
    this.mLayers.splice(index, 1);
    this.mLayersTiers.splice(index, 1);
  }

  this.mLayers = output;
  this.mLayersTiers = output2;
};

// NOT CURRENTLY IMPLEMENTED WITH SEEDING IN MIND
// will pseudo randomly decide how to order the backdrop to
// the world. The user will later be able to modify the world
//
// User will pass in how many columns we will render
WorldMatrix.prototype.generateWorld = function (numOfColumns)
{
  var startingX = this.mTilePosition[0];
  var startingY = this.mTilePosition[1];
  // in each column we will initialize the elements bottom up
  for (var x = 0; x < numOfColumns; x++)
  {
    var col = [];
    // for each layer we will add a random amount of
    // elements, as dictated by the tier list, into col
    for (var y = 0; y < this.mLayers.length; y++)
    {
      var lowerBound = this.mTiers[this.mLayersTiers[y]][0];
      var upperBound = this.mTiers[this.mLayersTiers[y]][1];
      // what if upper bound and lower bound are the same???
      var num = Math.floor(Math.random()*(upperBound + 1 - lowerBound)) + lowerBound;
      // adding num number of tile objects into the column
      for (var z = 0; z < num; z++)
      {
        // if we reached the limit of items to render vertically
        if (z > numOfColumns)
        {
          this.mTilePosition = [this.mTilePosition[0] + this.mTileSize[0], startingY];
          break;
        }
        var tile = new Tile(this.mLayers[y], this.mTilePosition, this.mTileSize);
        this.mTilePosition[1] += this.mTileSize[1];
        col.push(tile);
      }
    }

    this.mTilePosition = [this.mTilePosition[0] + this.mTileSize[0], startingY];
    this.mMatrix.push(col);
  }
};

// will either add a tile or delete a tile if 2 adjacent columns are
// more than 1 block apart in height
WorldMatrix.prototype.smoothTerrain = function ()
{
  // go through, column by column
  for (var r = 0; r < this.mMatrix.length - 1; r++)
  {
    var len1 = this.mMatrix[r].length;
    var len2 = this.mMatrix[r + 1].length;
    var check = Math.floor(Math.random()*2);


    if (len1 > len2 + 1)
    {
      var holder = this.mMatrix[r + 1][this.mMatrix[r + 1].length - 1].getTexture().getXform();
      var pos = [holder.getXPos(), holder.getYPos() + this.mTileSize[1]];
      var tile = new Tile(this.mLayers[this.mLayers.length - 1], pos, this.mTileSize);

      if (check === 1)
      {
        this.mMatrix[r + 1].push(tile);
      }else
      {
        this.mMatrix[r].splice(this.mMatrix[r].length - 1, 1);
      }
    }else if (len1 + 1 < len2)
    {
      var holder = this.mMatrix[r][this.mMatrix[r].length - 1].getTexture().getXform();
      var pos = [holder.getXPos(), holder.getYPos() + this.mTileSize[1]];
      var tile = new Tile(this.mLayers[this.mLayers.length - 1], pos, this.mTileSize);

      if (check === 1)
      {
        this.mMatrix[r].push(tile);
      }else
      {
        this.mMatrix[r+1].splice(this.mMatrix[r+1].length - 1, 1);
      }
    }
  }
};
