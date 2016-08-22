var mongoose = require('mongoose');

var HomeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  address:     { type: String },
  residents:   { type: String },
  description: { type: String },
  photo:       { type: String },
  inventory:   [{ type: mongoose.Schema.ObjectId, ref: 'Item' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Home', HomeSchema);
