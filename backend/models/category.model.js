const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    icon: { type: String, default: '🌸' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
