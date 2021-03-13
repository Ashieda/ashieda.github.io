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

  // Starting tile position [xWC, yWC]
  this.mTilePosition = tilePosition;
  this.mLowerLeftPosX = tilePosition[0] - tileSize[0]/2;
  this.mLowerLeftPosY = tilePosition[1] - tileSize[1]/2;
  this.mTileSize = tileSize;

  this.seedGenerator = new MersenneTwister();
}

WorldMatrix.prototype.getMatrix = function() { return this.mMatrix; };
WorldMatrix.prototype.setMatrix = function(matrix) { this.mMatrix = matrix; };

WorldMatrix.prototype.getLayers = function() { return this.mLayers; };
WorldMatrix.prototype.setLayers = function(layers) { this.mLayers = layers; };

WorldMatrix.prototype.getLayersTiers = function() { return this.mLayersTiers; };
WorldMatrix.prototype.setLayersTiers = function(layersTiers) { this.mLayersTiers = layersTiers; };

WorldMatrix.prototype.getTiers = function() { return this.mTiers; };
WorldMatrix.prototype.setTiers = function(tiers) { this.mTiers = tiers; };

WorldMatrix.prototype.setSeed = function(seed) { this.seedGenerator = new MersenneTwister(seed); };


// draw the world matrix, element by element, to the canvas
WorldMatrix.prototype.draw = function (cam, indexX1, indexY1, indexX2, indexY2)
{
  for (var x = indexX1; x < indexX2; x++)
  {
    if (this.mMatrix.length < x)
      break;

    for (var y = indexY1; y < indexY2; y++)
    {
      if (this.mMatrix[x].length < y)
        break;

      if (this.mMatrix[x][y] !== null && this.mMatrix[x][y] !== undefined)
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
    // var index = Math.floor(Math.random()*this.mLayers.length);
    var index = Math.floor(this.seedGenerator.random()*this.mLayers.length);
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
WorldMatrix.prototype.generateWorld = function (numOfColumns, height)
{
  var startingX = this.mTilePosition[0];
  var startingY = this.mTilePosition[1];
  var startingHeight = Math.floor(height);
  height = startingHeight;

  // in each column we will initialize the elements bottom up
  for (var x = 0; x < numOfColumns; x++)
  {
    var col = [];
    // for each layer we will add a random amount of
    // elements, as dictated by the tier list, into col
    height = startingHeight;
    for (var y = 0; y < this.mLayers.length; y++)
    {
      var lowerBound = this.mTiers[this.mLayersTiers[y]][0];
      var upperBound = this.mTiers[this.mLayersTiers[y]][1];
      // what if upper bound and lower bound are the same???
      // var num = Math.floor(Math.random()*(upperBound + 1 - lowerBound)) + lowerBound;
      var num = Math.floor(this.seedGenerator.random()*(upperBound + 1 - lowerBound)) + lowerBound;
      // adding num number of tile objects into the column
      var z = 0;
      for (z = 0; z < num; z++)
      {
        // if we reached the limit of items to render vertically
        if (height <= 0)
        {
          break;
        }
        var tile = new Tile(this.mLayers[y], this.mTilePosition, this.mTileSize);
        this.mTilePosition[1] += this.mTileSize[1];
        col.push(tile);
        height--;
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
    // var check = Math.floor(Math.random()*2);
    var check = Math.floor(this.seedGenerator.random()*2);

    if (len1 > len2 + 1)
    {
      var holder = this.mMatrix[r + 1][this.mMatrix[r + 1].length - 1].getTexture().getXform();
      var pos = [holder.getXPos(), holder.getYPos() + this.mTileSize[1]];
      var tile = new Tile(this.mLayers[this.mLayers.length - 1], pos, this.mTileSize);

      if (check === 1)
      {
        this.mMatrix[r + 1].push(tile);
      } else
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

//Attempts to create empty pockets in terrain, starting from the parameter tile
//Offers a horizontal and vertical clear chance to determine likelihood of neighbors
//getting emptied as well
WorldMatrix.prototype.emptySpace = function(tile, horizClearChance, vertClearChance){
    if(tile.getTexture() === null)
        return;
    tile.setTexture(null);

    // var topRandom = Math.random();
    // var botRandom = Math.random();
    // var leftRandom = Math.random();
    // var rightRandom = Math.random();

    var topRandom = this.seedGenerator.random();
    var botRandom = this.seedGenerator.random();
    var leftRandom = this.seedGenerator.random();
    var rightRandom = this.seedGenerator.random();

    if(tile.topNeighbor !== null && topRandom < vertClearChance)
        this.emptySpace(tile.topNeighbor, vertClearChance);
    if(tile.botNeighbor !== null && botRandom < vertClearChance)
        this.emptySpace(tile.botNeighbor, vertClearChance);
    if(tile.leftNeighbor !== null && leftRandom < horizClearChance)
        this.emptySpace(tile.leftNeighbor, horizClearChance);
    if(tile.rightNeighbor !== null && rightRandom < horizClearChance)
        this.emptySpace(tile.rightNeighbor, horizClearChance);
};

// == NOT TESTED ==
//Updates the neighbor tiles of a tile at a given column & row index
WorldMatrix.prototype.updateNeighbors = function(tileColIndex, tileRowIndex){
    //Error check indeces
    if(tileColIndex < 0 || tileColIndex > this.mMatrix.length - 1)
        return;
    else if(tileRowIndex < 0 || tileRowIndex > this.mMatrix[tileColIndex].length - 1)
        return;

    var targetTile = this.mMatrix[tileColIndex][tileRowIndex];

    //Update the upper neighbor
    //Requires the existence of higher tiles in this column
    if(tileRowIndex + 1 < this.mMatrix[tileColIndex].length &&
    tileColIndex)
        targetTile.setTopNeighbor(this.mMatrix[tileColIndex][tileRowIndex + 1]);

    //Update the bottom neighbor
    //Requires bottom neighbor to be at the lowest row or higher
    if(tileRowIndex - 1 > -1)
        targetTile.setBotNeighbor(this.mMatrix[tileColIndex][tileRowIndex - 1]);

    //Update the left neighbor
    //Requires potential left neighbor to be in a valid column and at valid height
    if(tileColIndex - 1 > -1 &&
    this.mMatrix[tileColIndex - 1].length >= this.mMatrix[tileColIndex].length)
        targetTile.setLeftNeighbor(this.mMatrix[tileColIndex - 1][tileRowIndex]);

    //Update the right neighbor
    //Requires the potential right neighbor to be in a valid column and at a valid height
    if(tileColIndex + 1 < this.mMatrix.length &&
    this.mMatrix[tileColIndex + 1].length >= this.mMatrix[tileColIndex].length)
        targetTile.setRightNeighbor(this.mMatrix[tileColIndex + 1][tileRowIndex]);
};

// Gets/returns a tile based on world coordinates
WorldMatrix.prototype.getTile = function(xPos, yPos) {
    var tempX = Math.floor((xPos - this.mLowerLeftPosX)/this.mTileSize[0]);
    var tempY = Math.floor((yPos - this.mLowerLeftPosY)/this.mTileSize[1]);
    if (tempX < this.mMatrix.length && tempY < this.mMatrix[tempX].length)
    {
        return this.mMatrix[tempX][tempY];
    }

    return null;
};

WorldMatrix.prototype.insertStructure = function(xRange, yRange, percent, struct) {
  var added = false;
  // for all applicable x values
  for (var x = 0; x <= xRange[1]; x++) {
    // for all applicable y values
    for (var y = 0; y <= yRange[1]; y++) {
      if (this.seedGenerator.random() < percent/100) {
        // go element by element through the struct
        for (var u = 0; u < struct.length; u++) {
          for (var t = 0; t < struct[u].length; t++) {
            if (xRange[0] + u < this.mMatrix.length && yRange[0] + t < this.mMatrix.length) {
              var xP = this.mMatrix[xRange[0] + u][yRange[0] + t].getTexture().getXform().getXPos();
              var yP = this.mMatrix[xRange[0] + u][yRange[0] + t].getTexture().getXform().getYPos();
              struct[u][t].getTexture().getXform().setXPos(xP);
              struct[u][t].getTexture().getXform().setYPos(yP);
              this.mMatrix[xRange[0] + u][yRange[0] + t] = struct[u][t];
            }
          }
        }
        x += struct.length;
        added = true;
        return;
      }
    }
  }
}

// ################## PRESETS ##################
WorldMatrix.prototype.presetHills = function (xStart, xEnd, variance) {
  var height = this.mMatrix[xStart].length;
  var vari = variance;
  for (var x = xStart; x <= xEnd; x++) {
    while (this.mMatrix[x].length > height) {
      this.mMatrix[x].splice(this.mMatrix[x].length - 1, 1);
    }

    while (this.mMatrix[x].length < height) {
      var tilePos = [
        this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getXPos(),
        this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getYPos() + this.mTileSize[1]
      ];
      var tile = new Tile(this.mLayers[this.mLayers.length - 1], tilePos, this.mTileSize);
      this.mMatrix[x].push(tile);
    }


    if (variance > 0) {
      if (Math.floor(this.seedGenerator.random()*2) > 0) {
        var tilePos = [
          this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getXPos(),
          this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getYPos() + this.mTileSize[1]
        ];
        var tile = new Tile(this.mLayers[this.mLayers.length - 1], tilePos, this.mTileSize);
        this.mMatrix[x].push(tile);
        variance--;
        height++;

        if (variance === 0)
          variance = -vari;
      }
    }else if (variance < 0) {
      if (Math.floor(this.seedGenerator.random()*2) > 0) {
        this.mMatrix[x].splice(this.mMatrix.length - 1, 1);
        variance++;
        height--;

        if (variance === 0)
          variance = vari;
      }
    }
  }
};

// ################## PRESETS ##################
WorldMatrix.prototype.presetPlains = function (xStart, xEnd, variance) {
  var height = this.mMatrix[xStart].length;
  var vari = variance;
  for (var x = xStart; x <= xEnd; x++) {
    while (this.mMatrix[x].length > height) {
      this.mMatrix[x].splice(this.mMatrix[x].length - 1, 1);
    }

    while (this.mMatrix[x].length < height) {
      var tilePos = [
        this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getXPos(),
        this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getYPos() + this.mTileSize[1]
      ];
      var tile = new Tile(this.mLayers[this.mLayers.length - 1], tilePos, this.mTileSize);
      this.mMatrix[x].push(tile);
    }
    variance--;

    if (variance <= 0) {
      variance = vari;
      var amount = Math.floor(this.seedGenerator.random()*2) - 1;
      if (amount === 0) {
        var tilePos = [
          this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getXPos(),
          this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getYPos() + this.mTileSize[1]
        ];
        var tile = new Tile(this.mLayers[this.mLayers.length - 1], tilePos, this.mTileSize);
        this.mMatrix[x].push(tile);
        height++;
      }else {
        this.mMatrix[x].splice(this.mMatrix.length - 1, 1);
        height--;
      }
    }
  }
};

WorldMatrix.prototype.presetMountains = function (xStart, xEnd, variance, incr) {

  var height = this.mMatrix[xStart].length;
  var vari = variance;
  for (var x = xStart; x <= xEnd; x++) {
    while (this.mMatrix[x].length > height) {
      this.mMatrix[x].splice(this.mMatrix[x].length - 1, 1);
    }

    while (this.mMatrix[x].length < height) {
      var tilePos = [
        this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getXPos(),
        this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getYPos() + this.mTileSize[1]
      ];
      var tile = new Tile(this.mLayers[this.mLayers.length - 1], tilePos, this.mTileSize);
      this.mMatrix[x].push(tile);
    }


    if (variance > 0) {
      var amount = Math.floor(this.seedGenerator.random()*incr) + 2;
      if (amount > 0) {
        for (var t = 0; t <= amount; t++) {
          var tilePos = [
            this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getXPos(),
            this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getYPos() + this.mTileSize[1]
          ];
          var tile = new Tile(this.mLayers[this.mLayers.length - 1], tilePos, this.mTileSize);
          this.mMatrix[x].push(tile);
          variance--;
          height++;

          if (variance === 0) {
            variance = -vari;
            break;
          }
        }
      }
    }else if (variance < 0) {
      var amount = Math.floor(this.seedGenerator.random()*incr) + 2;
      if (amount > 0) {
        for (var t = 0; t <= amount; t++) {
          this.mMatrix[x].splice(this.mMatrix.length - 1, 1);
          variance++;
          height--;

          if (variance === 0) {
            variance = vari;
            if (x + variance * 1.5 < xEnd) {
              this.presetHills(x, x + variance * 1.5, 3);
            }else {
              this.presetHills(x, xEnd, 3);
            }
            x += variance * 1.5;
            break;
          }
        }
      }
    }
  }
};



WorldMatrix.prototype.presetPlateau = function (xStart, xEnd, variance, incr) {

  var height = this.mMatrix[xStart].length;
  var vari = variance;
  for (var x = xStart; x <= xEnd; x++) {
    while (this.mMatrix[x].length > height) {
      this.mMatrix[x].splice(this.mMatrix[x].length - 1, 1);
    }

    while (this.mMatrix[x].length < height) {
      var tilePos = [
        this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getXPos(),
        this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getYPos() + this.mTileSize[1]
      ];
      var tile = new Tile(this.mLayers[this.mLayers.length - 1], tilePos, this.mTileSize);
      this.mMatrix[x].push(tile);
    }


    if (variance > 0) {
      var amount = Math.floor(this.seedGenerator.random()*incr) + 2;
      if (amount > 0) {
        for (var t = 0; t <= amount; t++) {
          var tilePos = [
            this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getXPos(),
            this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getYPos() + this.mTileSize[1]
          ];
          var tile = new Tile(this.mLayers[this.mLayers.length - 1], tilePos, this.mTileSize);
          this.mMatrix[x].push(tile);
          variance--;
          height++;

          if (variance === 0) {
            variance = vari;
            if (x + variance * 1.5 < xEnd) {
              this.presetPlains(x, x + variance * 1.5, variance);
            }else {
              this.presetPlains(x, xEnd, xEnd - x);
            }
            x += variance * 1.5;
            variance = -vari;
            break;
          }
        }
      }
    }else if (variance < 0) {
      var amount = Math.floor(this.seedGenerator.random()*incr) + 2;
      if (amount > 0) {
        for (var t = 0; t <= amount; t++) {
          this.mMatrix[x].splice(this.mMatrix.length - 1, 1);
          variance++;
          height--;

          if (variance === 0) {
            variance = vari;
            if (x + variance * 1.5 < xEnd) {
              this.presetHills(x, x + variance * 1.5, 3);
            }else {
              this.presetHills(x, xEnd, 3);
            }
            x += variance * 1.5;
            break;
          }
        }
      }
    }
  }
};


WorldMatrix.prototype.presetValleys = function (xStart, xEnd, variance) {
  var height = this.mMatrix[xStart].length;
  var vari = variance;
  for (var x = xStart; x <= xEnd; x++) {
    while (this.mMatrix[x].length > height) {
      this.mMatrix[x].splice(this.mMatrix[x].length - 1, 1);
    }

    while (this.mMatrix[x].length < height) {
      var tilePos = [
        this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getXPos(),
        this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getYPos() + this.mTileSize[1]
      ];
      var tile = new Tile(this.mLayers[this.mLayers.length - 1], tilePos, this.mTileSize);
      this.mMatrix[x].push(tile);
    }


    if (variance < 0) {
      var amount = Math.floor(this.seedGenerator.random()*3);
      if (amount > 0) {
        for (var t = 0; t <= amount; t++) {
          var tilePos = [
            this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getXPos(),
            this.mMatrix[x][this.mMatrix[x].length - 1].getTexture().getXform().getYPos() + this.mTileSize[1]
          ];
          var tile = new Tile(this.mLayers[this.mLayers.length - 1], tilePos, this.mTileSize);
          this.mMatrix[x].push(tile);
          variance++;
          height++;

          if (variance === 0) {
            variance = vari;
            // x++;
            break;
          }
        }
      }
    }else if (variance > 0) {
      var amount = Math.floor(this.seedGenerator.random()*3) - 1;
      if (amount > 0) {
        for (var t = 0; t <= amount; t++) {
          this.mMatrix[x].splice(this.mMatrix.length - 1, 1);
          variance--;
          height--;

          if (variance === 0) {
            variance = vari;
            if (x + variance * 1.5 < xEnd) {
              this.presetHills(x, x + variance * 1.5, 3);
            }else {
              this.presetHills(x, xEnd, 3);
            }
            x += variance * 1.5;
            variance = -vari;
            break;
          }
        }
      }
    }
  }
};
