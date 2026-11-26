const fs = require('fs');
const path = require('path');
const docx = require('docx');

const {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  Packer,
  ShadingType,
  BorderStyle
} = docx;

function createP(text, options = {}) {
  const runs = Array.isArray(text)
    ? text
    : [new TextRun({
        text,
        font: 'Segoe UI',
        size: options.size || 22,
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || '1f2937'
      })];

  return new Paragraph({
    children: runs,
    spacing: { before: options.before || 80, after: options.after || 80 },
    alignment: options.alignment || AlignmentType.LEFT
  });
}

function createHeading(text, level = HeadingLevel.HEADING_1) {
  let size = 28;
  let color = '1e3a8a';
  if (level === HeadingLevel.HEADING_2) {
    size = 24;
    color = '0369a1';
  } else if (level === HeadingLevel.HEADING_3) {
    size = 22;
    color = '0f766e';
  }

  return new Paragraph({
    heading: level,
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        font: 'Segoe UI',
        size,
        color
      })
    ]
  });
}

function createBullet(title, desc) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 50, after: 50 },
    children: [
      new TextRun({ text: title + (desc ? ': ' : ''), bold: true, font: 'Segoe UI', size: 21, color: '111827' }),
      ...(desc ? [new TextRun({ text: desc, font: 'Segoe UI', size: 21, color: '374151' })] : [])
    ]
  });
}

function createCodeBlock(code) {
  const lines = code.split('\n');
  return lines.map(line => new Paragraph({
    children: [
      new TextRun({
        text: line.length === 0 ? ' ' : line,
        font: 'Consolas',
        size: 19,
        color: '0f172a'
      })
    ],
    shading: {
      type: ShadingType.SOLID,
      color: 'F1F5F9'
    },
    spacing: { before: 20, after: 20 }
  }));
}

function createTable(headers, rows) {
  const headerRow = new TableRow({
    children: headers.map(h => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: h, bold: true, font: 'Segoe UI', size: 20, color: 'FFFFFF' })],
        alignment: AlignmentType.CENTER
      })],
      shading: { type: ShadingType.SOLID, color: '1E3A8A' },
      margins: { top: 100, bottom: 100, left: 140, right: 140 }
    }))
  });

  const bodyRows = rows.map((r, idx) => new TableRow({
    children: r.map((c, colIdx) => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({
          text: String(c),
          font: 'Segoe UI',
          size: 19,
          bold: colIdx === 0,
          color: '1F2937'
        })],
        alignment: colIdx === 0 ? AlignmentType.LEFT : AlignmentType.LEFT
      })],
      shading: { type: ShadingType.SOLID, color: idx % 2 === 0 ? 'FFFFFF' : 'F8FAFC' },
      margins: { top: 80, bottom: 80, left: 120, right: 120 }
    }))
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows]
  });
}

function createHeaderSection(contentTitle) {
  return [
    createP('BÁO CÁO THỰC HÀNH ANGULAR', { bold: true, size: 30, color: 'DC2626', alignment: AlignmentType.CENTER }),
    createP(`Nội dung: ${contentTitle}`, { bold: true, size: 22, color: '2563EB', alignment: AlignmentType.CENTER }),
    createP('----------------------------------------------------------------------------------', { alignment: AlignmentType.CENTER, color: '9CA3AF' }),
    createP('Thông tin sinh viên', { bold: true, size: 22, color: '111827', alignment: AlignmentType.CENTER }),
    createP([
      new TextRun({ text: 'Họ và tên: ', bold: true, font: 'Segoe UI', size: 21, color: '374151' }),
      new TextRun({ text: 'Trần Ngọc Xuân Đình', bold: true, font: 'Segoe UI', size: 21, color: '1E3A8A' })
    ], { alignment: AlignmentType.CENTER }),
    createP([
      new TextRun({ text: 'MSSV: ', bold: true, font: 'Segoe UI', size: 21, color: '374151' }),
      new TextRun({ text: 'PS47346', bold: true, font: 'Segoe UI', size: 21, color: '059669' })
    ], { alignment: AlignmentType.CENTER }),
    createP([
      new TextRun({ text: 'Lớp: ', bold: true, font: 'Segoe UI', size: 21, color: '374151' }),
      new TextRun({ text: 'WD19301', font: 'Segoe UI', size: 21, color: '1F2937' })
    ], { alignment: AlignmentType.CENTER }),
    createP([
      new TextRun({ text: 'Môn học: ', bold: true, font: 'Segoe UI', size: 21, color: '374151' }),
      new TextRun({ text: 'WEB105 – Lập trình Front-end Framework 1', font: 'Segoe UI', size: 21, color: '1F2937' })
    ], { alignment: AlignmentType.CENTER }),
    createP([
      new TextRun({ text: 'Giảng viên hướng dẫn: ', bold: true, font: 'Segoe UI', size: 21, color: '374151' }),
      new TextRun({ text: 'ThS. Trần Bá Hộ', bold: true, font: 'Segoe UI', size: 21, color: 'D97706' })
    ], { alignment: AlignmentType.CENTER }),
    createP([
      new TextRun({ text: 'Ngày thực hiện: ', bold: true, font: 'Segoe UI', size: 21, color: '374151' }),
      new TextRun({ text: '26-Thg11-26', font: 'Segoe UI', size: 21, color: '4B5563' })
    ], { alignment: AlignmentType.CENTER }),
    createP('==================================================================================', { alignment: AlignmentType.CENTER, color: '9CA3AF' }),
    createP('')
  ];
}

