const Product = require('../models/Product');

// Бүх бүтээгдэхүүн авах
exports.getProducts = async (req, res) => {
  try {
    let products = await Product.find();

    // Хэрэв DB хоосон бол жишээ бүтээгдэхүүн үүсгэх
    if (products.length === 0) {
      const sampleProducts = [
        {
          name: 'Пүүз',
          price: 120000,
          image:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
          description: 'Маш чанартай пүүз',
        },
        {
          name: 'Цамц',
          price: 45000,
          image:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          description: 'Хөнгөн цамц',
        },
        {
          name: 'Малгай',
          price: 25000,
          image:
            'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
          description: 'Дулаан малгай',
        },
        {
          name: 'Цүнх',
          price: 85000,
          image:
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
          description: 'Аялалын цүнх',
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