const mongoose = require('mongoose');

const WonBackSchema = new mongoose.Schema({
  deviceToken:    { type: String },
  previousDish:   { type: String },  // dish they complained about before
  returnDish:     { type: String },  // dish they liked this time
  previousRating: { type: Number },  // their old low rating
  returnRating:   { type: Number },  // their new high rating
  previousDate:   { type: Date },    // when they first complained
  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('WonBackEvent', WonBackSchema);
