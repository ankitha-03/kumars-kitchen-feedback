const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  tableId:   { type: String, required: true },
  dishId:    { type: String, required: true },
  dishName:  String,
  category:  { type: String, enum: ['Hygiene','Taste','Service','Pricing'] },
  comment:   String,
  rating:    { type: Number, min: 1, max: 5 },
  sentiment: { type: String, enum: ['Positive','Neutral','Negative'] },
  imageUrl:  String,
  status:    { type: String, enum: ['Open','Under Review','Resolved'], default: 'Open' },
  // Anonymous browser token — no personal data stored
  deviceToken: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