// -------------------------------------------------------------
// LAB 4 CONTENT
// -------------------------------------------------------------
function getLab4Elements() {
  return [
    createHeading('LAB 4: KẾT NỐI API VÀ HIỂN THỊ DỮ LIỆU ĐỘNG (FULLSTACK)', HeadingLevel.HEADING_1),
    
    createHeading('1. Mục tiêu', HeadingLevel.HEADING_2),
    createBullet('Tìm hiểu kiến trúc Client - Server phân tách', 'Frontend Angular kết nối Backend Node.js/Express độc lập.'),
    createBullet('Xây dựng Backend RESTful API', 'Viết API bằng Express.js kết nối cơ sở dữ liệu đám mây MongoDB Atlas.'),
    createBullet('Cấu hình CORS', 'Cho phép ứng dụng Frontend Angular gọi API xuyên nguồn an toàn.'),
    createBullet('Sử dụng HttpClient trong Angular', 'Tạo Service inject HttpClient để gửi các HTTP GET request.'),
    createBullet('Hiển thị dữ liệu động', 'Đổ dữ liệu Banner, Danh mục, Sản phẩm, Bài viết lên giao diện bằng Angular Signals và cú pháp @for.'),
    createBullet('Điều hướng theo Slug chuẩn SEO', 'Sử dụng Angular Router với paramMap để điều hướng /category/:slug và /product/:slug.'),
    
    createP(''),
    createHeading('2. Các chức năng thực hiện', HeadingLevel.HEADING_2),
    createTable(
      ['Thành phần / Chức năng', 'Mô tả chức năng (Chức năng gì)', 'Cách làm / Kỹ thuật thực hiện (Làm như thế nào)'],
      [
        [
          'Backend RESTful API',
          'Khởi tạo máy chủ web cung cấp API trả về dữ liệu JSON',
          'Sử dụng Node.js & Express.js, cấu hình middleware cors(), json(), lắng nghe tại cổng 5000'
        ],
        [
          'Cơ sở dữ liệu MongoDB Atlas',
          'Lưu trữ dữ liệu thực tế trên Cloud, các bảng đều có trường slug',
          'Tạo Schema Mongoose cho 4 bảng (categories, products, blogs, banners), đánh index slug unique chuẩn SEO'
        ],
        [
          'API Trang chủ (/api/home)',
          'Gom toàn bộ dữ liệu trang chủ (banner, category, product mới/sale/hot, blog) trong 1 request',
          'Dùng Promise.all() truy vấn đồng thời từ MongoDB Atlas và trả về 1 object JSON hoàn chỉnh'
        ],
        [
          'HttpClient trong Angular',
          'Gửi yêu cầu HTTP GET từ Angular Frontend lên Backend',
          'Khai báo provideHttpClient() trong app.config.ts, inject(HttpClient) vào các Service'
        ],
        [
          'Hiển thị dữ liệu Trang chủ',
          'Đổ dữ liệu từ API lên giao diện người dùng theo thời gian thực',
          'HomeService gọi API, lưu vào Signal homeData, template sử dụng cú pháp @for và @if để hiển thị'
        ],
        [
          'Lọc sản phẩm theo Danh mục',
          'Hiển thị danh sách hoa tươi thuộc danh mục được chọn khi click',
          'Cấu hình Route /category/:slug, đọc paramMap.get("slug"), gọi API /api/products?categorySlug=...'
        ],
        [
          'Chi tiết sản phẩm theo Slug',
          'Hiển thị thông tin chi tiết từng bó hoa theo đường dẫn thân thiện SEO',
          'Cấu hình Route /product/:slug, đọc slug từ URL, gọi API chi tiết /api/products/:slug'
        ]
      ]
    ),
    
    createP(''),
    createHeading('3. Các bước thực hiện', HeadingLevel.HEADING_2),
    createBullet('Bước 1', 'Khởi tạo Backend Express & Cài đặt thư viện'),
    ...createCodeBlock('cd backend\nnpm init -y\nnpm install express mongoose cors dotenv'),
    
    createBullet('Bước 2', 'Kết nối MongoDB Atlas và thiết kế Model có thuộc tính slug'),
    createP('Tạo kết nối Mongoose trong config/db.js và tạo các Schema (Category, Product, Blog, Banner), tất cả đều chứa trường slug: { type: String, required: true, unique: true }.'),
    
    createBullet('Bước 3', 'Xây dựng các Controller và Router API'),
    createP('Tạo các file routes trả về dữ liệu chuẩn RESTful API: GET /api/home (trang chủ), GET /api/categories, GET /api/products, GET /api/blogs.'),
    
    createBullet('Bước 4', 'Cấu hình provideHttpClient trên Angular Frontend'),
    ...createCodeBlock('// src/app/app.config.ts\nimport { provideHttpClient } from "@angular/common/http";\nexport const appConfig: ApplicationConfig = {\n  providers: [provideRouter(routes), provideHttpClient()]\n};'),
    
    createBullet('Bước 5', 'Tạo Service gọi API trong Angular'),
    ...createCodeBlock('@Injectable({ providedIn: "root" })\nexport class HomeService {\n  private http = inject(HttpClient);\n  getHomeData() {\n    return this.http.get<HomeDataResponse>("http://localhost:5000/api/home");\n  }\n}'),
    
    createBullet('Bước 6', 'Tích hợp dữ liệu vào Component với Signals'),
    ...createCodeBlock('homeData = signal<HomeDataResponse | null>(null);\nngOnInit() {\n  this.homeService.getHomeData().subscribe(data => this.homeData.set(data));\n}'),
    
    createBullet('Bước 7', 'Cấu hình Router điều hướng theo Slug'),
    ...createCodeBlock('export const routes: Routes = [\n  { path: "category/:slug", component: CategoryProductsComponent },\n  { path: "product/:slug", component: ProductDetailComponent }\n];'),
    
    createP(''),
    createHeading('4. Kết quả đạt được', HeadingLevel.HEADING_2),
    createBullet('Khởi chạy thành công Backend Express API', 'Hoạt động ổn định trên cổng 5000 kết nối cơ sở dữ liệu MongoDB Atlas.'),
    createBullet('Thiết kế chuẩn 4 Collection có slug', '100% các bảng categories, products, blogs, banners đều có thuộc tính slug phục vụ SEO.'),
    createBullet('Dữ liệu hiển thị động 100%', 'Frontend Angular lấy dữ liệu động trực tiếp từ REST API, không còn dùng dữ liệu hardcoded.'),
    createBullet('Trải nghiệm SPA mượt mà', 'Điều hướng trang chi tiết và lọc danh mục chuyển đổi tức thì không tải lại trang.'),
    
    createP(''),
    createHeading('5. Hình ảnh minh chứng', HeadingLevel.HEADING_2),
    createBullet('Ảnh 1', 'Terminal khởi chạy Server Backend báo kết nối MongoDB Atlas thành công và danh sách endpoint.'),
    createBullet('Ảnh 2', 'Dữ liệu JSON trả về từ API /api/home trên trình duyệt web.'),
    createBullet('Ảnh 3', 'Cấu trúc thư mục mã nguồn Backend và Frontend của dự án.'),
    createBullet('Ảnh 4', 'Giao diện Trang chủ hiển thị đầy đủ Banner slider, Danh mục hoa, Sản phẩm mới, Khuyến mãi và Bài viết.'),
    createBullet('Ảnh 5', 'Giao diện lọc sản phẩm theo danh mục đường dẫn /category/:slug.'),
    createBullet('Ảnh 6', 'Giao diện chi tiết sản phẩm chuẩn SEO đường dẫn /product/:slug.')
  ];
}

