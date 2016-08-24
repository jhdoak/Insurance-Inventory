var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Home     = require('./home');

var UserSchema = new mongoose.Schema({
  local: {
    email:    { type: String, required: true },
    password: { type: String, required: true }
  },
  homes:    [Home.schema]
  },
  { timestamps: true }
);

function date2String(date) {
  var options = {
    weekday: 'long', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

UserSchema.methods.getCreatedAt = function() {
  return date2String(this.createdAt);
};

UserSchema.methods.getUpdatedAt = function() {
  return date2String(this.updatedAt);
};

UserSchema.methods.encrypt = function(password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

UserSchema.methods.isValidPassword = function(password) {
 return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
