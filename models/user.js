var mongoose = require('mongoose');
var Home     = require('./home');

var UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },
  homes:    [Home.schema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
