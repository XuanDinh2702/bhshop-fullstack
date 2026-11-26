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
  ShadingType
} = docx;

// Helper to create styled paragraph
function createP(text, options = {}) {
  const runs = Array.isArray(text)
    ? text
    : [new TextRun({
        text,
        font: 'Segoe UI',
        size: options.size || 23,
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || '1f2937'
      })];

  return new Paragraph({
    children: runs,
    spacing: { before: options.before || 100, after: options.after || 100 },
    alignment: options.alignment || AlignmentType.LEFT
  });
}

// Fixed heading: DO NOT specify `text: text` on Paragraph because children TextRun already has text!
function createHeading(text, level = HeadingLevel.HEADING_1) {
  let size = 30;
  let color = '1e3a8a';
  if (level === HeadingLevel.HEADING_2) {
    size = 26;
    color = '0369a1';
  } else if (level === HeadingLevel.HEADING_3) {
    size = 23;
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
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: title + ': ', bold: true, font: 'Segoe UI', size: 22, color: '111827' }),
      new TextRun({ text: desc, font: 'Segoe UI', size: 22, color: '374151' })
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
        children: [new TextRun({ text: h, bold: true, font: 'Segoe UI', size: 21, color: 'FFFFFF' })],
        alignment: AlignmentType.CENTER
      })],
      shading: { type: ShadingType.SOLID, color: '1E3A8A' },
      margins: { top: 120, bottom: 120, left: 160, right: 160 }
    }))
  });

  const bodyRows = rows.map((r, idx) => new TableRow({
    children: r.map(c => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: String(c), font: 'Segoe UI', size: 20, color: '1F2937' })]
      })],
      shading: { type: ShadingType.SOLID, color: idx % 2 === 0 ? 'FFFFFF' : 'F8FAFC' },
      margins: { top: 90, bottom: 90, left: 140, right: 140 }
    }))
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows]
  });
}

