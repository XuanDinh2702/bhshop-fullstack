const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, default: '' },
    content: { type: String, default: '' },
    image: { type: String, required: true },
    category: { type: String, default: 'Cẩm nang hoa' },
    author: { type: String, default: 'Florist BHShop' },
    createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
    readTime: { type: String, default: '3 phút đọc' },
    views: { type: Number, default: 0 },
    videoUrl: { type: String, default: '' },
    videoDuration: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