// -------------------------------------------------------------
// ASSIGNMENT 1 CONTENT
// -------------------------------------------------------------
function getAsm1Elements() {
  return [
    createHeading('ASSIGNMENT 1: XÂY DỰNG WEBSITE THƯƠNG MẠI ĐIỆN TỬ BHSHOP (GIAI ĐOẠN 1)', HeadingLevel.HEADING_1),
    
    createHeading('1. Mục tiêu', HeadingLevel.HEADING_2),
    createBullet('Hoàn thiện website bán hoa tươi BHShop', 'Bố cục chuẩn Mobile-First (độ rộng tối đa 430px trên di động và canh giữa màn hình desktop).'),
    createBullet('Chức năng Tìm kiếm thời gian thực (Mức Khá)', 'Tìm kiếm sản phẩm hoa tươi theo tên ngay trên thanh Header có gợi ý tức thì.'),
    createBullet('Chức năng Quản lý Giỏ hàng (Mức Giỏi)', 'Lưu trữ giỏ hàng trong LocalStorage, tính toán hóa đơn tự động bằng Angular Signals.'),
    createBullet('Triển khai Đám mây (Cloud Deploy)', 'Đưa ứng dụng lên môi trường Internet (Render cho Backend, Vercel cho Frontend).'),
    
    createP(''),
    createHeading('2. Các chức năng thực hiện', HeadingLevel.HEADING_2),
    createTable(
      ['Thành phần / Chức năng', 'Mô tả chức năng (Chức năng gì)', 'Cách làm / Kỹ thuật thực hiện (Làm như thế nào)'],
      [
        [
          'Cơ sở dữ liệu MongoDB Cloud',
          'Lưu trữ dữ liệu thực tế và tự động nạp dữ liệu mẫu (Auto-seed)',
          'Kết nối MongoDB Atlas, viết script autoSeedData() tự động kiểm tra và chèn dữ liệu mẫu khi khởi động'
        ],
        [
          'Tìm kiếm thời gian thực (Mức Khá)',
          'Nhập tên hoa trên thanh Header và hiển thị kết quả gợi ý ngay lập tức',
          'Backend dùng truy vấn regex ($options: "i"), Frontend bắt sự kiện (input), gọi API gợi ý dropdown tức thì'
        ],
        [
          'Quản lý Giỏ hàng (Mức Giỏi)',
          'Thêm hoa vào giỏ, tăng/giảm số lượng, xóa món, xóa toàn bộ giỏ hàng',
          'Xây dựng CartService với Signal cartItems, tự động đọc và đồng bộ hóa với localStorage'
        ],
        [
          'Tính toán hóa đơn tự động',
          'Tự động tính số lượng món, tạm tính, phí giao hàng và tổng thanh toán',
          'Sử dụng computed() trong CartService, tự động tính lại tổng tiền mỗi khi giỏ hàng có sự thay đổi'
        ],
        [
          'Trang giỏ hàng (/cart)',
          'Hiển thị danh sách sản phẩm đã chọn, ô đổi số lượng và nút đặt hàng',
          'Thiết kế Component CartComponent, binding dữ liệu hai chiều và liên kết icon giỏ hàng trên Header'
        ],
        [
          'Giao diện chuẩn Mobile-First',
          'Tối ưu trải nghiệm mua sắm trên thiết bị di động (tối đa 430px)',
          'Bố cục responsive CSS/Tailwind, trang bị thanh điều hướng chân trang (Bottom Navigation cố định)'
        ],
        [
          'Triển khai Cloud (Vercel & Render)',
          'Đưa toàn bộ hệ thống Fullstack hoạt động online trên mạng Internet',
          'Backend deploy trên Render.com, Frontend build và deploy trên Vercel kèm file cấu hình vercel.json'
        ]
      ]
    ),
    
    createP(''),
    createHeading('3. Các bước thực hiện', HeadingLevel.HEADING_2),
    createBullet('Bước 1', 'Thiết lập MongoDB Atlas & Cơ chế Auto-seed'),
    createP('Tạo cluster trên MongoDB Atlas, thiết lập IP Whitelist 0.0.0.0/0. Viết hàm autoSeedData() trong backend để tự động chèn dữ liệu mẫu nếu database chưa có dữ liệu.'),
    
    createBullet('Bước 2', 'Xây dựng chức năng Tìm kiếm sản phẩm (Mức Khá)'),
    createP('Backend thêm tham số search vào endpoint /api/products xử lý regex. Trên Header Angular bắt sự kiện (input)="onSearch($event)", gọi API và hiển thị dropdown danh sách hoa.'),
    
    createBullet('Bước 3', 'Xây dựng CartService quản lý LocalStorage (Mức Giỏi)'),
    ...createCodeBlock('@Injectable({ providedIn: "root" })\nexport class CartService {\n  cartItems = signal<CartItem[]>(this.loadCartFromStorage());\n  totalPrice = computed(() => this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0));\n  addToCart(product: Product) { /* Cập nhật số lượng & lưu localStorage */ }\n}'),
    
    createBullet('Bước 4', 'Xây dựng giao diện trang Giỏ hàng (/cart)'),
    createP('Tạo CartComponent, sử dụng cú pháp @for duyệt danh sách cartService.cartItems(), các nút "+" / "-" gọi hàm cập nhật số lượng và nút xóa gọi removeFromCart().'),
    
    createBullet('Bước 5', 'Thiết kế giao diện Mobile-First'),
    createP('Tối ưu hóa layout với max-w-[430px], bổ sung BottomNav gồm 4 nút: Trang chủ, Khám phá, Giỏ hàng, Tài khoản cố định ở đáy màn hình.'),
    
    createBullet('Bước 6', 'Cấu hình và triển khai đám mây (Render & Vercel)'),
    createP('Tạo file vercel.json cấu hình rewrite để tránh lỗi 404 khi F5. Đẩy toàn bộ repo lên GitHub và liên kết Render (Backend) cùng Vercel (Frontend).'),
    ...createCodeBlock('// vercel.json\n{\n  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]\n}'),
    
    createP(''),
    createHeading('4. Kết quả đạt được', HeadingLevel.HEADING_2),
    createBullet('Hoàn thành 100% tiêu chí Assignment 1', 'Đạt đầy đủ các cấp độ từ Cơ bản, Mức Khá đến Mức Giỏi.'),
    createBullet('Tìm kiếm realtime hoạt động chính xác (Mức Khá)', 'Người dùng gõ tên hoa đến đâu, kết quả gợi ý xuất hiện ngay tức thì đến đó.'),
    createBullet('Giỏ hàng lưu trữ bền vững (Mức Giỏi)', 'Dữ liệu giỏ hàng được giữ nguyên vẹn khi chuyển trang hoặc F5 tải lại trang.'),
    createBullet('Giao diện Mobile-First hoàn mỹ', 'Hiển thị chuẩn mực trên iPhone 15 Pro Max và cân đối trên màn hình lớn Desktop.'),
    createBullet('Sẵn sàng vận hành đám mây', 'Dự án đã có đầy đủ cấu hình để chạy trực tuyến trên Render.com và Vercel.'),
    
    createP(''),
    createHeading('5. Hình ảnh minh chứng', HeadingLevel.HEADING_2),
    createBullet('Ảnh 1', 'Cơ sở dữ liệu 4 Collection (categories, products, blogs, banners) trên MongoDB Atlas.'),
    createBullet('Ảnh 2', 'Chức năng tìm kiếm sản phẩm theo tên hoa trên thanh Header hiển thị popup gợi ý thời gian thực.'),
    createBullet('Ảnh 3', 'Giao diện trang Giỏ hàng (/cart) với các thao tác tăng/giảm số lượng và tự động tính tổng tiền.'),
    createBullet('Ảnh 4', 'Giao diện hiển thị chuẩn Mobile-First (iPhone 15 Pro Max) kèm thanh Bottom Navigation.'),
    createBullet('Ảnh 5', 'Cấu hình biến môi trường và quá trình triển khai thành công trên Render.com và Vercel.')
  ];
}

