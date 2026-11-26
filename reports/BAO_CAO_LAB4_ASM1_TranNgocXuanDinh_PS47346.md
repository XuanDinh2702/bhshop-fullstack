# BÁO CÁO THỰC HÀNH ANGULAR
**Nội dung:** Lab 4 và Assignment 1 (Giai đoạn 1)

---

### Thông tin sinh viên
* **Họ và tên:** Trần Ngọc Xuân Đình
* **MSSV:** PS47346
* **Lớp:** WD19301
* **Môn học:** WEB105 – Lập trình Front-end Framework 1
* **Giảng viên hướng dẫn:** ThS. Trần Bá Hộ
* **Ngày thực hiện:** 26-Thg11-26

---

# LAB 4: KẾT NỐI API VÀ HIỂN THỊ DỮ LIỆU ĐỘNG (FULLSTACK)

### 1. Mục tiêu
* Tìm hiểu kiến trúc Client - Server phân tách (Decoupled Architecture) giữa Angular và Node.js/Express.
* Xây dựng Backend RESTful API kết nối cơ sở dữ liệu MongoDB Atlas.
* Cấu hình CORS cho phép ứng dụng Frontend Angular kết nối dữ liệu xuyên nguồn.
* Sử dụng `HttpClient` trong Angular để gọi API từ Backend.
* Đổ dữ liệu động (Banner, Danh mục, Sản phẩm, Bài viết) lên giao diện trang chủ bằng Angular Signals và Control Flow (`@for`, `@if`).
* Thực hiện điều hướng trang động theo Slug chuẩn SEO (`/category/:slug` và `/product/:slug`).

---

### 2. Các chức năng thực hiện
| Thành phần / Chức năng | Mô tả chức năng (Chức năng gì) | Cách làm / Kỹ thuật thực hiện (Làm như thế nào) |
| :--- | :--- | :--- |
| **Backend RESTful API** | Khởi tạo máy chủ web cung cấp API trả lời dữ liệu định dạng JSON | Sử dụng Express.js, cấu hình `cors()`, lắng nghe cổng `5000` |
| **Cơ sở dữ liệu MongoDB Atlas** | Lưu trữ dữ liệu thực tế trên đám mây, bắt buộc có trường `slug` | Sử dụng Mongoose Schema định nghĩa 4 bảng (`categories`, `products`, `blogs`, `banners`), đánh chỉ mục `slug` unique |
| **API Trang chủ (`/api/home`)** | Gom dữ liệu trang chủ (3 banner, danh mục, 3 khối sản phẩm, bài viết) trong 1 request duy nhất | Sử dụng `Promise.all` truy vấn đồng thời 5 bảng từ MongoDB và trả về 1 object JSON |
| **HttpClient trong Angular** | Gửi yêu cầu HTTP GET từ Frontend Angular lên Backend API | Khai báo `provideHttpClient()` trong `app.config.ts`, `inject(HttpClient)` vào các Service |
| **Hiển thị dữ liệu Trang chủ** | Đổ dữ liệu từ API lên giao diện người dùng theo thời gian thực | `HomeService` gọi API, lưu dữ liệu vào Angular `signal()`, template dùng cú pháp `@for` để render |
| **Lọc sản phẩm theo Danh mục** | Hiển thị danh sách hoa tươi thuộc danh mục được chọn khi click | Cấu hình Route `/category/:slug`, Component đọc `paramMap.get('slug')`, gọi API lọc sản phẩm theo category slug |
| **Chi tiết sản phẩm theo Slug** | Hiển thị thông tin chi tiết của từng bó hoa theo đường dẫn thân thiện SEO | Cấu hình Route `/product/:slug`, đọc `slug` từ URL, gọi API chi tiết `/api/products/:slug` |

---

### 3. Các bước thực hiện
* **Bước 1: Khởi tạo Backend Express & Cài đặt thư viện**
  Chạy lệnh khởi tạo dự án Node.js và cài đặt các gói cần thiết:
  ```powershell
  cd backend
  npm init -y
  npm install express mongoose cors dotenv
  ```
* **Bước 2: Kết nối MongoDB Atlas và thiết kế Model có thuộc tính slug**
  Tạo kết nối Mongoose trong `config/db.js` và tạo các Schema (`Category`, `Product`, `Blog`, `Banner`), tất cả đều chứa trường `slug: { type: String, required: true, unique: true }`.
* **Bước 3: Xây dựng các Routes và Controller REST API**
  Tạo các endpoint:
  - `GET /api/home`: Gom toàn bộ dữ liệu trang chủ.
  - `GET /api/categories` và `GET /api/categories/:slug`: Lấy danh mục hoa.
  - `GET /api/products` và `GET /api/products/:slug`: Lấy danh sách và chi tiết hoa tươi.
  - `GET /api/blogs`: Lấy danh sách bài viết cắm hoa.
