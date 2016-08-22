var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  brand:          { type: String },
  model:          { type: String },
  serial:         { type: String },
  category:       { type: String, required: true },
  purchaseDate:   { type: String },
  pricePaid:      { type: String },
  estimatedValue: { type: String },
  details:        { type: String },
  picture:        { type: String },
  receipt:        { type: String },
  home:           { type: mongoose.Schema.ObjectId, ref: 'Home' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', ItemSchema);