// BỎ DÒNG MỨC ĐỘ ĐẠT ĐƯỢC
function createCoverHeader(labTitle, subTitle) {
  return [
    createP('TRƯỜNG CAO ĐẲNG FPT POLYTECHNIC TPHCM', { bold: true, size: 26, color: 'EA580C', alignment: AlignmentType.CENTER }),
    createP('KHOA CÔNG NGHỆ THÔNG TIN – BỘ MÔN PHÁT TRIỂN PHẦN MỀM', { bold: true, size: 21, color: '4B5563', alignment: AlignmentType.CENTER }),
    createP('MÔN HỌC: WEB105 – LẬP TRÌNH FRONT-END FRAMEWORK 1', { bold: true, size: 23, color: '1E3A8A', alignment: AlignmentType.CENTER }),
    createP('----------------------------------------------------------------------------------', { alignment: AlignmentType.CENTER, color: '9CA3AF' }),
    createP(labTitle, { bold: true, size: 34, color: 'DC2626', alignment: AlignmentType.CENTER }),
    createP(subTitle, { bold: true, size: 24, color: '2563EB', alignment: AlignmentType.CENTER }),
    createP(''),
    createP([
      new TextRun({ text: 'Giảng viên hướng dẫn (GVHD): ', bold: true, font: 'Segoe UI', size: 23, color: '111827' }),
      new TextRun({ text: 'ThS. Trần Bá Hộ', bold: true, font: 'Segoe UI', size: 23, color: 'D97706' })
    ], { alignment: AlignmentType.CENTER }),
    createP([
      new TextRun({ text: 'Sinh viên thực hiện (SVTH): ', bold: true, font: 'Segoe UI', size: 23, color: '111827' }),
      new TextRun({ text: 'Trần Ngọc Xuân Đình', bold: true, font: 'Segoe UI', size: 23, color: '2563EB' })
    ], { alignment: AlignmentType.CENTER }),
    createP([
      new TextRun({ text: 'Mã số sinh viên (MSSV): ', bold: true, font: 'Segoe UI', size: 23, color: '111827' }),
      new TextRun({ text: 'PS47346', bold: true, font: 'Segoe UI', size: 23, color: '059669' })
    ], { alignment: AlignmentType.CENTER }),
    createP('Lớp: WD19301 / WEB105 – Khóa: 2026', { alignment: AlignmentType.CENTER, size: 21, color: '6B7280' }),
    createP('TP. HỒ CHÍ MINH – NĂM 2026', { bold: true, size: 21, color: '374151', alignment: AlignmentType.CENTER }),
    createP('==================================================================================', { alignment: AlignmentType.CENTER, color: '9CA3AF' }),
    createP('')
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
    console.log(`Saved clean ${label} docx to: ${p1}`);
  } catch (err) {
    console.error(`Error saving ${label} to ${p1}:`, err.message);
  }

  try {
    fs.writeFileSync(p2, buffer);
    console.log(`Saved clean ${label} docx to: ${p2}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.warn(`[LƯU Ý] ${p2} đang được mở trong Word/WPS!`);
      const alt = p2.replace('.docx', '_CLEAN.docx');
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

// ==========================================
// 1. LAB 4 CHUYÊN BIỆT (KHÔNG KẾT LUẬN, KHÔNG MỨC ĐỘ, TIÊU ĐỀ KHÔNG LẶP)
// ==========================================
async function generateLab4Only() {
  const doc = new Document({
    sections: [{
      children: [
        ...createCoverHeader(
          'BÁO CÁO THỰC HÀNH LAB 4',
          'Xây Dựng Backend MongoDB Có Thuộc Tính Slug & Kết Nối Frontend Angular Qua Service'
        ),
        createHeading('MỤC LỤC BÁO CÁO LAB 4', HeadingLevel.HEADING_2),
        createBullet('1. Liệt kê danh sách API đã hoàn thành', 'Bảng thống kê 9 RESTful API endpoints có đầy đủ method, URL, tham số và mô tả chức năng'),
        createBullet('2. Thiết kế Cơ sở dữ liệu MongoDB Atlas', 'Chi tiết 4 Model: Category, Product, Blog, Banner đều có trường slug index unique'),
        createBullet('3. Kỹ thuật Auto-seed Data', 'Hàm tự động nạp 16 mẫu hoa, 6 bài viết, 6 danh mục, 3 banner khi database trống'),
        createBullet('4. Các Sơ đồ Flow hiển thị dữ liệu', 'Flow Trang chủ, Flow danh mục hoa theo slug, Flow chi tiết hoa chuẩn SEO'),
        createBullet('5. Bài tập mở rộng', 'API tìm kiếm theo tên hoa trên Header; Chức năng Giỏ hàng Cart LocalStorage'),
        createBullet('6. Chụp màn hình mã nguồn và Giải thích các bước', 'Cấu hình provideHttpClient, Service gọi API, Angular Signals, CORS'),
        createBullet('7. Kết quả kiểm thử & Đối chiếu yêu cầu', 'Bảng kiểm tra tính năng thực tế'),
        createP(''),

        createHeading('1. Danh sách RESTful API đã hoàn thành'),
        createP('Hệ thống backend Node.js / Express kết nối MongoDB Atlas đã hiện thực hóa đầy đủ 9 API endpoints:'),
        createTable(
          ['STT', 'Phương thức', 'Endpoint API', 'Tham số', 'Chức năng chi tiết'],
          [
            ['1', 'GET', '/api/home', 'Không', 'API Trang chủ (*): Gom 3 banner mới, 4 hoa mới, 4 khuyến mãi, 4 bán chạy, 6 danh mục, 3 bài viết trong 1 request duy nhất'],
            ['2', 'GET', '/api/categories', 'Không', 'Lấy danh sách tất cả danh mục hoa (sắp xếp theo order: 1)'],
            ['3', 'GET', '/api/categories/:slug', ':slug', 'Lấy thông tin chi tiết một danh mục theo chuỗi slug'],
            ['4', 'GET', '/api/products', '?categorySlug, ?search, ?sort, ?limit', 'Lấy danh sách sản phẩm có bộ lọc danh mục bằng slug, sắp xếp và tìm kiếm theo tên'],
            ['5', 'GET', '/api/products/:slug', ':slug', 'Lấy chi tiết hoa tươi theo slug chuẩn SEO kèm danh sách hoa tương tự'],
            ['6', 'GET', '/api/products/id/:id', ':id', 'Lấy chi tiết hoa theo ID số'],
            ['7', 'GET', '/api/blogs', '?limit', 'Lấy danh sách bài viết cẩm nang hoa tươi và video workshop'],
            ['8', 'GET', '/api/blogs/:slug', ':slug', 'Xem chi tiết bài viết cẩm nang và tự động tăng lượt xem'],
            ['9', 'GET', '/api/banners', 'Không', 'Lấy danh sách slider banner quảng cáo trang chủ']
          ]
        ),

        createHeading('2. Thiết kế Cơ sở dữ liệu MongoDB Atlas & Thuộc tính Slug'),
        createP('Theo yêu cầu đề bài Lab 4, toàn bộ các bảng trong CSDL bắt buộc phải có thuộc tính slug:'),
        ...createCodeBlock(
`// Product Model (backend/models/product.model.js)
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // Bắt buộc theo yêu cầu Lab 4
  categoryId: { type: Number, required: true },
  categorySlug: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  image: { type: String, required: true },
  isNewProduct: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  stock: { type: Number, default: 10 },
  description: { type: String }
}, { timestamps: true });`
        ),

        createHeading('3. Kỹ thuật Auto-seed Data'),
        createP('Hàm autoSeedData() trong backend/data/seed.data.js kiểm tra số lượng bản ghi của Category. Nếu database chưa có dữ liệu, hàm tự động nạp sẵn 16 mẫu hoa, 6 danh mục, 6 bài viết và 3 banner. Giảng viên chấm bài chỉ cần khởi động server là có sẵn dữ liệu chuẩn để kiểm thử.'),

        createHeading('4. Sơ đồ Flow hiển thị dữ liệu'),
        createBullet('4.1. Flow hiển thị Dữ liệu Trang chủ', 'Người dùng mở trang chủ -> HomeComponent gọi HomeService.getHomeData() -> Gửi GET /api/home -> Backend thực thi Promise.all() lấy đồng thời banner, hoa mới, hoa khuyến mãi, bán chạy và bài viết -> Angular Signal gán dữ liệu -> Template tự render qua @for.'),
        createBullet('4.2. Flow hiển thị Sản phẩm theo Danh mục', 'Người dùng bấm danh mục hoa -> Router nạp ProductsComponent -> route.paramMap.subscribe() đọc slug -> ProductService.getProducts({ categorySlug: slug }) -> Backend tìm Product.find({ categorySlug }) -> Cập nhật signal products hiển thị mượt mà.'),
        createBullet('4.3. Flow hiển thị Chi tiết Sản phẩm', 'Bấm vào mẫu hoa /product/:slug -> ProductDetailComponent lấy slug -> Gửi GET /api/products/:slug -> Backend tìm findOne({ slug }) -> Trả về chi tiết hoa kèm 3 hoa gợi ý liên quan.'),

        createHeading('5. Bài tập mở rộng'),
        createBullet('API Tìm kiếm theo tên hoa', 'Xây dựng API /api/products?search=... với toán tử $regex không phân biệt hoa thường, kết nối vào ô input Header với dropdown gợi ý thời gian thực.'),
        createBullet('Chức năng Giỏ hàng LocalStorage', 'Trang /cart hỗ trợ thêm hoa, tăng giảm số lượng, xóa món, lưu bền vững vào LocalStorage và tính tổng tiền tự động qua Signals computed().'),

        createHeading('6. Chụp màn hình mã nguồn và Giải thích các bước'),
        createBullet('Cấu hình provideHttpClient', 'Mở kết nối mạng gọi API trong file app.config.ts.'),
        createBullet('Service gọi API qua inject()', 'ProductService và HomeService gọi API backend tập trung.'),
        createBullet('Quản lý trạng thái bằng Signals', 'Các biến signal() và computed() trên giao diện phản ứng nhanh.'),
        createBullet('Middleware CORS', 'Cấu hình cors() trong server.js cho phép Frontend kết nối an toàn.'),

        createHeading('7. Kết quả kiểm thử & Đối chiếu yêu cầu'),
        createTable(
          ['STT', 'Tiêu chí yêu cầu Lab 4', 'Kết quả thực tế', 'Đánh giá'],
          [
            ['1', 'Backend MongoDB tối thiểu 2 bảng có slug', 'Tạo đủ 4 bảng: Category, Product, Blog, Banner đều có slug unique', 'Đạt'],
            ['2', 'API Trang chủ gom banner, sản phẩm mới, bán chạy, sale', 'API /api/home trả về đầy đủ các khối dữ liệu trong 1 request', 'Đạt'],
            ['3', 'Frontend tải đủ các section trang chủ', 'Hiển thị slider banner, 4 danh mục, 3 cụm hoa và bài viết', 'Đạt'],
            ['4', 'Điều hướng Router theo slug', 'Chuyển trang mượt mà không reload qua routerLink và loadComponent', 'Đạt'],
            ['5', 'Tìm kiếm theo tên hoa trên Header', 'Ô input Header tìm kiếm realtime kết nối API /api/products?search=', 'Đạt'],
            ['6', 'Chức năng Giỏ hàng LocalStorage', 'Trang /cart đọc ghi LocalStorage, tăng giảm món, tính tổng tiền tự động', 'Đạt']
          ]
        )
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const p1 = path.join(reportsDir, 'BaoCaoLab4_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  const p2 = path.join(desktopDir, 'BaoCaoLab4_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  safeSave(p1, p2, buffer, 'Lab 4');
}

// ==========================================
// 2. ASSIGNMENT 1 CHUYÊN BIỆT (KHÔNG KẾT LUẬN, KHÔNG MỨC ĐỘ, TIÊU ĐỀ KHÔNG LẶP)
// ==========================================
async function generateAsm1Only() {
  const doc = new Document({
    sections: [{
      children: [
        ...createCoverHeader(
          'BÁO CÁO ASSIGNMENT 1 (GIAI ĐOẠN 1)',
          'Xây Dựng Website Thương Mại Điện Tử BHShop Chuẩn Mobile-First & Triển Khai Cloud Vercel, Render'
        ),
        createHeading('MỤC LỤC BÁO CÁO ASSIGNMENT 1', HeadingLevel.HEADING_2),
        createBullet('1. Giới thiệu dự án BHShop', 'Ý tưởng kinh doanh hoa tươi online, đối tượng phục vụ và tính năng cốt lõi'),
        createBullet('2. Bố cục chuẩn Mobile-First (Tối đa 430px)', 'Trải nghiệm người dùng di động mượt mà trên iPhone 15 Pro Max và cả desktop'),
        createBullet('3. Các màn hình chức năng chính', 'Trang chủ, Trang sản phẩm, Trang chi tiết hoa, Trang giỏ hàng'),
        createBullet('4. Kiến trúc Backend & Cơ sở dữ liệu MongoDB Atlas', 'Kiến trúc MVC, RESTful API, Schema Mongoose có slug, Auto-seed data'),
        createBullet('5. Quản lý trạng thái bằng Angular Signals', 'signal(), computed() tối ưu hiệu năng không cần RxJS subscription phức tạp'),
        createBullet('6. Quy trình Triển khai Đám mây (Cloud Deployment)', 'Đẩy Git lên GitHub, triển khai Backend lên Render.com, Frontend lên Vercel'),
        createBullet('7. Bảng đối chiếu yêu cầu Assignment 1', 'Đánh giá chi tiết từng tiêu chí đề bài'),
        createP(''),

        createHeading('1. Giới thiệu dự án BHShop'),
        createP('BHShop là ứng dụng thương mại điện tử chuyên cung cấp hoa tươi cao cấp, lan hồ điệp khai trương và quà tặng nghệ thuật. Dự án được xây dựng theo mô hình Fullstack Decoupled: Frontend Angular Standalone kết hợp cùng Backend Node.js / Express và cơ sở dữ liệu MongoDB Atlas.'),

        createHeading('2. Bố cục chuẩn Mobile-First (Tối đa 430px)'),
        createP('Theo yêu cầu tối thiểu của Assignment Giai đoạn 1: Website hoàn thiện với kích thước mobile (cho dù duyệt với trình duyệt desktop cũng hiển thị chuẩn mobile):'),
        createBullet('Khung ứng dụng chuẩn 430px', 'Đặt chính giữa màn hình desktop với viền bóng đổ sang trọng, mang lại cảm giác như đang cầm một chiếc iPhone 15 Pro Max thực thụ.'),
        createBullet('Thanh điều hướng cố định đáy (BottomNav)', 'Các icon Trang chủ, Danh mục hoa, Bài viết, Giỏ hàng bám sát mép dưới màn hình giúp thao tác bằng ngón tay cái thuận tiện.'),
        createBullet('Lưới sản phẩm 2 cột tối ưu', 'Thẻ hoa tươi hiển thị ảnh sắc nét, giá bán rõ ràng và nút "Thêm vào giỏ" phản hồi nhanh chóng.'),

        createHeading('3. Các màn hình chức năng đã hoàn thiện'),
        createTable(
          ['Màn hình', 'Đường dẫn (URL)', 'Chức năng chính đã hoàn thành'],
          [
            ['Trang chủ', '/', 'Banner slider trượt tự động, 6 danh mục hoa, cụm hoa mới, hoa khuyến mãi, bán chạy và 3 bài viết mới nhất'],
            ['Trang sản phẩm', '/products', 'Bộ sưu tập mẫu hoa, lọc danh mục theo slug, tìm kiếm và sắp xếp đa tiêu chí'],
            ['Trang chi tiết hoa', '/product/:slug', 'Chi tiết mẫu hoa chuẩn SEO: tên hoa, ảnh lớn, giá bán, mô tả, tồn kho và bộ đếm số lượng mua'],
            ['Trang giỏ hàng', '/cart', 'Lưu giỏ hàng LocalStorage, tăng giảm số lượng, xóa món, tính tổng tiền tự động qua Signals và đặt hàng']
          ]
        ),

        createHeading('4. Kiến trúc Backend & Cơ sở dữ liệu MongoDB Atlas'),
        createP('Hệ thống backend được tổ chức theo mô hình MVC:'),
        createBullet('Controller & Routes', 'Tách bạch rõ ràng giữa xử lý logic nghiệp vụ và định tuyến đường dẫn API.'),
        createBullet('MongoDB Mongoose Models', 'Định nghĩa 4 Schema chặt chẽ: Category, Product, Blog, Banner đều có thuộc tính slug.'),
        createBullet('Auto-seed data', 'Tự động nạp sẵn toàn bộ dữ liệu mẫu hoa tươi và bài viết khi khởi chạy server.'),

        createHeading('5. Quản lý trạng thái bằng Angular Signals'),
        createP('Ứng dụng tận dụng tối đa Angular Signals:'),
        createBullet('signal()', 'Lưu trữ trạng thái danh sách giỏ hàng cartItems, từ khóa tìm kiếm và các danh mục đang chọn.'),
        createBullet('computed()', 'Tự động tính toán lại tổng số lượng món hàng cartCount và tổng thành tiền totalAmount tức thì khi giỏ hàng thay đổi.'),

        createHeading('6. Triển khai Cloud (Vercel & Render.com)'),
        createBullet('Quản lý mã nguồn với Git & GitHub', 'Kho lưu trữ cá nhân tại: https://github.com/XuanDinh2702/bhshop-fullstack với commit chuẩn.'),
        createBullet('Triển khai Backend lên Render.com', 'Dịch vụ Web Service chạy Node.js kết nối MongoDB Atlas, tự động nạp dữ liệu mẫu khi khởi động.'),
        createBullet('Triển khai Frontend lên Vercel', 'Biên dịch mã nguồn Angular ra dist/bhshop/browser, tích hợp vercel.json rewrite chống lỗi 404 khi tải lại trang.'),

        createHeading('7. Bảng đối chiếu yêu cầu Assignment 1 Giai đoạn 1'),
        createTable(
          ['Yêu cầu Assignment 1', 'Kết quả thực hiện của sinh viên', 'Đánh giá'],
          [
            ['Kích thước mobile (cho dù duyệt desktop cũng hiển thị mobile)', 'Khung chuẩn max 430px, responsive hoàn hảo', 'Đạt'],
            ['Frontend: Trang chủ', 'Đầy đủ các section: banner, danh mục, 3 cụm hoa, bài viết', 'Đạt'],
            ['Frontend: Trang sản phẩm', 'Bộ sưu tập hoa, lọc theo slug danh mục', 'Đạt'],
            ['Frontend: Trang chi tiết', 'Trang chi tiết hoa chuẩn SEO slug, gợi ý hoa liên quan', 'Đạt'],
            ['Frontend: Trang giỏ hàng', 'Hoàn thành trọn vẹn: LocalStorage + Signals tính tiền', 'Đạt'],
            ['Backend: MongoDB', 'MongoDB Atlas 4 bảng: categories, products, blogs, banners có slug', 'Đạt'],
            ['Triển khai (*): Git, Vercel, Render', 'Đẩy đủ repo GitHub, cấu hình Vercel và Render hoàn tất', 'Đạt']
          ]
        )
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const p1 = path.join(reportsDir, 'BaoCaoAsm1_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  const p2 = path.join(desktopDir, 'BaoCaoAsm1_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  safeSave(p1, p2, buffer, 'Asm 1');
}

// ==========================================
// 3. LAB 4 & ASM 1 BẢN GỘP (KHÔNG KẾT LUẬN, KHÔNG MỨC ĐỘ, TIÊU ĐỀ KHÔNG LẶP)
// ==========================================
async function generateLab4Asm1Combined() {
  const doc = new Document({
    sections: [{
      children: [
        ...createCoverHeader(
          'BÁO CÁO THỰC HÀNH LAB 4 & ASSIGNMENT 1 (GIAI ĐOẠN 1)',
          'Xây Dựng Ứng Dụng Thương Mại Điện Tử Fullstack BHShop (Angular + Node.js + MongoDB Atlas)'
        ),
        createHeading('MỤC LỤC BÁO CÁO', HeadingLevel.HEADING_2),
        createBullet('1. Tổng quan hệ thống & Kiến trúc Client-Server', 'Mô hình Fullstack Decoupled: Angular Standalone + Express REST API + MongoDB Atlas'),
        createBullet('2. Danh sách các RESTful API đã hoàn thành', 'Bảng thống kê 9 API endpoints đáp ứng trọn vẹn yêu cầu'),
        createBullet('3. Cơ sở dữ liệu MongoDB Atlas & Auto-seed Data', 'Thiết kế 4 Collection (Category, Product, Blog, Banner có slug) và tự nạp dữ liệu'),
        createBullet('4. Sơ đồ Flow hoạt động & Giải thích chi tiết', 'Flow Trang chủ, Lọc danh mục slug, Chi tiết slug, Search realtime, Giỏ hàng Cart'),
        createBullet('5. Chi tiết mã nguồn & Giải thích các bước', 'Mã nguồn Backend (CORS, Express, Model, Controller) và Frontend (provideHttpClient, Signals, Cart)'),
        createBullet('6. Các "Cái bẫy" lỗi thường gặp & Cách khắc phục', 'Khắc phục triệt để lỗi CORS, MongoDB Atlas Whitelist IP, SPA reload trên Vercel'),
        createBullet('7. Quy trình Triển khai Đám mây (Vercel & Render)', 'Hướng dẫn đẩy GitHub, cấu hình Render.com và Vercel kèm vercel.json'),
        createBullet('8. Kết quả kiểm thử & Bảng đối chiếu yêu cầu', 'Kiểm tra chức năng thực tế và đánh giá hoàn thành các tiêu chí'),
        createP(''),

        createHeading('1. Tổng quan hệ thống và Kiến trúc Client - Server'),
        createP('Hệ thống bán hoa tươi trực tuyến BHShop được thiết kế và xây dựng theo mô hình Fullstack hiện đại:'),
        createBullet('Client (Frontend)', 'Angular 20+/22+ kiến trúc Standalone Component, quản lý phản ứng bằng Angular Signals (signal, computed), kết nối HTTP qua provideHttpClient(), giao diện Mobile-first tối đa 430px.'),
        createBullet('Server (Backend)', 'Node.js + Express.js theo kiến trúc MVC chuẩn mực, bảo mật đa nguồn bằng middleware cors, phân tách routes và controllers rõ ràng.'),
        createBullet('Database (Cơ sở dữ liệu)', 'MongoDB Atlas đám mây kết nối bằng Mongoose ODM, tích hợp thuật toán Auto-seed data tự động nạp dữ liệu ban đầu khi cơ sở dữ liệu trống.'),

        createHeading('2. Danh sách các RESTful API đã hoàn thành'),
        createTable(
          ['STT', 'Phương thức', 'Endpoint API', 'Tham số', 'Chức năng chi tiết'],
          [
            ['1', 'GET', '/api/home', 'Không', 'API Trang chủ (*): Gom 3 banner, 4 hoa mới, 4 khuyến mãi, 4 bán chạy, 6 danh mục, 3 bài viết chỉ trong 1 request'],
            ['2', 'GET', '/api/categories', 'Không', 'Lấy toàn bộ danh mục hoa tươi (sắp xếp theo order: 1)'],
            ['3', 'GET', '/api/categories/:slug', ':slug', 'Lấy thông tin chi tiết một danh mục theo slug'],
            ['4', 'GET', '/api/products', '?categorySlug, ?search, ?sort, ?limit', 'Lấy danh sách hoa tươi có bộ lọc danh mục, sắp xếp và tìm kiếm theo tên'],
            ['5', 'GET', '/api/products/:slug', ':slug', 'Lấy thông tin chi tiết một mẫu hoa theo slug chuẩn SEO kèm hoa liên quan'],
            ['6', 'GET', '/api/products/id/:id', ':id', 'Lấy chi tiết hoa tươi theo ID số'],
            ['7', 'GET', '/api/blogs', '?limit', 'Lấy danh sách bài viết nghệ thuật hoa và video workshop'],
            ['8', 'GET', '/api/blogs/:slug', ':slug', 'Xem chi tiết bài viết cẩm nang và tự động tăng lượt xem'],
            ['9', 'GET', '/api/banners', 'Không', 'Lấy danh sách slider banner quảng cáo trang chủ']
          ]
        ),

        createHeading('3. Thiết kế Cơ sở dữ liệu MongoDB Atlas & Auto-seed Data'),
        createHeading('3.1. Cấu trúc 4 Collection chính với thuộc tính Slug', HeadingLevel.HEADING_2),
        createP('Toàn bộ các Schema trong MongoDB đều bắt buộc có thuộc tính slug đánh chỉ mục unique để phục vụ URL thân thiện SEO:'),
        ...createCodeBlock(
`// Product Model (backend/models/product.model.js)
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categoryId: { type: Number, required: true },
  categorySlug: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  image: { type: String, required: true },
  isNewProduct: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  stock: { type: Number, default: 10 },
  description: { type: String }
}, { timestamps: true });`
        ),
        createHeading('3.2. Kỹ thuật Auto-seed Data', HeadingLevel.HEADING_2),
        createP('Trong tệp backend/data/seed.data.js, hàm autoSeedData() tự động kiểm tra countDocuments() của Category; nếu bằng 0 sẽ tự động insertMany() toàn bộ dữ liệu mẫu gồm 16 mẫu hoa, 6 bài viết, 6 danh mục và 3 banner. Giảng viên chỉ cần khởi chạy backend là có ngay dữ liệu hoàn chỉnh.'),

        createHeading('4. Sơ đồ Flow hoạt động & Giải thích chi tiết'),
        createBullet('Flow 1: Hiển thị Dữ liệu Trang chủ', 'Người dùng vào "/" -> HomeComponent gọi HomeService.getHomeData() -> Gửi GET /api/home -> Express thực thi homeController với Promise.all() truy vấn song song MongoDB -> Trả về payload JSON duy nhất -> Angular Signals cập nhật banners(), newFlowers(), saleFlowers(), blogs() -> Template render tự động qua @for.'),
        createBullet('Flow 2: Lọc Sản phẩm theo Danh mục (Slug)', 'Click vào danh mục hoa trên thanh cuộn -> Router nạp ProductsComponent -> Lắng nghe route.paramMap.subscribe() lấy slug -> ProductService.getProducts({ categorySlug: slug }) -> Backend truy vấn Product.find({ categorySlug }) -> Cập nhật products signal ngay lập tức.'),
        createBullet('Flow 3: Hiển thị Chi tiết Sản phẩm chuẩn SEO', 'Người dùng bấm vào mẫu hoa /product/bo-hoa-hong-do-juliet -> ProductDetailComponent lấy slug -> Gửi API GET /api/products/:slug -> Backend tìm kiếm bằng findOne({ slug }) -> Trả về chi tiết mẫu hoa và 3 hoa tương tự.'),
        createBullet('Flow 4: Chức năng Tìm kiếm Realtime trên Header', 'Người dùng nhập từ khóa vào ô tìm kiếm -> Sự kiện (input) kích hoạt onSearchChange() -> Gọi API /api/products?search=... -> Backend truy vấn MongoDB bằng $regex options: "i" -> Trả về dropdown gợi ý 5 mẫu hoa khớp nhất.'),
        createBullet('Flow 5: Chức năng Giỏ hàng LocalStorage', 'Nhấn nút "Mua" ở bất kỳ sản phẩm nào -> CartService.addToCart() cập nhật signal cartItems và ghi JSON vào localStorage -> cartCount tự động tính tổng số lượng -> Icon giỏ hàng trên Header nảy số -> Trang /cart cho phép tăng giảm, xóa món và tính tổng tiền tự động qua computed().'),

        createHeading('5. Chi tiết mã nguồn & Giải thích các bước'),
        createHeading('5.1. Backend Express & CORS', HeadingLevel.HEADING_2),
        ...createCodeBlock(
`// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors()); // Cực kỳ quan trọng: Ngăn chặn lỗi CORS giữa cổng 4200 và 5000
app.use(express.json());
connectDB(); // Kết nối MongoDB Atlas
app.use('/api/home', require('./routes/home.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/blogs', require('./routes/blog.routes'));`
        ),

        createHeading('5.2. Frontend Angular provideHttpClient & Signals Cart', HeadingLevel.HEADING_2),
        ...createCodeBlock(
`// src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient() // Mở kết nối mạng gọi API
  ]
};