* **Bước 4: Cấu hình `provideHttpClient` trên Angular**
  Mở file `src/app/app.config.ts` và đăng ký:
  ```typescript
  import { provideHttpClient } from '@angular/common/http';
  export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideHttpClient()]
  };
  ```
* **Bước 5: Tạo các Service gọi API trong Angular**
  Sử dụng `HttpClient` để viết các hàm lấy dữ liệu:
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class HomeService {
    private http = inject(HttpClient);
    getHomeData() {
      return this.http.get<HomeDataResponse>('http://localhost:5000/api/home');
    }
  }
  ```
* **Bước 6: Tích hợp dữ liệu vào Component với Signals**
  Trong `home.component.ts`, gọi service và lưu vào Signal:
  ```typescript
  homeData = signal<HomeDataResponse | null>(null);
  ngOnInit() {
    this.homeService.getHomeData().subscribe(data => this.homeData.set(data));
  }
  ```
* **Bước 7: Cấu hình Router điều hướng theo Slug**
  Trong `app.routes.ts`:
  ```typescript
  export const routes: Routes = [
    { path: 'category/:slug', component: CategoryProductsComponent },
    { path: 'product/:slug', component: ProductDetailComponent }
  ];
  ```

---

### 4. Kết quả đạt được
* Khởi chạy thành công Backend Express API trên cổng 5000 kết nối trực tiếp với MongoDB Atlas.
* Thiết kế hoàn chỉnh 4 Collection: `categories`, `products`, `blogs`, `banners` đều có thuộc tính `slug` chuẩn SEO.
* Frontend Angular tải và hiển thị 100% dữ liệu động từ API, không còn sử dụng dữ liệu tĩnh (hardcoded).
* Chức năng lọc hoa theo danh mục slug và xem chi tiết sản phẩm theo slug hoạt động mượt mà chuẩn Single Page Application (SPA).

---

### 5. Hình ảnh minh chứng
* **Ảnh 1:** Terminal khởi chạy Server Backend báo kết nối MongoDB Atlas thành công và danh sách endpoint.
* **Ảnh 2:** Dữ liệu JSON trả về từ API `/api/home` trên trình duyệt web.
* **Ảnh 3:** Cấu trúc thư mục mã nguồn Backend và Frontend của dự án.
* **Ảnh 4:** Giao diện Trang chủ hiển thị đầy đủ Banner slider, Danh mục hoa, Sản phẩm mới, Khuyến mãi và Bài viết.
* **Ảnh 5:** Giao diện lọc sản phẩm theo danh mục đường dẫn `/category/:slug`.
* **Ảnh 6:** Giao diện chi tiết sản phẩm chuẩn SEO đường dẫn `/product/:slug`.

<br>

==================================================================================

# ASSIGNMENT 1: XÂY DỰNG WEBSITE THƯƠNG MẠI ĐIỆN TỬ BHSHOP (GIAI ĐOẠN 1)

### 1. Mục tiêu
* Hoàn thiện website thương mại điện tử hoa tươi BHShop chuẩn Mobile-First (độ rộng tối đa 430px trên di động và canh giữa trên desktop).
* Xây dựng tính năng Tìm kiếm sản phẩm hoa tươi thời gian thực trên thanh Header (**Mức Khá**).
* Xây dựng tính năng Quản lý giỏ hàng lưu trữ LocalStorage và tính tổng tiền tự động bằng Angular Signals (**Mức Giỏi**).
* Chuẩn bị và thực hiện quy trình đóng gói, triển khai dự án lên nền tảng đám mây (Render cho Backend và Vercel cho Frontend).

---

### 2. Các chức năng thực hiện
| Thành phần / Chức năng | Mô tả chức năng (Chức năng gì) | Cách làm / Kỹ thuật thực hiện (Làm như thế nào) |
| :--- | :--- | :--- |
| **Cơ sở dữ liệu MongoDB Cloud** | Lưu trữ và tự động nạp dữ liệu mẫu (Auto-seed) khi khởi động | Kết nối MongoDB Atlas, viết script `autoSeedData()` kiểm tra nếu rỗng thì nạp tự động |
| **Tìm kiếm thời gian thực (Mức Khá)** | Nhập tên hoa trên thanh Header và hiển thị danh sách gợi ý tức thì | Backend xử lý truy vấn regex `$regex: search, $options: 'i'`, Frontend bắt sự kiện `(input)`, gọi API gợi ý realtime |
| **Quản lý Giỏ hàng (Mức Giỏi)** | Thêm hoa vào giỏ, tăng/giảm số lượng, xóa sản phẩm, xóa toàn bộ giỏ hàng | Xây dựng `CartService` với Signal `cartItems`, tự động lưu trữ và đồng bộ với `localStorage` |
| **Tính toán hóa đơn tự động** | Tự động tính tổng số lượng món, tạm tính, phí ship và tổng tiền thanh toán | Sử dụng Angular `computed()` trong `CartService` tự động cập nhật khi mảng sản phẩm thay đổi |
| **Trang giỏ hàng (`/cart`)** | Hiển thị danh sách sản phẩm đã chọn, ô cập nhật số lượng và nút đặt hàng | Xây dựng `CartComponent`, liên kết router `/cart` và icon giỏ hàng trên thanh Header |
| **Giao diện chuẩn Mobile-First** | Tối ưu trải nghiệm mua sắm trên thiết bị di động (tối đa 430px) | Bố cục responsive CSS/Tailwind, trang bị thanh điều hướng chân trang (Bottom Navigation) |
| **Triển khai Cloud (Vercel & Render)** | Đưa toàn bộ hệ thống Fullstack hoạt động online trên Internet | Đẩy mã nguồn lên GitHub, deploy Backend lên Render.com, tạo file `vercel.json` deploy Frontend lên Vercel |

---

### 3. Các bước thực hiện
* **Bước 1: Thiết lập MongoDB Atlas & Cơ chế Auto-seed**
  Tạo cluster trên MongoDB Atlas, thiết lập IP Whitelist `0.0.0.0/0`. Viết hàm `autoSeedData()` trong backend để tự động chèn dữ liệu mẫu nếu database chưa có dữ liệu.
* **Bước 2: Xây dựng chức năng Tìm kiếm sản phẩm (Mức Khá)**
  - Backend: Thêm tham số `search` vào endpoint `/api/products`:
    ```javascript
    if (search) filter.name = { $regex: search, $options: 'i' };
    ```
  - Frontend: Trên thanh Header gắn sự kiện `(input)="onSearch($event)"`, gọi `ProductService.searchProducts()` và hiển thị dropdown kết quả.
* **Bước 3: Xây dựng CartService quản lý LocalStorage (Mức Giỏi)**
  Tạo `CartService` với Signal:
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class CartService {
    cartItems = signal<CartItem[]>(this.loadCartFromStorage());
    totalPrice = computed(() => this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0));
    
    addToCart(product: Product) {
      // Cập nhật số lượng nếu trùng id hoặc thêm mới, sau đó lưu localStorage
    }
  }
  ```
