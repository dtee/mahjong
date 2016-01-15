'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ActionSchema =  new mongoose.Schema({
  actor: {type: String},
  actionType: {type: String},
  from: {type: String},
  isOrphan: {type: Boolean, default: false},
  bonus: {type: Number, default: 0}
});

var GameSchema = new mongoose.Schema({
  seats: {
    west: {type: String},
    east: {type: String},
    north: {type: String},
    south: {type: String}
  },
  actions: [ActionSchema],
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

export default mongoose.model('Game', GameSchema);
