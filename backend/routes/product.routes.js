const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// GET /api/products?categorySlug=...&search=...&sort=...&limit=...
router.get('/', productController.getProducts);

// GET /api/products/id/:id (nếu gọi theo id)
router.get('/id/:id', productController.getProductById);

// GET /api/products/:slug (gọi theo slug chuẩn SEO)
router.get('/:slug', productController.getProductBySlug);

module.exports = router;