* **Bước 4: Xây dựng giao diện trang Giỏ hàng (`/cart`)**
  Tạo Component `CartComponent`, sử dụng `@for` duyệt danh sách `cartService.cartItems()`, các nút `+` / `-` gọi hàm cập nhật số lượng và nút xóa món gọi `removeFromCart()`.
* **Bước 5: Thiết kế giao diện Mobile-First**
  Tối ưu hóa độ rộng layout tối đa `max-w-[430px]`, thêm thanh điều hướng cố định dưới đáy màn hình (Bottom Navigation: Trang chủ, Khám phá, Giỏ hàng, Tài khoản).
* **Bước 6: Cấu hình và triển khai đám mây (Render & Vercel)**
  - Tạo file `vercel.json` cấu hình rewrite để Angular SPA không bị lỗi 404 khi tải lại trang:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```
  - Đẩy mã nguồn lên GitHub: `https://github.com/XuanDinh2702/bhshop-fullstack`.
  - Kết nối GitHub với Render.com để chạy Backend và Vercel để chạy Frontend.

---

### 4. Kết quả đạt được
* Hoàn thành 100% các tiêu chí của Assignment 1 (Giai đoạn 1) từ mức Cơ bản, Mức Khá đến Mức Giỏi.
* Chức năng Tìm kiếm hoa tươi thời gian thực hoạt động nhạy, trả kết quả tức thì (**Mức Khá**).
* Chức năng Giỏ hàng lưu trữ bền vững trong `localStorage`, dữ liệu giữ nguyên vẹn khi tải lại trang F5 (**Mức Giỏi**).
* Giao diện Mobile-First chuẩn mực, tương thích hoàn hảo trên iPhone 15 Pro Max và máy tính bàn.
* Mã nguồn được quản lý chuyên nghiệp bằng Git, phân tách Frontend và Backend rõ ràng.

---

### 5. Hình ảnh minh chứng
* **Ảnh 1:** Cơ sở dữ liệu 4 Collection (`categories`, `products`, `blogs`, `banners`) trên MongoDB Atlas.
* **Ảnh 2:** Chức năng tìm kiếm sản phẩm theo tên hoa trên thanh Header hiển thị popup gợi ý thời gian thực.
* **Ảnh 3:** Giao diện trang Giỏ hàng (`/cart`) với các thao tác tăng/giảm số lượng và tự động tính tổng tiền.
* **Ảnh 4:** Giao diện hiển thị chuẩn Mobile-First (iPhone 15 Pro Max) kèm thanh Bottom Navigation.
* **Ảnh 5:** Cấu hình biến môi trường và quá trình triển khai thành công trên Render.com và Vercel.

---

*Xác nhận của sinh viên:* **Trần Ngọc Xuân Đình – MSSV: PS47346**
