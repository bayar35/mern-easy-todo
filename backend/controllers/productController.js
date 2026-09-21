const Product = require('../models/Product');

// Бүх бүтээгдэхүүн авах (search + filter)
exports.getProducts = async (req, res) => {
  try {
    const { search, minPrice, maxPrice } = req.query;
    const filter = {};

    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let products = await Product.find(filter);

    // Seed — хэрэв хоосон бол
    if (products.length === 0 && !search && !minPrice && !maxPrice) {
      const sampleProducts = [
        {
          name: 'Спортын Пүүз',
          price: 150000,
          image:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
          description: 'Маш чанартай, шинэ бараа. Хөнгөн, эвтэйхэн.',
        },
        {
          name: 'Ухаалаг Цар',
          price: 280000,
          image:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
          description: 'Ухаалаг цаг — алхам, зүрхний цохилт хэмждэг.',
        },
        {
          name: 'Чихэвч (Wireless)',
          price: 95000,
          image:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
          description: 'Wireless чихэвч — 20 цаг тогтоно.',
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

// ✨ ШИНЭ: Нэг бүтээгдэхүүн авах (detail)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Бүтээгдэхүүн олдсонгүй' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};