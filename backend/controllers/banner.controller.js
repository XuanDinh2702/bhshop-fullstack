const Banner = require('../models/banner.model');

// Lấy danh sách banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy banners', error: error.message });
  }
};
