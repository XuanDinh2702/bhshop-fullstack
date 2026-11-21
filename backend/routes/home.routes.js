const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');

// GET /api/home (API tổng hợp trang chủ)
router.get('/', homeController.getHomeData);

module.exports = router;
