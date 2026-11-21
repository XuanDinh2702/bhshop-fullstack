const Category = require('../models/category.model');
const Product = require('../models/product.model');
const Blog = require('../models/blog.model');
const Banner = require('../models/banner.model');

const categoriesSeed = [
  { id: 1, name: 'Tất cả', slug: 'tat-ca', order: 1, icon: '🌸' },
  { id: 2, name: 'Hoa chúc mừng', slug: 'hoa-chuc-mung', order: 2, icon: '🎉' },
  { id: 3, name: 'Hoa cưới', slug: 'hoa-cuoi', order: 3, icon: '💍' },
  { id: 4, name: 'Hoa sinh nhật', slug: 'hoa-sinh-nhat', order: 4, icon: '🎂' },
  { id: 5, name: 'Hoa khai trương', slug: 'hoa-khai-truong', order: 5, icon: '🏢' },
  { id: 6, name: 'Hoa tình yêu', slug: 'hoa-tinh-yeu', order: 6, icon: '❤️' }
];

const bannersSeed = [
  {
    id: 1,
    title: 'Trao hoa tươi, gửi yêu thương',
    slug: 'trao-hoa-tuoi-gui-yeu-thuong',
    subtitle: 'Ưu đãi đặc biệt đến 30%',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&auto=format&fit=crop',
    buttonText: 'Khám phá ngay →',
    link: '/products',
    order: 1
  },
  {
    id: 2,
    title: 'Một bó hoa, ngàn lời yêu',
    slug: 'mot-bo-hoa-ngan-loi-yeu',
    subtitle: 'Miễn phí thiệp chúc mừng & banner',
    image: 'https://images.unsplash.com/photo-1494336934272-f0efcedfc8a9?w=900&auto=format&fit=crop',
    buttonText: 'Xem bộ sưu tập →',
    link: '/category/hoa-tinh-yeu',
    order: 2
  },
  {
    id: 3,
    title: 'Hoa tươi trao tận tay',
    slug: 'hoa-tuoi-trao-tan-tay',
    subtitle: 'Giao nhanh trong 60 phút nội thành',
    image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=900&auto=format&fit=crop',
    buttonText: 'Đặt hoa ngay →',
    link: '/products',
    order: 3
  }
];

