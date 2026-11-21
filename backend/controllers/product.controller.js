const Product = require('../models/product.model');

// Lấy danh sách sản phẩm (có hỗ trợ lọc theo categorySlug, search, sort, limit)
exports.getProducts = async (req, res) => {
  try {
    const { categorySlug, search, sort, limit } = req.query;
    let query = {};

    // 1. Lọc theo danh mục slug
    if (categorySlug && categorySlug !== 'tat-ca') {
      query.categorySlug = categorySlug;
    }

    // 2. Mức Khá: Tìm kiếm thông minh theo tên, slug không dấu, và mô tả
    if (search && search.trim() !== '') {
      const term = search.trim();
      // Chuyển từ khóa sang dạng slug không dấu để tìm kiếm không dấu
      const slugTerm = term
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, '-');

      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { slug: { $regex: slugTerm, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } }
      ];
    }

    // 3. Sắp xếp
    let sortOption = { id: -1 }; // Mặc định mới nhất
    if (sort === 'bestseller') {
      sortOption = { sold: -1 };
    } else if (sort === 'sale') {
      sortOption = { discount: -1 };
    } else if (sort === 'newest') {
      sortOption = { id: -1 };
    } else if (sort === 'price-asc') {
      sortOption = { priceNumber: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { priceNumber: -1 };
    }

    let productsQuery = Product.find(query).sort(sortOption);

    // 4. Giới hạn số lượng (nếu có)
    if (limit && !isNaN(limit)) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }

    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm', error: error.message });
  }
};

// Lấy chi tiết sản phẩm theo Slug (chuẩn SEO)
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm với slug này' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy chi tiết sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ id: Number(id) });
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm với ID này' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
