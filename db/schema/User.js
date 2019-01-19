const mongoose = require('mongoose');
module.exports = mongoose.model('User', { 
  name: String, 
  rating: {type:Number, default: 1500}, 
  rd: {type: Number, default: 200},
  vol: {type: Number, default: 0.06},
  wins: {type: Number, default: 0},
  losses: {type: Number, default: 0},
  streak: {type: Number, default: 0},
  lastGame: {type: Date, default: new Date()},
  ratingTimestamp: {type: Date, default: new Date()},
  ratingHistory: [
    {
      rating: {type:Number, default: 1500}, 
      rd: {type: Number, default: 200},
      vol: {type: Number, default: 0.06},
      timestamp: Date
    }
  ]
});