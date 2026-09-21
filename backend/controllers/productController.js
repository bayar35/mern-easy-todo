const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    let products = await Product.find();

    if (products.length === 0) {
      const sampleProducts = [
        {
          name: 'Спортын Пүүз',
          price: 150000,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
          description: 'Маш чанартай, шинэ бараа.',
        },
        {
          name: 'Ухаалаг Цар',
          price: 280000,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
          description: 'Маш чанартай, шинэ бараа.',
        },
        {
          name: 'Чихэвч (Wireless)',
          price: 95000,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
          description: 'Маш чанартай, шинэ бараа.',
        },
      ];
      products = await Product.insertMany(sampleProducts);
      console.log('✅ Жишээ бүтээгдэхүүнүүд нэмэгдлээ');
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};