const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bhshop';
    console.log(`Đang kết nối tới MongoDB: ${uri}...`);
    
    await mongoose.connect(uri);
    console.log('✅ Kết nối MongoDB thành công!');
    
    // Tự động seed dữ liệu mẫu nếu database trống
    const { autoSeedData } = require('../data/seed.data');
    await autoSeedData();
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error.message);
    console.log('💡 Lưu ý: Hãy đảm bảo service MongoDB đang chạy hoặc kiểm tra chuỗi kết nối trong .env');
  }
};

module.exports = connectDB;
