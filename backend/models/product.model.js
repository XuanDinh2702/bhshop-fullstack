const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: String, required: true },
    priceNumber: { type: Number, default: 0 },
    oldPrice: { type: String, default: '-' },
    image: { type: String, required: true },
    discount: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    categoryId: { type: Number, required: true },
    categorySlug: { type: String, default: '' },
    description: { type: String, default: '' },
    badge: { type: String, default: '' },
    badgeClass: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
