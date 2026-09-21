const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  },
  description: {
    type: String,
    default: 'Маш чанартай, шинэ бараа.',
  },
});

module.exports = mongoose.model('Product', ProductSchema);