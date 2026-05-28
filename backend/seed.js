const mongoose = require('mongoose');
const Dish = require('./models/Dish');

mongoose.connect('mongodb://localhost:27017/restaurantFeedback');

const dishes = [

  // ── Breakfast ──
  {
    name: 'Lemon Rice',
    image: 'https://images.unsplash.com/photo-1733414717545-1d7031befbcf?w=400',
    category: 'Breakfast',
    price: 60
  },
  {
    name: 'Puri',
    image: 'https://images.unsplash.com/photo-1605719161691-5d9771fc144f?w=400',
    category: 'Breakfast',
    price: 50
  },
  {
    name: 'Aloo Parantha',
    image: 'https://images.unsplash.com/photo-1580064003296-29deb3521370?w=400',
    category: 'Breakfast',
    price: 50
  },
  {
    name: 'Roti and Sabzi',
    image: 'https://images.unsplash.com/photo-1712757248842-04f6e3844374?w=400',
    category: 'Breakfast',
    price: 40
  },
  {
    name: 'Roti and Egg Bhurji',
    image: 'https://images.unsplash.com/photo-1715194288597-cd4df523776e?w=400',
    category: 'Breakfast',
    price: 60
  },

  // ── Lunch ──
  {
    name: 'Meals (Roti, Rice, Papad, Achar, Sabzi, Daal)',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    category: 'Lunch',
    price: 100
  },

  // ── Chinese / Dinner ──
  {
    name: 'Veg Fried Rice',
    image: 'https://images.unsplash.com/photo-1664717698774-84f62382613b?w=400',
    category: 'Chinese',
    price: 60
  },
  {
    name: 'Egg Fried Rice',
    image: 'https://images.unsplash.com/photo-1609570324378-ec0c4c9b6ba8?w=400',
    category: 'Chinese',
    price: 70
  },
  {
    name: 'Chicken Fried Rice',
    image: 'https://images.unsplash.com/photo-1679735386220-e8888925676e?w=400',
    category: 'Chinese',
    price: 90
  },
  {
    name: 'Veg Noodles',
    image: 'https://images.unsplash.com/photo-1716535232835-6d56282dfe8a?w=400',
    category: 'Chinese',
    price: 60
  },
  {
    name: 'Egg Noodles',
    image: 'https://images.unsplash.com/photo-1592778024292-d6782d22add7?w=400',
    category: 'Chinese',
    price: 70
  },
  {
    name: 'Chicken Noodles',
    image: 'https://images.unsplash.com/photo-1758979690131-11e2aa0b142b?w=400',
    category: 'Chinese',
    price: 90
  },

  // ── Sides ──
  {
    name: 'Kabab',
    image: 'https://images.unsplash.com/photo-1736952332338-44dc07283462?w=400',
    category: 'Sides',
    price: 50
  },
  {
    name: 'Gobi Manchurian',
    image: 'https://images.unsplash.com/photo-1603662953903-733bc0c3e134?w=400',
    category: 'Sides',
    price: 80
  },
  {
    name: 'Chilli Chicken',
    image: 'https://images.unsplash.com/photo-1710508774177-7ac2f3492675?w=400',
    category: 'Sides',
    price: 120
  },

  // ── Drinks ──
  {
    name: 'Bisleri Water',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
    category: 'Drinks',
    price: 20
  },
  {
    name: 'Tea',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    category: 'Drinks',
    price: 7
  },
  {
    name: 'Coffee',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    category: 'Drinks',
    price: 10
  },
  {
    name: 'Lemon Tea',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    category: 'Drinks',
    price: 12
  },
  {
    name: 'Sprite',
    image: 'https://images.unsplash.com/photo-1680404005217-a441afdefe83?w=400',
    category: 'Drinks',
    price: 20
  },
  {
    name: 'Pepsi',
    image: 'https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?w=400',
    category: 'Drinks',
    price: 20
  },
  {
    name: 'Coke',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    category: 'Drinks',
    price: 20
  },

];

async function seed() {
  await Dish.deleteMany({});
  await Dish.insertMany(dishes);
  console.log(`✅ ${dishes.length} dishes inserted for Kumar's Kitchen!`);
  mongoose.disconnect();
}

seed();