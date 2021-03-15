"use strict";

function UserStruct(struct) {
  this.mUserStruct = struct;
  this.mSeedGenerator = new MersenneTwister();
  this.mSeed = null;
}

UserStruct.prototype.getStruct = function() { return this.mUserStruct; };
UserStruct.prototype.setStruct = function(struct) { this.mUserStruct = struct; };
UserStruct.prototype.getSeed = function() { return this.mSeed; };
UserStruct.prototype.setSeed = function(seed) {
  this.mSeedGenerator = new MersenneTwister(seed);
  this.mSeed = seed;
};

// Updated Add Noise (Tested but not extensively)
UserStruct.prototype.addNoise = function(min, variance) {
  for (var x = 0; x < this.mUserStruct.length; x++) {
    console.log(this.mUserStruct);
    var amount = Math.floor(this.mSeedGenerator.random()*variance + min);
    var location = Math.floor(this.mSeedGenerator.random()*3); // 0 = Bot, 1 = Top, 2 = Skip
    var addOrSub = Math.floor(this.mSeedGenerator.random()*2); // 0 = Add, 1 = Sub
    console.log("Amount : " + amount + " | location : " + location + " | addOrSub : " + addOrSub);

    // first non null value
    var botIndex = -1;
    var topIndex = -1;
    var topObj = null;
    var botObj = null;
    var check = false;
    for (var y = 0; y < this.mUserStruct[x].length; y++) {
      if (this.mUserStruct[x][y] !== null) {
        check = true;
        topIndex = y;
        topObj = this.mUserStruct[x][y];
      }
    }

    for (var y = this.mUserStruct[x].length - 1; y >= 0; y--) {
      if (this.mUserStruct[x][y] !== null) {
        check = true;
        botIndex = y;
        botObj = this.mUserStruct[x][y];
      }
    }
    console.log("Bot Index is " + botIndex);
    // console.log(botObj);
    console.log("Top Index is " + topIndex);
    // console.log(topObj);


    // add case
    if (addOrSub === 0)
    {
      // bot case
      if (location === 0) {
        console.log("ADD BOT");
        // Something is wrong in here
        for (var t = 0; t < amount; t++)
          this.mUserStruct[x].splice(botIndex, 0, botObj);

        // What is this used for? Why Null? Insert empty space at bottom?
        // for (var x1 = 0; x1 < this.mUserStruct[x].length; x1++) {
        //   for (var t = 0; t < amount; t++)
        //     this.mUserStruct[x].splice(botIndex, 0, null);
        // }
      // top case
      }else if (location === 1) {
        console.log("ADD TOP");
        for (var t = 0; t < amount; t++)
          this.mUserStruct[x].splice(topIndex, 0, topObj);
      }else {
        console.log("SKIP ADD");
      }
    // sub case
    } else {
      if (amount > this.mUserStruct[x].length) {
        this.mUserStruct[x] = [null];
        break;
      }
      // bot case
      if (location === 0) {
        console.log("SUB BOT");
        for (var u = 0; u < amount; u++)
          this.mUserStruct[x][botIndex + u] = null;
        // this.mUserStruct[x].splice(botIndex, amount);
      // top case
      }else if (location === 1) {
        console.log("SUB TOP");
        for (var u = 0; u < amount; u++)
          this.mUserStruct[x][topIndex - u] = null;
        // this.mUserStruct[x].splice(topIndex, amount);
      // no change
      }else {
        console.log("SKIP SUB");
      }
    }
  }
};

// clean the bottom rows
// ############### NOT TESTED ###############
UserStruct.prototype.cleanStruct = function() {
  check = true;
  while (check) {
    for (var x = 0; x < this.mUserStruct.length; x++) {
      if (this.mUserStruct[x][0] !== null) {
        check = false;
        break;
      }
    }

    if (check === true) {
      for (var x = 0; x < this.mUserStruct.length; x++) {
        this.mUserStruct[x].splice(0, 1);
      }
    }
  }
};
