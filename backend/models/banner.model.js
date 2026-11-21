const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    subtitle: { type: String, default: '' },
    buttonText: { type: String, default: 'Khám phá ngay →' },
    link: { type: String, default: '/products' },
    order: { type: Number, default: 0 },
    createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