const productsSeed = [
  {
    id: 1,
    name: 'Bó hoa hồng Pastel 1 cành',
    slug: 'bo-hoa-hong-pastel-1-canh',
    price: '380.000đ',
    priceNumber: 380000,
    oldPrice: '-',
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500&auto=format&fit=crop',
    discount: 0,
    sold: 120,
    categoryId: 6,
    categorySlug: 'hoa-tinh-yeu',
    description: 'Bó hoa hồng pastel tinh tế, nhẹ nhàng và lãng mạn thích hợp tặng người yêu trong các dịp đặc biệt.',
    badge: 'Mới',
    badgeClass: 'label-new',
    createdAt: '2026-11-01'
  },
  {
    id: 2,
    name: 'Bó hoa Đồng Nội',
    slug: 'bo-hoa-dong-noi',
    price: '290.000đ',
    priceNumber: 290000,
    oldPrice: '-',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&auto=format&fit=crop',
    discount: 0,
    sold: 85,
    categoryId: 4,
    categorySlug: 'hoa-sinh-nhat',
    description: 'Hòa quyện sắc màu hoa đồng nội tự nhiên, đem lại cảm giác mộc mạc và thanh bình.',
    badge: 'Mới',
    badgeClass: 'label-new',
    createdAt: '2026-11-02'
  },
  {
    id: 3,
    name: 'Hoa Tình Yêu Ngọt Ngào',
    slug: 'hoa-tinh-yeu-ngot-ngao',
    price: '420.000đ',
    priceNumber: 420000,
    oldPrice: '-',
    image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=500&auto=format&fit=crop',
    discount: 0,
    sold: 310,
    categoryId: 6,
    categorySlug: 'hoa-tinh-yeu',
    description: 'Tone hồng ngọt ngào tượng trưng cho tình yêu chân thành và thấu hiểu.',
    badge: 'Hot',
    badgeClass: 'label-hot',
    createdAt: '2026-11-03'
  },
  {
    id: 4,
    name: 'Giỏ Hoa Thanh Xuân',
    slug: 'gio-hoa-thanh-xuan',
    price: '390.000đ',
    priceNumber: 390000,
    oldPrice: '-',
    image: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=500&auto=format&fit=crop',
    discount: 0,
    sold: 45,
    categoryId: 2,
    categorySlug: 'hoa-chuc-mung',
    description: 'Giỏ hoa tone vàng cam tươi sáng rạng ngời như lứa tuổi thanh xuân đẹp nhất.',
    badge: 'Mới',
    badgeClass: 'label-new',
    createdAt: '2026-11-04'
  },
  {
    id: 5,
    name: 'Bó Hồng Đỏ Nồng Nàn',
    slug: 'bo-hong-do-nong-nan',
    price: '320.000đ',
    priceNumber: 320000,
    oldPrice: '400.000đ',
    image: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=500&auto=format&fit=crop',
    discount: 20,
    sold: 520,
    categoryId: 6,
    categorySlug: 'hoa-tinh-yeu',
    description: 'Hồng đỏ Ecuador nhập khẩu rực rỡ, biểu tượng mãnh liệt của tình yêu son sắt.',
    badge: '-20%',
    badgeClass: 'label-sale',
    createdAt: '2026-11-05'
  },
  {
    id: 6,
    name: 'Hoa Sắc Màu Rực Rỡ',
    slug: 'hoa-sac-mau-ruc-ro',
    price: '300.000đ',
    priceNumber: 300000,
    oldPrice: '400.000đ',
    image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=500&auto=format&fit=crop',
    discount: 25,
    sold: 260,
    categoryId: 5,
    categorySlug: 'hoa-khai-truong',
    description: 'Phối màu tinh tế mang lại nguồn năng lượng bùng nổ, phù hợp tặng đối tác, chúc mừng sự kiện.',
    badge: '-25%',
    badgeClass: 'label-sale',
    createdAt: '2026-11-06'
  },
  {
    id: 7,
    name: 'Bó Hoa Dịu Dàng',
    slug: 'bo-hoa-diu-dang',
    price: '255.000đ',
    priceNumber: 255000,
    oldPrice: '300.000đ',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=500&auto=format&fit=crop',
    discount: 15,
    sold: 180,
    categoryId: 4,
    categorySlug: 'hoa-sinh-nhat',
    description: 'Tone tím pastel nền nã, mang nét đằm thắm và tinh khôi.',
    badge: '-15%',
    badgeClass: 'label-sale',
    createdAt: '2026-11-07'
  },
  {
    id: 8,
    name: 'Giỏ Hoa Ngọt Ngào 2',
    slug: 'gio-hoa-ngot-ngao-2',
    price: '350.000đ',
    priceNumber: 350000,
    oldPrice: '500.000đ',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&auto=format&fit=crop',
    discount: 30,
    sold: 410,
    categoryId: 3,
    categorySlug: 'hoa-cuoi',
    description: 'Giỏ hoa cúc mẫu đơn phối hồng kem cao cấp tạo điểm nhấn ấm áp.',
    badge: '-30%',
    badgeClass: 'label-sale',
    createdAt: '2026-11-08'
  },
  {
    id: 9,
    name: 'Kệ Hoa Khai Trương Phát Tài',
    slug: 'ke-hoa-khai-truong-phat-tai',
    price: '850.000đ',
    priceNumber: 850000,
    oldPrice: '1.000.000đ',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&auto=format&fit=crop',
    discount: 15,
    sold: 340,
    categoryId: 5,
    categorySlug: 'hoa-khai-truong',
    description: 'Kệ hoa khai trương sang trọng với tone hoa hướng dương vàng kim mang ý nghĩa hồng phát.',
    badge: '-15%',
    badgeClass: 'label-sale',
    createdAt: '2026-11-09'
  },
  {
    id: 10,
    name: 'Bó Hoa Cưới Cầm Tay Bạch Ngọc',
    slug: 'bo-hoa-cuoi-cam-tay-bach-ngoc',
    price: '680.000đ',
    priceNumber: 680000,
    oldPrice: '-',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&auto=format&fit=crop',
    discount: 0,
    sold: 150,
    categoryId: 3,
    categorySlug: 'hoa-cuoi',
    description: 'Bó hoa cưới dáng tròn châu Âu kết hợp hoa hồng trắng và hoa baby thuần khiết.',
    badge: 'VIP',
    badgeClass: 'label-hot',
    createdAt: '2026-11-10'
  }
];

