const mongoose = require('mongoose');
module.exports = mongoose.model('Match', 
{ 
  timestamp: {type:Date, required: true}, 
  homeId: {type:mongoose.Types.ObjectId,  required: true}, 
  homeScore: {type:Number, required: true}, 
  awayId: {type:mongoose.Types.ObjectId, required: true}, 
  awayScore: {type:Number, required: true}, 
  rated: {type: Boolean, default: false},
});