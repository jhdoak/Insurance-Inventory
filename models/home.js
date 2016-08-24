var mongoose = require('mongoose');
var Item     = require('./item');

var HomeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  address:     { type: String },
  residents:   { type: String },
  description: { type: String },
  photo:       { type: String },
  inventory:   [Item.schema]
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

HomeSchema.methods.getCreatedAt = function() {
  return date2String(this.createdAt);
};

HomeSchema.methods.getUpdatedAt = function() {
  return date2String(this.updatedAt);
};

module.exports = mongoose.model('Home', HomeSchema);
