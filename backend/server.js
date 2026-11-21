require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Khởi tạo app Express
const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình Middleware
app.use(cors()); // Cho phép kết nối xuyên nguồn từ Angular (port 4200)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối cơ sở dữ liệu MongoDB
connectDB();

// Đăng ký các Routes
app.use('/api/home', require('./routes/home.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/blogs', require('./routes/blog.routes'));
app.use('/api/banners', require('./routes/banner.routes'));

// Endpoint kiểm tra server
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '🎉 BHShop API Server đang chạy ổn định!',
    author: 'Sinh viên FPT Polytechnic',
    endpoints: {
      home: 'GET /api/home (Trang chủ gom 3 banner, 4 hoa mới, 4 sale, 4 bán chạy, 3 bài viết)',
      categories: 'GET /api/categories',
      categoryBySlug: 'GET /api/categories/:slug',
      products: 'GET /api/products (?categorySlug=...&sort=...&search=...&limit=...)',
      productBySlug: 'GET /api/products/:slug',
      blogs: 'GET /api/blogs',
      blogBySlug: 'GET /api/blogs/:slug',
      banners: 'GET /api/banners'
    }
  });
});

// Xử lý lỗi 404 cho API không tồn tại
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint không tồn tại' });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Server Backend đang chạy tại: http://localhost:${PORT}`);
  console.log(`📌 API Trang chủ: http://localhost:${PORT}/api/home`);
  console.log(`📌 API Sản phẩm:  http://localhost:${PORT}/api/products`);
  console.log(`📌 API Danh mục:  http://localhost:${PORT}/api/categories`);
  console.log(`📌 API Bài viết:  http://localhost:${PORT}/api/blogs`);
  console.log(`===============================================`);
});
