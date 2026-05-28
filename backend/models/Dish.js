const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  image:    String,
  category: String,
  price:    Number
});

module.exports = mongoose.model('Dish', DishSchema);