const reportsDir = path.resolve('D:/js/fw1/Lab3Ang/reports');
const desktopDir = path.resolve('D:/BaoCao_Word_TranNgocXuanDinh_PS47346');
[reportsDir, desktopDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function safeSave(p1, p2, buffer, label) {
  try {
    fs.writeFileSync(p1, buffer);
    console.log(`Saved ${label} docx to: ${p1}`);
  } catch (err) {
    console.error(`Error saving ${label} to ${p1}:`, err.message);
  }

  try {
    fs.writeFileSync(p2, buffer);
    console.log(`Saved ${label} docx to: ${p2}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.warn(`[LƯU Ý] ${p2} đang được mở trong Word/WPS!`);
      const alt = p2.replace('.docx', '_MOI.docx');
      try {
        fs.writeFileSync(alt, buffer);
        console.log(`[ĐÃ LƯU BẢN DỰ PHÒNG]: ${alt}`);
      } catch (err2) {
        console.error(`Error saving alt: ${err2.message}`);
      }
    } else {
      console.error(`Error saving ${label} to ${p2}:`, err.message);
    }
  }
}

async function run() {
  console.log('Generating clean sample reports according to teacher format...');

  // 1. COMBINED LAB 4 & ASM 1
  const docCombined = new Document({
    sections: [{
      children: [
        ...createHeaderSection('Lab 4 và Assignment 1 (Giai đoạn 1)'),
        ...getLab4Elements(),
        createP(''),
        createP('----------------------------------------------------------------------------------', { alignment: AlignmentType.CENTER, color: '9CA3AF' }),
        createP(''),
        ...getAsm1Elements(),
        createP(''),
        createP('==================================================================================', { alignment: AlignmentType.CENTER, color: '9CA3AF' }),
        createP('Xác nhận của sinh viên: Trần Ngọc Xuân Đình – MSSV: PS47346', { bold: true, italics: true, alignment: AlignmentType.RIGHT })
      ]
    }]
  });
  const bufCombined = await Packer.toBuffer(docCombined);
  safeSave(
    path.join(reportsDir, 'BaoCao_Lab4_Asm1_TranNgocXuanDinh_PS47346.docx'),
    path.join(desktopDir, 'BaoCao_Lab4_Asm1_TranNgocXuanDinh_PS47346.docx'),
    bufCombined,
    'Combined Lab 4 & Asm 1'
  );

  // 2. LAB 4 ONLY
  const docLab4 = new Document({
    sections: [{
      children: [
        ...createHeaderSection('Lab 4 (Kết Nối API & Hiển Thị Dữ Liệu Động)'),
        ...getLab4Elements(),
        createP(''),
        createP('==================================================================================', { alignment: AlignmentType.CENTER, color: '9CA3AF' }),
        createP('Xác nhận của sinh viên: Trần Ngọc Xuân Đình – MSSV: PS47346', { bold: true, italics: true, alignment: AlignmentType.RIGHT })
      ]
    }]
  });
  const bufLab4 = await Packer.toBuffer(docLab4);
  safeSave(
    path.join(reportsDir, 'BaoCao_Lab4_TranNgocXuanDinh_PS47346.docx'),
    path.join(desktopDir, 'BaoCao_Lab4_TranNgocXuanDinh_PS47346.docx'),
    bufLab4,
    'Lab 4 Only'
  );

  // 3. ASM 1 ONLY
  const docAsm1 = new Document({
    sections: [{
      children: [
        ...createHeaderSection('Assignment 1 (Xây Dựng Website Thương Mại Điện Tử BHShop)'),
        ...getAsm1Elements(),
        createP(''),
        createP('==================================================================================', { alignment: AlignmentType.CENTER, color: '9CA3AF' }),
        createP('Xác nhận của sinh viên: Trần Ngọc Xuân Đình – MSSV: PS47346', { bold: true, italics: true, alignment: AlignmentType.RIGHT })
      ]
    }]
  });
  const bufAsm1 = await Packer.toBuffer(docAsm1);
  safeSave(
    path.join(reportsDir, 'BaoCao_Asm1_TranNgocXuanDinh_PS47346.docx'),
    path.join(desktopDir, 'BaoCao_Asm1_TranNgocXuanDinh_PS47346.docx'),
    bufAsm1,
    'Asm 1 Only'
  );

  console.log('All sample reports generated successfully!');
}

run().catch(console.error);