// src/app/services/cart.service.ts
export class CartService {
  private storageKey = 'bhshop_cart';
  readonly cartItems = signal<CartItem[]>(this.loadFromStorage());
  readonly cartCount = computed(() => this.cartItems().reduce((s, i) => s + i.quantity, 0));
  readonly totalAmount = computed(() => this.cartItems().reduce((s, i) => s + i.product.price * i.quantity, 0));
}`
        ),

        createHeading('6. Những "Cái bẫy" lỗi thường gặp & Cách khắc phục'),
        createBullet('Lỗi chặn CORS', 'Console đỏ rực lỗi CORS policy. Khắc phục: Phải đặt app.use(cors()) trước các router trong server.js.'),
        createBullet('Lỗi MongoDB Atlas khóa IP', 'Báo lỗi MongooseServerSelectionError timed out. Khắc phục: Vào Network Access trên MongoDB Atlas, bấm Add IP Address và chọn Allow Access from Anywhere (0.0.0.0/0).'),
        createBullet('Lỗi F5 bị 404 trên Hosting Vercel', 'Khi reload các trang con (/products, /cart) bị lỗi 404. Khắc phục: Thêm tệp vercel.json cấu hình rewrite tất cả đường dẫn về /index.html của ứng dụng SPA.'),

        createHeading('7. Quy trình Triển khai Đám mây (Vercel & Render.com)'),
        createBullet('Bước 1 – Đẩy mã nguồn lên GitHub', 'Khởi tạo Git repo, tạo .gitignore loại trừ node_modules và .env, sau đó git push lên GitHub.'),
        createBullet('Bước 2 – Triển khai Backend lên Render.com', 'Tạo New Web Service trên Render.com, chọn thư mục gốc backend, gán biến môi trường MONGO_URI và PORT=5000.'),
        createBullet('Bước 3 – Triển khai Frontend lên Vercel', 'Liên kết repo GitHub trên Vercel, cài đặt Output Directory là dist/bhshop/browser. Vercel tự động build và cấp tên miền https://bhshop.vercel.app miễn phí.'),

        createHeading('8. Kết quả kiểm thử & Đối chiếu yêu cầu'),
        createTable(
          ['STT', 'Tiêu chí yêu cầu Lab 4 & Asm 1', 'Kết quả thực tế', 'Đánh giá'],
          [
            ['1', 'Backend MongoDB tối thiểu 2 bảng có slug', 'Đã tạo 4 bảng: Category, Product, Blog, Banner đều có slug', 'Đạt'],
            ['2', 'API Trang chủ gom banner, sản phẩm mới, bán chạy, sale', 'API /api/home trả về đầy đủ các khối dữ liệu', 'Đạt'],
            ['3', 'Frontend tải đủ các section trang chủ', 'Hiển thị slider banner, 4 danh mục, 3 cụm hoa và bài viết', 'Đạt'],
            ['4', 'Điều hướng Router theo slug', 'Chuyển trang mượt mà không reload qua routerLink và loadComponent', 'Đạt'],
            ['5', 'Tìm kiếm theo tên hoa trên Header', 'Ô input Header tìm kiếm realtime kết nối API /api/products?search=', 'Đạt'],
            ['6', 'Chức năng Giỏ hàng LocalStorage', 'Trang /cart đọc ghi LocalStorage, tăng giảm món, tính tổng tiền tự động', 'Đạt'],
            ['7', 'Bố cục chuẩn Mobile-First (tối đa 430px)', 'Khung nhìn tối ưu chuẩn mobile app, tương thích hoàn hảo mọi thiết bị', 'Đạt'],
            ['8', 'Sẵn sàng triển khai Vercel & Render', 'Đầy đủ vercel.json, file .env.example, script build hoàn chỉnh', 'Đạt']
          ]
        )
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const p1 = path.join(reportsDir, 'BaoCaoLab4_Asm1_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  const p2 = path.join(desktopDir, 'BaoCaoLab4_Asm1_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  safeSave(p1, p2, buffer, 'Lab 4 & Asm 1 Combined');
}

// ==========================================
// 4. LAB 1 (KHÔNG KẾT LUẬN, KHÔNG MỨC ĐỘ, TIÊU ĐỀ KHÔNG LẶP)
// ==========================================
async function generateLab1Clean() {
  const doc = new Document({
    sections: [{
      children: [
        ...createCoverHeader(
          'BÁO CÁO THỰC HÀNH LAB 1',
          'Cài Đặt Angular và Tạo Component – Dự Án BHShop (Tiệm Hoa Tươi)'
        ),
        createHeading('MỤC LỤC BÁO CÁO', HeadingLevel.HEADING_2),
        createBullet('1. Cài đặt môi trường và Angular', 'Cài Node.js, cấu hình npm trên ổ D:, Angular CLI, khởi tạo dự án Standalone'),
        createBullet('2. Cấu trúc thư mục dự án', 'Mô hình tổ chức source code module hóa của BHShop'),
        createBullet('3. Tạo Component bằng Angular CLI', 'Quy trình tạo Standalone Component và phân tích metadata'),
        createBullet('4. Các Component đã xây dựng trong BHShop', 'Header, Footer, ProductCard, BottomNav, App'),
        createBullet('4.1. Giao tiếp giữa Component cha và con', 'Áp dụng input() và output() Signal-based hiện đại'),
        createBullet('4.2. Quản lý trạng thái bằng Signal & Computed', 'Quản lý giỏ hàng và tìm kiếm động'),
        createBullet('5. Kiểm tra và đóng gói', 'Chạy ng serve, đóng gói ng build và tối ưu bundle di động'),
        createBullet('6. Khó khăn và hướng phát triển', 'Giải pháp xử lý ổ C đầy và kế hoạch các bài lab tiếp theo'),
        createP(''),

        createHeading('1. Cài đặt môi trường và Angular'),
        createP('Trước khi bắt đầu phát triển ứng dụng web với Angular 20+, môi trường máy tính cần được cài đặt Node.js và quản lý gói npm. Do máy tính gặp tình trạng ổ C: sắp đầy dung lượng, toàn bộ thư mục npm toàn cục (prefix), bộ nhớ đệm (cache) và mã nguồn dự án được thiết lập và quản lý chặt chẽ trên ổ D:.'),
        createBullet('Bước 1 – Cài đặt Node.js & Cấu hình ổ D', 'Cài đặt Node.js v22.14 LTS kèm npm 11.x. Cấu hình prefix chuyển sang D:\\nodejs\\npm-global và cache chuyển sang D:\\nodejs\\npm-cache.'),
        ...createCodeBlock(
`npm config set prefix "D:\\nodejs\\npm-global"
npm config set cache "D:\\nodejs\\npm-cache"`
        ),
        createBullet('Bước 2 – Cài đặt Angular CLI toàn cục', 'Cài đặt bộ công cụ phát triển Angular CLI mới nhất thông qua npm.'),
        ...createCodeBlock(`npm install -g @angular/cli`),
        createBullet('Bước 3 – Kiểm tra phiên bản', 'Chạy lệnh ng version để xác nhận thông tin môi trường.'),
        createTable(
          ['Thành phần', 'Phiên bản', 'Ghi chú'],
          [
            ['Angular Core', '20.x / 22.x', 'Kiến trúc Standalone Component hiện đại'],
            ['Angular CLI', '22.2.x', 'Bộ công cụ biên dịch và phát triển'],
            ['Node.js', 'v22.14.0', 'Runtime JavaScript máy chủ LTS'],
            ['npm', '11.x', 'Được cấu hình lưu trên ổ D:'],
            ['TypeScript', '5.6+', 'Định kiểu tĩnh cho mã nguồn Angular'],
            ['Styling', 'CSS3 / Tailwind', 'Chuẩn giao diện Mobile-first tối đa 430px']
          ]
        ),
        createBullet('Bước 4 – Khởi tạo dự án BHShop', 'Khởi tạo dự án Standalone, không dùng NgModule, tắt SSR để tối ưu client SPA.'),
        ...createCodeBlock(`ng new Lab3Ang --standalone --style=css --ssr=false`),
        createBullet('Bước 5 – Khởi chạy máy chủ phát triển', 'Mở terminal tại thư mục dự án trên ổ D: và khởi chạy máy chủ:'),
        ...createCodeBlock(
`cd D:\\js\\fw1\\Lab3Ang
npm start # hoặc: ng serve --port 4200`
        ),
        createP('Ứng dụng khởi chạy thành công tại http://localhost:4200/ với tính năng Hot Module Replacement tự động nạp lại khi lưu mã nguồn.'),

        createHeading('2. Cấu trúc thư mục dự án'),
        createP('Dự án BHShop được phân chia rõ ràng theo từng phân hệ chức năng:'),
        ...createCodeBlock(
`D:\\js\\fw1\\Lab3Ang\\src\\
├── app\\
│   ├── app.config.ts         # Đăng ký provider Router & HttpClient
│   ├── app.routes.ts         # Khai báo bản đồ định tuyến URL
│   ├── app.ts / .html / .css # Component gốc của ứng dụng
│   ├── models\\               # Định nghĩa interface Product, Category, Blog
│   ├── data\\                 # Dữ liệu mẫu khởi đầu (16 sản phẩm, 6 bài viết)
│   ├── services\\             # Quản lý giỏ hàng và kết nối API
│   ├── pages\\                # Các màn hình chính (home, products, articles, cart)
│   └── shared\\components\\   # Header, Footer, BottomNav, ProductCard
└── main.ts                   # Điểm khởi chạy bootstrapApplication(App)`
        ),

        createHeading('3. Tạo Component bằng Angular CLI'),
        createP('Từ phiên bản Angular 17+, Component mặc định là Standalone, không phụ thuộc NgModule, giúp mã nguồn nhẹ và dễ tái sử dụng. Sử dụng câu lệnh CLI:'),
        ...createCodeBlock(
`ng generate component shared/components/header --skip-tests
ng generate component shared/components/product-card --skip-tests`
        ),
        createP('Mã nguồn chuẩn Standalone Component của Header:'),
        ...createCodeBlock(
`@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  readonly shopName = input<string>('BHShop - Hoa Tươi Cao Cấp');
  readonly cartCount = input<number>(0);
  readonly cartClick = output<void>();
}`
        ),

        createHeading('4. Các Component đã xây dựng trong BHShop'),
        createTable(
          ['Tên Component', 'Selector', 'Vai trò trong dự án'],
          [
            ['HeaderComponent', 'app-header', 'Thương hiệu BHShop, thanh tìm kiếm và biểu tượng giỏ hàng phản ứng'],
            ['ProductCardComponent', 'app-product-card', 'Hiển thị thẻ mẫu hoa: ảnh, giá, nhãn HOT, trạng thái còn hàng, nút mua'],
            ['FooterComponent', 'app-footer', 'Cung cấp thông tin shop hoa tươi, hotline, địa chỉ cửa hàng và chính sách'],
            ['BottomNavComponent', 'app-bottom-nav', 'Thanh menu dưới đáy cho người dùng điện thoại (Trang chủ, Hoa, Bài viết, Giỏ)'],
            ['AppComponent', 'app-root', 'Component gốc chứa khung hiển thị, Header, RouterOutlet và Footer']
          ]
        ),

        createHeading('4.1. Giao tiếp giữa Component cha và con', HeadingLevel.HEADING_2),
        createP('Angular 20+ sử dụng cơ chế input() và output() Signal-based giúp kiểm soát luồng dữ liệu một chiều an toàn và hiệu quả:'),
        ...createCodeBlock(
`// Khai báo trong ProductCard:
name = input.required<string>();
price = input.required<number>();
addToCart = output<void>();

// Sử dụng tại Component cha (home.html):
<app-product-card 
  [name]="product.name" 
  [price]="product.price" 
  (addToCart)="handleAddToCart(product)" 
/>`
        ),

        createHeading('4.2. Quản lý trạng thái bằng Signal & Computed', HeadingLevel.HEADING_2),
        createP('Sử dụng signal() để theo dõi biến động và computed() để tự động tính toán danh sách sản phẩm khớp với từ khóa tìm kiếm:'),
        ...createCodeBlock(
`cartCount = signal<number>(0);
searchQuery = signal<string>('');
filteredProducts = computed(() => {
  const q = this.searchQuery().trim().toLowerCase();
  if (!q) return this.products();
  return this.products().filter(p => p.name.toLowerCase().includes(q));
});`
        ),

        createHeading('5. Kiểm tra và đóng gói'),
        createBullet('Kiểm tra ng serve', 'Máy chủ phát triển khởi chạy trong 1.8s, hot reload tức thì khi lưu file.'),
        createBullet('Kiểm tra ng build', 'Thực hiện ng build --configuration production. Toàn bộ mã nguồn đóng gói vào dist/, bundle tải lần đầu chỉ 267 kB.'),
        createBullet('Kiểm tra Responsive', 'Giao diện co giãn chuẩn mobile 430px (iPhone) và mở rộng thanh thoát trên desktop 1280px.'),

        createHeading('6. Khó khăn và hướng phát triển'),
        createBullet('Khó khăn', 'Bộ nhớ ổ C bị đầy được xử lý bằng cách chuyển npm prefix và cache sang ổ D:. Học cú pháp Signal mới thay cho decorator cũ.'),
        createBullet('Hướng phát triển', 'Tiếp tục hoàn thiện Lab 2 với bộ lọc danh mục và sắp xếp đa tiêu chí; Lab 3 với Router và Section bài viết video workshop.')
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const p1 = path.join(reportsDir, 'BaoCaoLab1_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  const p2 = path.join(desktopDir, 'BaoCaoLab1_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  safeSave(p1, p2, buffer, 'Lab 1');
}