const blogsSeed = [
  {
    id: 1,
    title: 'Bí quyết giữ hoa hồng tươi lâu đến 2 tuần trong phòng khách',
    slug: 'bi-quyet-giu-hoa-hong-tuoi-lau-den-2-tuan',
    summary: 'Những mẹo đơn giản từ cắt vát gốc 45 độ, pha nước ấm với chút đường và chanh giúp cành hoa luôn tràn đầy sức sống.',
    content: `Hoa hồng mang lại vẻ đẹp quý phái cho không gian sống. Để hoa tươi lâu:
1. Cắt vát cành 45 độ dưới vòi nước chảy.
2. Nước cắm hoa: pha thêm 1/2 muỗng đường và vài giọt chanh.
3. Tránh để hoa nơi có quạt gió mạnh hay gần hoa quả chín.
4. Thay nước định kỳ mỗi sáng sớm.`,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
    category: 'Mẹo cắm hoa',
    author: 'Florist Linh Trang',
    createdAt: '2026-11-11',
    readTime: '3 phút đọc',
    views: 412
  },
  {
    id: 2,
    title: 'Ý nghĩa sâu sắc của 5 loài hoa phổ biến trong lễ tốt nghiệp',
    slug: 'y-nghia-sau-sac-cua-5-loai-hoa-pho-bien-trong-le-tot-nghiep',
    summary: 'Hoa hướng dương thể hiện niềm tin, cẩm tú cầu biểu trưng cho lòng biết ơn, còn hoa baby trắng nói lên sự khởi đầu trong trẻo.',
    content: `Lễ tốt nghiệp là cột mốc trưởng thành quan trọng:
- Hoa Hướng Dương: Tượng trưng cho ý chí kiên định, luôn hướng về thành công.
- Hoa Hồng Pastel: Lời chúc ngọt ngào, tinh tế gửi tới bạn bè.
- Hoa Cẩm Tú Cầu: Lòng biết ơn chân thành gửi đến thầy cô và gia đình.
- Hoa Baby Trắng: Tuổi trẻ tinh khôi và những ước mơ rộng mở.`,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop',
    category: 'Ý nghĩa hoa',
    author: 'Orange Bloom Team',
    createdAt: '2026-11-10',
    readTime: '4 phút đọc',
    views: 580
  },
  {
    id: 3,
    title: '[Video] Hướng dẫn tự tay bó hoa cưới cầm tay dáng tròn thanh lịch',
    slug: 'huong-dan-tu-tay-bo-hoa-cuoi-cam-tay-dang-tron-thanh-lich',
    summary: 'Từng bước chọn hoa hồng trắng, baby và kỹ thuật xoắn cành spiral technique chuẩn châu Âu trong video thực tế.',
    content: `Tự tay làm một bó hoa cưới cho ngày trọng đại là trải nghiệm vô cùng ý nghĩa:
- Bước 1: Chuẩn bị 15 cành hồng kem pastel, 1 bó baby trắng và ruy băng lụa.
- Bước 2: Kỹ thuật xoắn cành spiral theo một chiều giúp bó hoa đứng vững.
- Bước 3: Thắt nơ đôi sang trọng và bảo quản trong nhiệt độ mát 22-24°C.`,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop',
    category: 'Trải nghiệm video',
    author: 'Master Florist Hoàng An',
    createdAt: '2026-11-09',
    readTime: '6 phút xem',
    views: 940,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '06:45'
  },
  {
    id: 4,
    title: 'Top 5 loài hoa để bàn mang lại tài lộc và bình an cho góc làm việc',
    slug: 'top-5-loai-hoa-de-ban-mang-lai-tai-loc-va-binh-an',
    summary: 'Khám phá những loài hoa tươi giúp giải tỏa căng thẳng công việc, thanh lọc năng lượng tích cực và kích thích tư duy sáng tạo.',
    content: `Đặt một bình hoa nhỏ trên bàn làm việc giúp tăng 30% hiệu suất làm việc:
1. Lan Hồ Điệp mini: Quý phái và tươi lâu trên 1 tháng.
2. Cúc Tana: Bình yên, xua tan căng thẳng deadline.
3. Hoa Sen Đá: Nghị lực kiên cường và bền bỉ.
4. Hoa Đồng Tiền: Thu hút tài lộc và may mắn.`,
    image: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=800&auto=format&fit=crop',
    category: 'Cẩm nang hoa',
    author: 'Minh Thảo Flower',
    createdAt: '2026-11-06',
    readTime: '3 phút đọc',
    views: 310
  },
  {
    id: 5,
    title: '[Video] Trải nghiệm Workshop cắm hoa nghệ thuật cuối tuần tại BHShop Studio',
    slug: 'trai-nghiem-workshop-cam-hoa-nghe-thuat-cuoi-tuan',
    summary: 'Cùng hòa mình vào không gian ngập tràn sắc hoa và tự tay sáng tạo giỏ hoa tone màu pastel dịu dàng.',
    content: `Workshop Chạm Vào Thiên Nhiên diễn ra vô cùng ấm cúng:
- Trải nghiệm không gian thơm ngát cùng trà hoa cúc ấm cúng.
- Tự tay phối màu và tạo nên tác phẩm giỏ hoa mang về tặng người thân.`,
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&auto=format&fit=crop',
    category: 'Trải nghiệm video',
    author: 'BHShop Studio',
    createdAt: '2026-11-03',
    readTime: '4 phút xem',
    views: 730,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '04:15'
  },
  {
    id: 6,
    title: 'Gợi ý chọn hoa kỷ niệm ngày yêu theo từng cột mốc ý nghĩa',
    slug: 'goi-y-chon-hoa-ky-niem-ngay-yeu-theo-tung-cot-moc-y-nghia',
    summary: 'Mỗi năm bên nhau là một dấu ấn tình yêu thiêng liêng. Hãy để bó hoa tươi thay lời thì thầm ngọt ngào gửi gắm đến người ấy.',
    content: `Tình yêu qua từng năm tháng lại mang những nét đẹp riêng:
- Năm thứ 1: Bó hoa hồng phấn e ấp như thuở ban đầu.
- Năm thứ 3: Hoa Tulip đỏ tượng trưng cho sự gắn bó và sẻ chia.
- Năm thứ 5: 99 bông hồng đỏ thắm minh chứng cho tình yêu vĩnh cửu.`,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop',
    category: 'Xu hướng quà tặng',
    author: 'Florist Linh Trang',
    createdAt: '2026-10-28',
    readTime: '3 phút đọc',
    views: 460
  }
];

// Hàm tự động seed dữ liệu khi khởi động server
const autoSeedData = async () => {
  try {
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Đang nạp dữ liệu mẫu cho Categories...');
      await Category.insertMany(categoriesSeed);
      console.log('✅ Đã nạp thành công Categories!');
    }

    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      console.log('🌱 Đang nạp dữ liệu mẫu cho Banners...');
      await Banner.insertMany(bannersSeed);
      console.log('✅ Đã nạp thành công Banners!');
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Đang nạp dữ liệu mẫu cho Products...');
      await Product.insertMany(productsSeed);
      console.log('✅ Đã nạp thành công Products!');
    }

    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('🌱 Đang nạp dữ liệu mẫu cho Blogs...');
      await Blog.insertMany(blogsSeed);
      console.log('✅ Đã nạp thành công Blogs!');
    }
  } catch (error) {
    console.error('❌ Lỗi khi auto-seed data:', error);
  }
};

module.exports = {
  categoriesSeed,
  bannersSeed,
  productsSeed,
  blogsSeed,
  autoSeedData
};
