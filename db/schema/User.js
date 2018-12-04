const mongoose = require('mongoose');
module.exports = mongoose.model('User', { 
  name: String, 
  rating: {type:Number, default: 1500}, 
  uncertainty: {type: Number, default: 350},
  lastGame: {type: Date, default: new Date()},
  rank: Number, 
  matches: [
    {
      userScore: Number,
      opponentScore: Number,
      timestamp: Date
    }
  ]
});