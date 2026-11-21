const Banner = require('../models/banner.model');
const Product = require('../models/product.model');
const Blog = require('../models/blog.model');
const Category = require('../models/category.model');

// API tổng hợp dành riêng cho Trang chủ (*)
// Gom 3 banner mới nhất, sản phẩm mới, khuyến mãi, bán chạy và 3 bài viết mới
exports.getHomeData = async (req, res) => {
  try {
    const [banners, newProducts, saleProducts, bestSellers, categories, blogs] = await Promise.all([
      // 1. 3 banner mới nhất theo thứ tự
      Banner.find().sort({ order: 1 }).limit(3),

      // 2. 4 sản phẩm mới nhất (sắp xếp theo id giảm dần)
      Product.find().sort({ id: -1 }).limit(4),

      // 3. 4 sản phẩm khuyến mãi (discount > 0, sắp xếp theo % giảm dần)
      Product.find({ discount: { $gt: 0 } }).sort({ discount: -1 }).limit(4),

      // 4. 4 sản phẩm bán chạy nhất (sắp xếp theo lượt bán giảm dần)
      Product.find().sort({ sold: -1 }).limit(4),

      // 5. Danh mục hoa
      Category.find().sort({ order: 1 }),

      // 6. 3 bài viết cẩm nang mới nhất
      Blog.find().sort({ createdAt: -1 }).limit(3)
    ]);

    res.json({
      success: true,
      data: {
        banners,
        newProducts,
        saleProducts,
        bestSellers,
        categories,
        blogs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy dữ liệu trang chủ',
      error: error.message
    });
  }
};
