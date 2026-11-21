// ==============================================================
// CẤU HÌNH ĐỊA CHỈ BACKEND API TOÀN HỆ THỐNG
// - Tự động nhận diện: Khi chạy máy local thì dùng localhost:5000
// - Khi lên Vercel: Tự động dùng link Render của bạn!
// ==============================================================

// 👉 BƯỚC QUAN TRỌNG: Sau khi tạo Web Service trên Render.com xong,
// hãy dán link Render của bạn vào biến RENDER_BACKEND_URL bên dưới (nhớ có /api ở cuối):
export const RENDER_BACKEND_URL = 'https://bhshop-backend-api.onrender.com/api';

const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
);

export const API_BASE_URL = isLocal 
  ? 'http://localhost:5000/api' 
  : RENDER_BACKEND_URL;