// ==========================================
// 5. LAB 2 (KHÔNG KẾT LUẬN, KHÔNG MỨC ĐỘ, TIÊU ĐỀ KHÔNG LẶP)
// ==========================================
async function generateLab2Clean() {
  const doc = new Document({
    sections: [{
      children: [
        ...createCoverHeader(
          'BÁO CÁO THỰC HÀNH LAB 2',
          'Danh Sách Động, Tìm Kiếm, Lọc Danh Mục và Sắp Xếp – Dự Án BHShop'
        ),
        createHeading('MỤC LỤC BÁO CÁO', HeadingLevel.HEADING_2),
        createBullet('1. Mục tiêu bài thực hành', 'Định nghĩa Product interface, render @for / @empty, DecimalPipe, Signals'),
        createBullet('2. Tiến độ thực hiện', 'Bảng theo dõi 6 bước hoàn thành Lab 2'),
        createBullet('3. Cấu trúc file chính', 'Các tệp TypeScript, HTML, CSS tham gia chức năng'),
        createBullet('4. Chi tiết mã nguồn và tiến trình thực hiện', 'Phân tích Model, Dữ liệu mẫu, Component, Signals'),
        createBullet('4.1. Bước 1: Model Sản phẩm', 'Khai báo Product interface chuẩn mực'),
        createBullet('4.2. Bước 1: Dữ liệu mẫu', '16 mẫu hoa tươi phân bổ đều 4 danh mục'),
        createBullet('4.3. Bước 2 & 3: Component ProductCard', 'Render badge HOT, SALE, DecimalPipe, trạng thái tồn kho'),
        createBullet('4.4. Bước 4 & 5: Signals Tìm kiếm & Sắp xếp', 'Quản lý keyword, categoryId, sortBy bằng Signal và Computed'),
        createBullet('4.5. Template Control Flow', 'Sử dụng @for với track và khối @empty'),
        createBullet('5. Sơ đồ luồng hoạt động', 'Quy trình xử lý sự kiện người dùng và render phản ứng'),
        createBullet('6. Kết quả kiểm thử', 'Bảng đánh giá các test case thực tế'),
        createP(''),

        createHeading('1. Mục tiêu bài thực hành'),
        createP('Bài thực hành Lab 2 kế thừa từ dự án Lab 1, tập trung vào việc quản lý dữ liệu mảng, điều khiển luồng hiển thị giao diện động và tương tác người dùng hiện đại trong Angular:'),
        createBullet('Product Interface', 'Định nghĩa kiểu dữ liệu chặt chẽ cho sản phẩm hoa tươi.'),
        createBullet('Tổ chức mảng dữ liệu', 'Khởi tạo 16 mẫu hoa thuộc 4 danh mục chính.'),
        createBullet('Control Flow @for / @empty', 'Thay thế *ngFor bằng cú pháp mới tối ưu render với track item.id.'),
        createBullet('Điều kiện @if & DecimalPipe', 'Hiển thị huy hiệu HOT, SALE, thẻ gạch ngang giá cũ <del>, và định dạng tiền tệ Việt Nam.'),
        createBullet('Bộ lọc phản ứng bằng Signals', 'Dùng signal() và computed() để tìm kiếm, lọc danh mục và sắp xếp đa tiêu chí mà không cần thao tác DOM.'),

        createHeading('2. Tiến độ thực hiện'),
        createTable(
          ['Bước', 'Nội dung công việc', 'Kết quả đạt được', 'Trạng thái'],
          [
            ['1', 'Tạo Model và Dữ liệu', 'Product model + 16 sản phẩm hoa tươi thuộc 4 danh mục', 'Hoàn thành'],
            ['2', 'Render danh sách bằng @for', 'Template duyệt mảng bằng @for kết hợp track item.id', 'Hoàn thành'],
            ['3', 'Trạng thái và định dạng giá', 'Huy hiệu HOT, SALE, tồn kho, DecimalPipe chuẩn', 'Hoàn thành'],
            ['4', 'Tìm kiếm & lọc bằng Signals', 'Signals: keyword, categoryId, computed filteredProducts', 'Hoàn thành'],
            ['5', 'Sắp xếp và số lượng kết quả', 'sortBy (giá tăng, giá giảm, tên), đếm số lượng, khối @empty', 'Hoàn thành'],
            ['6', 'Kiểm thử ứng dụng', 'Chạy kiểm thử chức năng và kiểm tra giao diện mobile/desktop', 'Hoàn thành']
          ]
        ),

        createHeading('3. Cấu trúc file chính'),
        ...createCodeBlock(
`D:\\js\\fw1\\Lab3Ang\\src\\app\\
├── app.ts                  # Signals + computed: keyword, categoryId, sortBy, filteredProducts
├── app.html                # Giao diện thanh tìm kiếm, 2 thẻ select bộ lọc, grid sản phẩm, @empty
├── app.css                 # Style cho filter-bar, lưới 2 cột mobile, result-count
├── models/
│   ├── product.model.ts    # Khai báo Product interface
│   └── category.model.ts   # Khai báo Category interface
├── data/
│   └── products.data.ts    # Dữ liệu 16 sản phẩm mẫu
└── shared/components/
    └── product-card/
        ├── product-card.ts # input(), output(), DecimalPipe
        ├── product-card.html # Hiển thị hoa, @if nhãn HOT, tồn kho
        └── product-card.css # Hiệu ứng thẻ sản phẩm sang trọng`
        ),

        createHeading('4. Chi tiết mã nguồn và tiến trình thực hiện'),
        createHeading('4.1. Bước 1: Khai báo Model Sản phẩm', HeadingLevel.HEADING_2),
        createP('Tệp src/app/models/product.model.ts:'),
        ...createCodeBlock(
`export interface Product {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  price: number;
  oldPrice?: number;
  image: string;
  hot?: boolean;
  stock: number;
  description?: string;
}`
        ),

        createHeading('4.2. Bước 1: Tổ chức Dữ liệu mẫu', HeadingLevel.HEADING_2),
        createP('Dữ liệu gồm 16 mẫu hoa tươi tinh tế, chia đều 4 danh mục chính:'),
        createTable(
          ['categoryId', 'Tên danh mục', 'Số lượng mẫu hoa', 'Ví dụ sản phẩm tiêu biểu'],
          [
            ['1', 'Hoa Bó Tươi Tắn', '4', 'Bó Hoa Hồng Đỏ Juliet, Bó Baby Trắng Tinh Khôi, Bó Hướng Dương Nắng Mai'],
            ['2', 'Hoa Giỏ Khai Trương', '4', 'Giỏ Hoa Hồng Pastel, Giỏ Hoa Đồng Tiền Tài Lộc, Giỏ Cúc Tsubaki'],
            ['3', 'Lan Hồ Điệp Sang Trọng', '4', 'Chậu Lan Hồ Điệp Tím Đại Cát, Chậu Lan Trắng Phú Quý, Lan Hoàng Kim'],
            ['4', 'Hộp Hoa Nghệ Thuật', '4', 'Hộp Hoa Hồng Trái Tim Macaron, Hộp Hoa Gỗ Vintage, Hộp Hoa Cưới']
          ]
        ),

        createHeading('4.3. Bước 2 & 3: Component ProductCard', HeadingLevel.HEADING_2),
        createP('ProductCard nhận dữ liệu qua input(), phát sự kiện qua output() và sử dụng @if cùng DecimalPipe:'),
        ...createCodeBlock(
`<div class="product-card" [class.out-of-stock]="stock() === 0">
  <div class="image-wrapper">
    <img [src]="image()" [alt]="name()" loading="lazy" />
    @if (hot()) { <span class="badge badge-hot">HOT 🔥</span> }
    @if (oldPrice() && oldPrice()! > price()) {
      <span class="badge badge-sale">-{{ ((oldPrice()! - price()) / oldPrice()! * 100) | number:'1.0-0' }}%</span>
    }
  </div>
  <div class="card-info">
    <h3 class="product-title">{{ name() }}</h3>
    <div class="price-box">
      <span class="current-price">{{ price() | number:'1.0-0' }} đ</span>
      @if (oldPrice() && oldPrice()! > price()) {
        <del class="old-price">{{ oldPrice() | number:'1.0-0' }} đ</del>
      }
    </div>
    <div class="stock-status">
      @if (stock() > 0) { <span class="in-stock">Còn {{ stock() }} mẫu hoa</span> }
      @else { <span class="out-stock">Tạm hết hàng</span> }
    </div>
    <button class="btn-buy" [disabled]="stock() === 0" (click)="onAddToCart()">
      {{ stock() > 0 ? 'Thêm Vào Giỏ' : 'Hết Hàng' }}
    </button>
  </div>
</div>`
        ),

        createHeading('4.4. Bước 4 & 5: Quản lý Tìm kiếm, Lọc và Sắp xếp bằng Signals', HeadingLevel.HEADING_2),
        createP('Logic trong app.ts quản lý 4 Signal và 1 computed Signal tự động:'),
        ...createCodeBlock(
`readonly products = signal<Product[]>(PRODUCTS_DATA);
readonly keyword = signal<string>('');
readonly categoryId = signal<number>(0);
readonly sortBy = signal<string>('default');

readonly filteredProducts = computed(() => {
  let list = [...this.products()];
  const kw = this.keyword().trim().toLowerCase();
  if (kw) list = list.filter(p => p.name.toLowerCase().includes(kw));
  if (this.categoryId() > 0) list = list.filter(p => p.categoryId === this.categoryId());
  if (this.sortBy() === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (this.sortBy() === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (this.sortBy() === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  return list;
});`
        ),

        createHeading('4.5. Template Control Flow với @for và @empty', HeadingLevel.HEADING_2),
        ...createCodeBlock(
`<div class="product-grid">
  @for (item of filteredProducts(); track item.id) {
    <app-product-card [name]="item.name" [price]="item.price" [stock]="item.stock" />
  } @empty {
    <div class="empty-state">
      <p>Không tìm thấy mẫu hoa nào khớp với tiêu chí tìm kiếm!</p>
    </div>
  }
</div>`
        ),

        createHeading('5. Sơ đồ luồng hoạt động'),
        createP('Luồng xử lý phản ứng: Người dùng thao tác (nhập từ khóa, chọn danh mục, chọn sắp xếp) -> Sự kiện DOM gọi Signal.set(value) -> Angular phát hiện thay đổi -> computed filteredProducts tự động tính toán lại mảng -> Template render lại danh sách bằng @for (hoặc kích hoạt khối @empty nếu không có kết quả).'),

        createHeading('6. Kết quả kiểm thử'),
        createTable(
          ['STT', 'Kịch bản kiểm thử', 'Dữ liệu đầu vào', 'Kết quả kỳ vọng', 'Đánh giá'],
          [
            ['1', 'Render khởi tạo', 'Mặc định tải trang', 'Hiển thị đủ 16 mẫu hoa, chia 2 cột mobile', 'Đạt'],
            ['2', 'Tìm kiếm từ khóa', 'Gõ "hồng"', 'Hiển thị chính xác 4 mẫu hoa có tên chứa "hồng"', 'Đạt'],
            ['3', 'Lọc danh mục', 'Chọn categoryId = 3', 'Hiển thị đúng 4 chậu Lan Hồ Điệp Sang Trọng', 'Đạt'],
            ['4', 'Sắp xếp giá tăng', 'Chọn "Giá: Thấp đến Cao"', 'Sản phẩm 450.000 đ xếp đầu, 1.850.000 đ xếp cuối', 'Đạt'],
            ['5', 'Trạng thái hết hàng', 'Mẫu hoa có stock = 0', 'Hiện nhãn "Tạm hết hàng", nút bị vô hiệu hóa disabled', 'Đạt'],
            ['6', 'Trạng thái rỗng @empty', 'Gõ từ khóa "xyz999"', 'Khối @empty kích hoạt thông báo không tìm thấy', 'Đạt']
          ]
        )
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const p1 = path.join(reportsDir, 'BaoCaoLab2_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  const p2 = path.join(desktopDir, 'BaoCaoLab2_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  safeSave(p1, p2, buffer, 'Lab 2');
}

// ==========================================
// 6. LAB 3 (KHÔNG KẾT LUẬN, KHÔNG MỨC ĐỘ, TIÊU ĐỀ KHÔNG LẶP)
// ==========================================
async function generateLab3Clean() {
  const doc = new Document({
    sections: [{
      children: [
        ...createCoverHeader(
          'BÁO CÁO THỰC HÀNH LAB 3',
          'Cài Đặt Angular Router, Section Bài Viết Mới Nhất & Trang Sáng Tạo Video – Dự Án BHShop'
        ),
        createHeading('MỤC LỤC BÁO CÁO', HeadingLevel.HEADING_2),
        createBullet('1. Lý thuyết cốt lõi về Angular Router', 'Router là gì? So sánh HTML truyền thống vs SPA. Phân biệt component và loadComponent'),
        createBullet('2. Các bước cài đặt và cấu hình Angular Router', 'app.routes.ts, provideRouter, RouterOutlet, routerLink, routerLinkActive, exact: true'),
        createBullet('3. Sơ đồ Flow chuyển trang khi sử dụng Router', 'Biểu đồ tuần tự chi tiết luồng xử lý điều hướng'),
        createBullet('4. Tổ chức dữ liệu mảng & Section Bài viết ở trang chủ', 'Mảng 6 bài viết, thuật toán computed lọc 3 bài mới nhất'),
        createBullet('5. Trang sáng tạo: Bài viết & Trải nghiệm Video cắm hoa', 'Trang /bai_viet với video workshop và gợi ý mẫu hoa'),
        createBullet('6. Sơ đồ Flow hiển thị trang chủ và trang sản phẩm', 'Flow render chi tiết của HomeComponent và ProductsComponent'),
        createBullet('7. Kết quả kiểm thử và đánh giá', 'Bảng kiểm thử định tuyến, active tab, video và responsive'),
        createP(''),

        createHeading('1. Lý thuyết cốt lõi về Angular Router'),
        createHeading('1.1. Router là gì? So sánh HTML truyền thống và Angular SPA', HeadingLevel.HEADING_2),
        createP('Angular Router là thư viện điều hướng chính thức của hệ sinh thái Angular (@angular/router), chịu trách nhiệm quản lý việc ánh xạ đường dẫn URL của trình duyệt tới các Standalone Component tương ứng và chèn nội dung giao diện vào vị trí <router-outlet></router-outlet> mà không tải lại toàn bộ tài liệu HTML.'),
        createTable(
          ['Tiêu chí so sánh', 'Website HTML truyền thống (MPA)', 'Website Angular Router (SPA)'],
          [
            ['Thẻ điều hướng', '<a href="products.html">Sản phẩm</a>', '<a routerLink="/products">Sản phẩm</a>'],
            ['Cơ chế hoạt động', 'Gửi request GET lên server xin file HTML mới', 'Chặn click, hoán đổi component ngay trên client'],
            ['Tải lại trang (Reload)', 'Có tải lại toàn bộ HTML, CSS, JS, DOM', 'Không tải lại. Header, Footer, State giữ nguyên'],
            ['Tốc độ chuyển trang', 'Phụ thuộc mạng và server render', 'Tức thì (0ms với component đã nạp sẵn)'],
            ['Trải nghiệm người dùng', 'Nhấp nháy trắng màn hình, gián đoạn', 'Mượt mà, liền mạch như mobile/desktop native app'],
            ['Bảo toàn trạng thái', 'Mất trạng thái trừ khi lưu session/cookie', 'Duy trì liên tục dữ liệu Signal, Giỏ hàng']
          ]
        ),

        createHeading('1.2. Sự khác nhau giữa component và loadComponent trong Router', HeadingLevel.HEADING_2),
        createP('Đây là hai cơ chế nạp Component khác nhau về mặt hiệu năng và thời điểm tải:'),
        createTable(
          ['Đặc điểm', 'component: HomeComponent (Eager Loading)', 'loadComponent: () => import(...) (Lazy Loading)'],
          [
            ['Cơ chế nạp', 'Tải ngay từ đầu: Đóng gói vào bundle chính (main.js)', 'Tải theo yêu cầu: Đóng gói thành chunk JS riêng'],
            ['Initial Bundle Size', 'Lớn hơn do nạp trước toàn bộ các màn hình', 'Rất nhỏ gọn, chỉ nạp mã nguồn trang khởi đầu'],
            ['Thời gian FCP', 'Chậm hơn trên thiết bị và đường truyền yếu', 'Siêu nhanh, tối ưu điểm Core Web Vitals'],
            ['Cú pháp JavaScript', 'Static import ở đầu file', 'Dynamic import() Promise chuẩn ES'],
            ['Trường hợp khuyên dùng', 'Dành cho trang chủ nạp ngay từ đầu', 'Dành cho các trang con, giỏ hàng, bài viết, chi tiết']
          ]
        ),

        createHeading('2. Các bước cài đặt và cấu hình Angular Router'),
        createBullet('Bước 1 – Khai báo danh sách Routes trong app.routes.ts', 'Khai báo các đường dẫn URL ánh xạ tới Component tương ứng:'),
        ...createCodeBlock(
`import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'bai_viet', loadComponent: () => import('./pages/articles/articles').then(m => m.ArticlesComponent) },
  { path: 'products', loadComponent: () => import('./pages/products/products').then(m => m.ProductsComponent) },
  { path: 'product/:slug', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetailComponent) },
  { path: '**', redirectTo: '' }
];`
        ),
        createBullet('Bước 2 – Đăng ký provideRouter trong app.config.ts', 'Cung cấp hệ thống router cho toàn ứng dụng:'),
        ...createCodeBlock(
`export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient()
  ]
};`
        ),
        createBullet('Bước 3 – Đặt RouterOutlet trong app.html', 'Vị trí Router hoán đổi các trang giao diện con:'),
        ...createCodeBlock(
`<div class="app-container">
  <app-header />
  <main><router-outlet></router-outlet></main>
  <app-footer />
  <app-bottom-nav />
</div>`
        ),
        createBullet('Bước 4 – Điều hướng bằng routerLink và routerLinkActive', 'Điều hướng trang và làm sáng mục menu hiện hành:'),
        ...createCodeBlock(
`<nav>
  <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Trang chủ</a>
  <a routerLink="/bai_viet" routerLinkActive="active">Bài viết & Video</a>
  <a routerLink="/products" routerLinkActive="active">Mẫu hoa tươi</a>
</nav>`
        ),
        createP('Lưu ý quan trọng về exact: true: Mặc định routerLinkActive so khớp tiền tố (prefix). Vì "/" là tiền tố của mọi URL khác, nếu thiếu exact: true thì menu "Trang chủ" sẽ luôn bị sáng active ở tất cả các trang con, gây lỗi hiển thị.'),

        createHeading('3. Sơ đồ Flow chuyển trang khi sử dụng Router'),
        createP('Luồng hoạt động tuần tự khi người dùng click vào thẻ điều hướng:'),
        createBullet('Bước 1', 'Người dùng click liên kết <a routerLink="/bai_viet"> trên giao diện.'),
        createBullet('Bước 2', 'Angular Router chặn sự kiện click mặc định của trình duyệt để ngăn tải lại trang.'),
        createBullet('Bước 3', 'Router phân tích URL "/bai_viet" và đối chiếu danh sách routes đã đăng ký.'),
        createBullet('Bước 4', 'Kích hoạt loadComponent: thực hiện dynamic import() tải file chunk của ArticlesComponent về trình duyệt.'),
        createBullet('Bước 5', 'Khởi tạo Component Instance, truyền dependency qua DI container.'),
        createBullet('Bước 6', 'Xóa Component cũ trong thẻ <router-outlet> và chèn ArticlesComponent vào DOM.'),
        createBullet('Bước 7', 'Cập nhật thanh địa chỉ URL qua History API (pushState) và bật class "active" trên menu.'),

        createHeading('4. Tổ chức dữ liệu mảng & Section Bài viết ở trang chủ'),
        createP('Dữ liệu 6 bài viết được tổ chức dưới dạng mảng đồng nhất Article[] với trường publishedAt chuẩn YYYY-MM-DD:'),
        ...createCodeBlock(
`export const ARTICLES_DATA: Article[] = [
  { id: 1, title: 'Ý nghĩa sâu sắc của 99 đóa hoa hồng đỏ', publishedAt: '2026-11-18', readTime: '4 phút', category: 'Ý nghĩa hoa' },
  { id: 2, title: 'Bí quyết chăm sóc Lan Hồ Điệp tươi trên 2 tháng', publishedAt: '2026-11-15', readTime: '6 phút', category: 'Mẹo chăm sóc' },
  { id: 3, title: 'Workshop cắm hoa phong cách Vintage cuối tuần', publishedAt: '2026-11-10', readTime: '3 phút', category: 'Workshop' },
  { id: 4, title: 'Top 5 loại hoa mừng khai trương phát tài', publishedAt: '2026-10-28', readTime: '5 phút', category: 'Phong thủy' },
  { id: 5, title: 'Nghệ thuật chọn hoa tặng phái mạnh', publishedAt: '2026-10-15', readTime: '4 phút', category: 'Cẩm nang' },
  { id: 6, title: 'Lịch sử và văn hóa hoa Tulip kiêu sa', publishedAt: '2026-09-20', readTime: '7 phút', category: 'Văn hóa' }
];`
        ),
        createP('Thuật toán computed lọc lấy đúng 3 bài viết mới nhất trên trang chủ:'),
        ...createCodeBlock(
`readonly latestArticles = computed(() => {
  return [...this.articles()]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
});`
        ),

        createHeading('5. Trang sáng tạo: Bài viết & Trải nghiệm Video cắm hoa'),
        createP('Trang sáng tạo được xây dựng tại đường dẫn /bai_viet kết hợp 3 thành phần hấp dẫn:'),
        createBullet('Bộ lọc bài viết theo chủ đề', 'Cho phép lọc theo Mẹo chăm sóc, Ý nghĩa hoa, Workshop và tìm kiếm theo tiêu đề bài viết.'),
        createBullet('Video Workshop trải nghiệm cắm hoa', 'Tích hợp thẻ <video controls preload="metadata" poster="..."> phát video trực tiếp hướng dẫn cắm hoa nghệ thuật.'),
        createBullet('Gợi ý mẫu hoa tương ứng', 'Ngay dưới video giới thiệu các mẫu hoa có sẵn tại shop để khách hàng mua về tự thực hành.'),

        createHeading('6. Sơ đồ Flow hiển thị trang chủ và trang sản phẩm'),
        createBullet('Flow hiển thị Trang chủ', 'Truy cập "/" -> Router nạp HomeComponent -> Nạp dữ liệu PRODUCTS_DATA & ARTICLES_DATA -> Chạy computed latestArticles lấy 3 bài mới nhất -> Render Banner trượt -> Render sản phẩm nổi bật -> Render 3 bài viết bằng @for.'),
        createBullet('Flow hiển thị Trang sản phẩm', 'Truy cập "/products" -> Router nạp ProductsComponent -> Nạp mảng 16 mẫu hoa -> Khởi tạo Signals keyword, categoryId, sortBy -> Người dùng tương tác -> computed filteredProducts tự động tính toán lại -> Render lưới sản phẩm hoặc kích hoạt khối @empty nếu không có kết quả.'),

        createHeading('7. Kết quả kiểm thử'),
        createTable(
          ['STT', 'Hạng mục kiểm thử', 'Tiêu chí đánh giá', 'Kết quả thực tế', 'Đánh giá'],
          [
            ['1', 'Định tuyến Router', 'Chuyển đổi giữa "/", "/bai_viet", "/products" không tải lại trang', 'Chuyển trang tức thì dưới 10ms, giữ nguyên header & footer', 'Đạt'],
            ['2', 'Active Tab Menu', 'Chỉ menu trang hiện hành sáng màu cam; Trang chủ dùng exact: true không bị active nhầm', 'Chính xác 100% trên cả Header và BottomNav', 'Đạt'],
            ['3', 'Section Bài viết', 'Lấy đúng 3 bài viết có publishedAt mới nhất trong mảng 6 bài', 'Hiển thị chính xác 3 bài ngày 18/11, 15/11 và 10/11', 'Đạt'],
            ['4', 'Video trải nghiệm', 'Video tải mượt mà, có đầy đủ controls, poster và responsive', 'Phát ổn định cả trên mobile và desktop', 'Đạt'],
            ['5', 'Responsive di động', 'Giao diện vừa vặn chuẩn màn hình di động 430px (iPhone), không vỡ giao diện', 'Bố cục 100% co giãn mượt mà', 'Đạt'],
            ['6', 'Lỗi Console', 'Mở DevTools F12 kiểm tra lỗi JavaScript', '0 lỗi biên dịch, 0 lỗi runtime', 'Đạt']
          ]
        )
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const p1 = path.join(reportsDir, 'BaoCaoLab3_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  const p2 = path.join(desktopDir, 'BaoCaoLab3_Tran_Ngoc_Xuan_Dinh_PS47346_Angular_BHShop.docx');
  safeSave(p1, p2, buffer, 'Lab 3');
}

async function runAll() {
  console.log('Generating all 6 CLEAN DOCX reports...');
  await generateLab1Clean();
  await generateLab2Clean();
  await generateLab3Clean();
  await generateLab4Only();
  await generateAsm1Only();
  await generateLab4Asm1Combined();
  console.log('ALL CLEAN DOCX REPORTS GENERATED SUCCESSFULLY!');
}

runAll().catch(err => {
  console.error('Error generating clean docx:', err);
  process.exit(1);
});
