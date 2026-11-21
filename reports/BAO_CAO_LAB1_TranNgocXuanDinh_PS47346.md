# TRƯỜNG CAO ĐẲNG FPT POLYTECHNIC TPHCM
## KHOA CÔNG NGHỆ THÔNG TIN – BỘ MÔN PHÁT TRIỂN PHẦN MỀM
### MÔN HỌC: WEB105 – LẬP TRÌNH FRONT-END FRAMEWORK 1

---

# BÁO CÁO LAB 1
## Cài đặt Angular và Tạo Component – Dự án BHShop (Tiệm Hoa Tươi & Quà Tặng BHShop)

* **Giảng viên hướng dẫn (GVHD):** ThS. Trần Bá Hộ
* **Sinh viên thực hiện (SVTH):** Trần Ngọc Xuân Đình
* **Mã số sinh viên (MSSV):** PS47346
* **Lớp:** WD19301 / WEB105
* **Năm học:** TPHCM – 2026

---

## MỤC LỤC
1. [Cài đặt môi trường và Angular](#1-cài-đặt-môi-trường-và-angular)
2. [Cấu trúc thư mục dự án](#2-cấu-trúc-thư-mục-dự-án)
3. [Tạo Component bằng Angular CLI](#3-tạo-component-bằng-angular-cli)
4. [Các Component đã xây dựng trong BHShop](#4-các-component-đã-xây-dựng-trong-bhshop)
   - 4.1. [Giao tiếp giữa Component cha và con (input / output)](#41-giao-tiếp-giữa-component-cha-và-con)
   - 4.2. [Quản lý trạng thái bằng Signal & Computed](#42-quản-lý-trạng-thái-bằng-signal--computed)
5. [Kiểm tra và đóng gói](#5-kiểm-tra-và-đóng-gói)
6. [Khó khăn và hướng phát triển](#6-khó-khăn-và-hướng-phát-triển)
7. [Kết luận](#7-kết-luận)

---

## 1. Cài đặt môi trường và Angular

Trước khi bắt đầu phát triển ứng dụng web với Angular 20+, môi trường máy tính cần được cài đặt Node.js và quản lý gói npm. Do máy tính gặp tình trạng ổ `C:` sắp đầy dung lượng, toàn bộ thư mục npm toàn cục (`prefix`), bộ nhớ đệm (`cache`) và mã nguồn dự án được thiết lập và quản lý chặt chẽ trên ổ `D:`.

### Các bước thực hiện chi tiết:

* **Bước 1 – Cài đặt Node.js & Cấu hình đường dẫn lưu trữ trên ổ D:**
  - Phiên bản cài đặt: Node.js v22.14.0 LTS (đi kèm npm v11.x).
  - Cấu hình thư mục npm global và cache để tránh chiếm dụng ổ C:
    ```powershell
    npm config set prefix "D:\nodejs\npm-global"
    npm config set cache "D:\nodejs\npm-cache"
    ```
  - Kiểm tra đường dẫn cấu hình:
    ```powershell
    npm config get prefix
    # Kết quả: D:\nodejs\npm-global
    ```

* **Bước 2 – Cài đặt Angular CLI toàn cục:**
  - Cài đặt phiên bản Angular CLI mới nhất thông qua npm:
    ```powershell
    npm install -g @angular/cli
    ```

* **Bước 3 – Kiểm tra phiên bản Angular CLI:**
  - Chạy lệnh xác nhận cài đặt thành công:
    ```powershell
    ng version
    ```
  - Bảng tổng hợp phiên bản công nghệ sử dụng:

| Thành phần | Phiên bản | Ghi chú |
| :--- | :--- | :--- |
| **Angular Core** | `20.x / 22.x` | Kiến trúc Standalone Component hiện đại |
| **Angular CLI** | `22.2.x` | Bộ công cụ dòng lệnh build & scaffold |
| **Node.js** | `v22.14.0` | Môi trường runtime JavaScript phía máy chủ |
| **npm** | `11.x` | Trình quản lý gói thư viện (lưu trên ổ D:) |
| **TypeScript** | `5.6+` | Ngôn ngữ định kiểu tĩnh cho Angular |
| **Styling** | `CSS3 / Tailwind CSS` | Thiết kế Mobile-first chuẩn 430px |

* **Bước 4 – Khởi tạo dự án BHShop:**
  - Khởi tạo dự án độc lập, không dùng NgModule cổ điển (`--standalone`), không dùng SSR (`--ssr=false`):
    ```powershell
    ng new Lab3Ang --standalone --style=css --ssr=false
    ```

* **Bước 5 – Chạy thử ứng dụng trên môi trường cục bộ:**
  - Di chuyển vào thư mục dự án và khởi động máy chủ phát triển:
    ```powershell
    cd D:\js\fw1\Lab3Ang
    npm start
    # hoặc: ng serve --port 4200 -o
    ```
  - Ứng dụng khởi chạy thành công tại địa chỉ `http://localhost:4200/`. Tính năng Hot Module Replacement (HMR) tự động cập nhật giao diện ngay khi lưu mã nguồn.

---

## 2. Cấu trúc thư mục dự án

Dự án **BHShop** được phân chia theo kiến trúc module hóa rõ ràng, độc lập và dễ mở rộng:

```
D:\js\fw1\Lab3Ang\
├── src/
│   ├── index.html                   # HTML gốc nạp thẻ <app-root>
│   ├── main.ts                      # Nạp ứng dụng qua bootstrapApplication(App)
│   ├── styles.css                   # Định kiểu toàn cục, biến màu sắc, reset CSS
│   └── app/
│       ├── app.config.ts            # Cấu hình providers (provideRouter, provideHttpClient)
│       ├── app.routes.ts            # Danh sách định tuyến URL của ứng dụng
│       ├── app.ts                   # Component gốc điều phối trạng thái toàn cục
│       ├── app.html                 # Layout chính: Header + RouterOutlet + Footer
│       ├── app.css                  # Style giao diện mobile/desktop của App
│       ├── shared/
│       │   └── components/          # Các Component dùng chung tái sử dụng
│       │       ├── header/          # Thanh điều hướng trên, logo, giỏ hàng
│       │       ├── footer/          # Thông tin liên hệ, bản quyền cửa hàng
│       │       ├── bottom-nav/      # Thanh điều hướng di động cố định đáy màn hình
│       │       └── product-card/    # Thẻ hiển thị một sản phẩm hoa tươi
│       ├── models/                  # Định nghĩa các TypeScript Interface
│       │   ├── product.model.ts     # Interface Product
│       │   ├── category.model.ts    # Interface Category
│       │   └── blog.model.ts        # Interface Blog
│       └── data/                    # Nguồn dữ liệu mẫu khởi đầu (mock data)
│           ├── products.data.ts
│           └── articles.data.ts
├── angular.json                     # Cấu hình build & serve của Angular CLI
├── package.json                     # Danh sách thư viện phụ thuộc và script chạy
└── tsconfig.json                    # Cấu hình trình biên dịch TypeScript
```

---

## 3. Tạo Component bằng Angular CLI

Từ phiên bản Angular 17 trở đi (và chuẩn hóa ở Angular 20-22), các Component mặc định là **Standalone Component**, loại bỏ hoàn toàn sự rườm rà của `NgModule`.

### Lệnh sinh Component tự động:
```powershell
ng generate component shared/components/header --skip-tests
ng generate component shared/components/footer --skip-tests
ng generate component shared/components/product-card --skip-tests
```

### Cấu trúc 1 Component Standalone chuẩn (`header.ts`):
```typescript
import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  // Nhận dữ liệu từ component cha thông qua Signal Input
  readonly shopName = input<string>('BHShop - Hoa Tươi Cao Cấp');
  readonly cartCount = input<number>(0);

  // Phát sự kiện lên component cha thông qua Signal Output
  readonly cartClick = output<void>();

  onOpenCart(): void {
    this.cartClick.emit();
  }
}
```

---

## 4. Các Component đã xây dựng trong BHShop

| Tên Component | Selector | Chức năng chính trong dự án BHShop |
| :--- | :--- | :--- |
| **HeaderComponent** | `app-header` | Hiển thị thương hiệu BHShop, thanh tìm kiếm sản phẩm nhanh và badge số lượng hoa trong giỏ hàng. |
| **ProductCardComponent** | `app-product-card` | Hiển thị thẻ một bó hoa: hình ảnh, tên hoa, giá niêm yết, giá khuyến mãi, nhãn HOT/SALE và nút "Chọn mua". |
| **FooterComponent** | `app-footer` | Cung cấp thông tin shop hoa tươi, hotline, địa chỉ cửa hàng và chính sách giao hoa 2 giờ. |
| **BottomNavComponent** | `app-bottom-nav` | Thanh điều hướng dưới đáy màn hình điện thoại (Trang chủ, Danh mục hoa, Bài viết, Giỏ hàng). |
| **AppComponent** | `app-root` | Component gốc chứa khung hiển thị, Header, Footer và RouterOutlet. |

### 4.1. Giao tiếp giữa Component cha và con

Angular hiện đại sử dụng `input()` và `output()` hướng Signal, thay thế hoàn toàn cho decorator `@Input()` và `@Output()` cũ, mang lại hiệu năng cao và bắt lỗi type an toàn lúc biên dịch.

* **Truyền dữ liệu từ cha xuống con (`input`):**
  - Trong `product-card.ts`:
    ```typescript
    export class ProductCardComponent {
      name = input.required<string>();
      price = input.required<number>();
      oldPrice = input<number>();
      image = input.required<string>();
      isHot = input<boolean>(false);
      stock = input<number>(10);
      
      // Output phát sự kiện mua hàng
      addToCart = output<void>();

      onBuy(): void {
        if (this.stock() > 0) {
          this.addToCart.emit();
        }
      }
    }
    ```

* **Sử dụng tại Component cha (`home.html` hoặc `app.html`):**
  ```html
  <app-product-card
    [name]="product.name"
    [price]="product.price"
    [oldPrice]="product.oldPrice"
    [image]="product.image"
    [isHot]="product.hot"
    [stock]="product.stock"
    (addToCart)="handleAddToCart(product)"
  />
  ```

### 4.2. Quản lý trạng thái bằng Signal & Computed

Ứng dụng không cần dùng thư viện bên ngoài phức tạp mà tận dụng sức mạnh phản ứng (reactivity) nguyên bản của Angular Signals:

```typescript
// Định nghĩa Signal trạng thái
cartCount = signal<number>(0);
searchQuery = signal<string>('');

// Danh sách sản phẩm hoa tươi gốc
products = signal<Product[]>([ ... ]);

// Computed Signal tự động lọc danh sách khi từ khóa tìm kiếm thay đổi
filteredProducts = computed(() => {
  const q = this.searchQuery().trim().toLowerCase();
  if (!q) return this.products();
  return this.products().filter(p => p.name.toLowerCase().includes(q));
});
```

Cú pháp điều khiển luồng thế hệ mới `@for` và `@if` được ứng dụng trực tiếp trong template HTML:
```html
@if (filteredProducts().length > 0) {
  <div class="product-grid">
    @for (item of filteredProducts(); track item.id) {
      <app-product-card [name]="item.name" [price]="item.price" />
    }
  </div>
} @else {
  <p class="empty-notice">Không tìm thấy mẫu hoa nào khớp với từ khóa tìm kiếm.</p>
}
```

---

## 5. Kiểm tra và đóng gói

Dự án được kiểm tra nghiêm ngặt qua các quy trình tiêu chuẩn của Angular CLI:

1. **Chế độ phát triển (`ng serve`):**
   - Chạy lệnh `npm start`.
   - Kết quả: Máy chủ biên dịch trong 1.8 giây, giao diện hiển thị mượt mà trên cả trình duyệt máy tính và chế độ giả lập thiết bị di động (iPhone / Pixel).

2. **Quy trình đóng gói tối ưu (`ng build`):**
   - Chạy lệnh: `ng build --configuration production`
   - Kết quả biên dịch: Toàn bộ mã nguồn TypeScript, HTML và CSS được minify và đóng gói vào thư mục `dist/Lab3Ang/browser/`.
   - Tổng kích thước gói tải ban đầu (Initial Bundle Size): **dưới 280 kB**, đáp ứng xuất sắc tiêu chí tải trang siêu tốc cho người dùng di động.

3. **Kiểm tra tương thích hiển thị (Responsive Check):**
   - Mobile: Độ rộng tối đa 430px (chuẩn iPhone 15 Pro Max), thanh menu dưới cố định, chữ và ảnh hiển thị sắc nét.
   - Desktop: Canh giữa màn hình, bóng đổ viền hộp sang trọng.

---

## 6. Khó khăn và hướng phát triển

### Khó khăn gặp phải:
1. **Quản lý tài nguyên ổ cứng:** Ổ `C:` bị giới hạn dung lượng nên gặp khó khăn ban đầu khi `npm` tự ý lưu bộ nhớ đệm vào `AppData`. Vấn đề đã được xử lý triệt để bằng cách cấu hình `prefix` và `cache` chuyển hẳn sang ổ `D:`.
2. **Tiếp cận cú pháp Angular mới:** Cú pháp Standalone Component, hàm `input()`/`output()` và Signal đòi hỏi thời gian thích nghi so với cách viết `@Input()` và `NgModule` cũ.

### Hướng phát triển trong các bài Lab tiếp theo:
* **Lab 2:** Xây dựng danh sách động với bộ lọc đa tiêu chí (danh mục hoa sinh nhật, hoa khai trương, mức giá), sắp xếp giá tăng/giảm và hiển thị trạng thái tồn kho chi tiết.
* **Lab 3:** Tích hợp Angular Router đa trang (Trang chủ, Chi tiết hoa tươi, Trang bài viết nghệ thuật cắm hoa kèm video workshop).
* **Lab 4 / ASM 1:** Kết nối API backend Node.js / Express / MongoDB, xây dựng giỏ hàng lưu `localStorage` và quy trình đặt hàng hoàn chỉnh.

---

## 7. Kết luận

Bài thực hành **Lab 1** đã hoàn thành 100% mục tiêu đề ra:
- Cài đặt thành công môi trường Node.js và Angular CLI trên ổ `D:`.
- Nắm vững quy trình sinh Component chuẩn Standalone bằng Angular CLI.
- Tổ chức cấu trúc mã nguồn dự án thương mại điện tử **BHShop** chuyên nghiệp, bài bản.
- Áp dụng thành công cơ chế giao tiếp cha - con hiện đại với `input()`, `output()` và quản lý dữ liệu phản ứng với Angular Signals.

*Xác nhận của sinh viên:* **Trần Ngọc Xuân Đình – MSSV: PS47346**
