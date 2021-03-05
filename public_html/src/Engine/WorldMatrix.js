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
function WorldMatrix(layers, tiers) {
  this.mMatrix = [];

  this.mLayers = [];
  this.mLayersTiers = [];
  for (var layer in layers)
  {
    this.mLayers.push(layers);
    this.mLayersTiers.push(layers[layer]);
  }

  this.mTiers = tiers;
}

WorldMatrix.prototype.getMatrix() { return this.mMatrix; };
WorldMatrix.prototype.setMatrix(matrix) { this.mMatrix = matrix; };

WorldMatrix.prototype.getLayers() { return this.mLayers; };
WorldMatrix.prototype.setLayers(layers) { this.mLayers = layers; };

WorldMatrix.prototype.getLayersTiers() { return this.mLayersTiers; };
WorldMatrix.prototype.setLayersTiers(layersTiers) { this.mLayersTiers = layersTiers; };

WorldMatrix.prototype.getTiers() { return this.mTiers; };
WorldMatrix.prototype.setTiers(tiers) { this.mTiers = tiers; };


// draw the world matrix, element by element, to the canvas
WorldMatrix.prototype.draw = function (cam)
{
  for (var x = 0; x < this.mMatrix.length; x++)
  {
    for (var y = 0; y < this.mMatrix[x].length; y++)
      this.mMatrix[x][y].draw(cam);
  }
};

// will randomize the order of the layers
WorldMatrix.prototype.randomizeLayers = function ()
{
  var output = [];
  var output2 = [];

  while (this.mLayers.length != 0)
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
  // in each column we will initialize the elements bottom up
  for (int x = 0; x < numOfColumns.length; x++)
  {
    var col = [];
    // for each layer we will add a random amount of
    // elements, as dictated by the tier list, into col
    for (int y = 0; y < this.mLayers.length; y++)
    {
      var lowerBound = this.mTiers[this.mLayersTiers[y]][0];
      var upperBound = this.mTiers[this.mLayersTiers[y]][1];
      // what if upper bound and lower bound are the same???
      var num = Math.floor(Math.random()*(upperBound - lowerBound)) + lowerBound;
      // adding num number of tile objects into the column
      for (var z = 0; z < num + 1; z++)
      {
        // if we reached the limit of items to render vertically
        if (z > numOfColumns.length)
          break;
        var tile = new Tile(this.mLayers[y]);
        col.push(tile);
      }
    }

    this.mMatrix.push(col)
  }
};
