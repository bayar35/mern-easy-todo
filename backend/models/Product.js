const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: 'https://unsplash.com' }, // Жишээ гутлын зураг
  description: { type: String, default: 'Маш чанартай, шинэ бараа.' }
});

module.exports = mongoose.model('Product', ProductSchema);
