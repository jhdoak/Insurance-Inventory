var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  brand:          { type: String },
  itemModel:      { type: String },
  serial:         { type: String },
  category:       { type: String },
  purchaseDate:   { type: String },
  pricePaid:      { type: String },
  estimatedValue: { type: String },
  otherNotes:     { type: String },
  picture:        { type: String },
  receipt:        { type: String },
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

ItemSchema.methods.getCreatedAt = function() {
  return date2String(this.createdAt);
};

ItemSchema.methods.getUpdatedAt = function() {
  return date2String(this.updatedAt);
};

module.exports = mongoose.model('Item', ItemSchema);
