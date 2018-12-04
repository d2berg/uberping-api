const config = require('../config');
const mongoose = require('mongoose');
mongoose.connect(config.MONGODB_URI);

const User = require('./schema/User');
const Match = require('./schema/Match');

module.exports = {
  User,
  Match
}