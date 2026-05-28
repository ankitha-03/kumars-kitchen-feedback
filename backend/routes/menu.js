const router = require('express').Router();
const Dish = require('../models/Dish');

// GET all dishes
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find();
    console.log(dishes);
    res.json(dishes);   // always returns an array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;