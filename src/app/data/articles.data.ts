import { Article } from '../models/article';

export const ARTICLES_DATA: Article[] = [
  {
    id: 1,
    title: 'Bí quyết giữ hoa hồng tươi lâu đến 2 tuần trong phòng khách',
    slug: 'bi-quyet-giu-hoa-hong-tuoi-lau-den-2-tuan',
    summary: 'Những mẹo đơn giản từ cắt vát gốc 45 độ, pha nước ấm với chút đường và chanh giúp cành hoa luôn tràn đầy sức sống.',
    content: `Hoa hồng mang lại vẻ đẹp quý phái và lãng mạn cho không gian sống. Tuy nhiên, nếu không biết cách chăm sóc, hoa rất nhanh tàn chỉ sau 2-3 ngày.

Dưới đây là 4 bí quyết được chia sẻ từ nghệ nhân cắm hoa BHShop:
1. Cắt tỉa cành đúng kỹ thuật: Dùng kéo thật bén cắt vát 45 độ dưới vòi nước chảy để tránh không khí lọt vào ống dẫn mao mạch.
2. Nước cắm hoa dinh dưỡng: Pha 1/2 muỗng cà phê đường cùng 2-3 giọt nước cốt chanh vào nước ấm (khoảng 35-40°C). Đường cung cấp dinh dưỡng, còn chanh cân bằng độ pH và hạn chế vi khuẩn.
3. Vị trí đặt bình hoa: Đặt ở nơi thoáng mát, tránh quạt gió thổi trực tiếp, tránh ánh nắng gắt và tránh xa các giỏ trái cây chín.
4. Thay nước định kỳ: Thay nước bình hoa mỗi ngày một lần vào buổi sáng sớm và tỉa bớt các lá úng dưới gốc.`,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
    category: 'Mẹo cắm hoa',
    author: 'Florist Linh Trang',
    createdAt: '2026-11-11',
    readTime: '3 phút đọc',
    views: 412,
    featured: true
  },
  {
    id: 2,
    title: 'Ý nghĩa sâu sắc của 5 loài hoa phổ biến trong lễ tốt nghiệp',
    slug: 'y-nghia-sau-sac-cua-5-loai-hoa-pho-bien-trong-le-tot-nghiep',
    summary: 'Hoa hướng dương thể hiện niềm tin, cẩm tú cầu biểu trưng cho lòng biết ơn, còn hoa baby trắng nói lên sự khởi đầu trong trẻo.',
    content: `Lễ tốt nghiệp là cột mốc trưởng thành quan trọng của mỗi sinh viên. Bó hoa trao tay trong ngày này không chỉ là lời chúc mừng mà còn gửi gắm những lời chúc phúc tương lai:

- Hoa Hướng Dương: Tượng trưng cho ý chí kiên định, sự lạc quan và khát vọng vươn lên đón ánh mặt trời thành công.
- Hoa Hồng Pastel: Lời chúc ngọt ngào, tinh tế và trân trọng những nỗ lực trong suốt những năm tháng giảng đường.
- Hoa Cẩm Tú Cầu: Biểu tượng của sự tròn đầy, viên mãn và lời cảm ơn chân thành gửi đến thầy cô, cha mẹ.
- Hoa Baby Trắng: Tượng trưng cho vẻ đẹp tinh khôi, sự trong sáng của tuổi trẻ và những ước mơ hoài bão.
- Hoa Cát Tường: Lời chúc vạn sự như ý, may mắn và hanh thông trên con đường sự nghiệp sắp tới.`,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop',
    category: 'Ý nghĩa hoa',
    author: 'Orange Bloom Team',
    createdAt: '2026-11-10',
    readTime: '4 phút đọc',
    views: 580,
    featured: false
  },
  {
    id: 3,
    title: '[Video] Hướng dẫn tự tay bó hoa cưới cầm tay dáng tròn thanh lịch',
    slug: 'huong-dan-tu-tay-bo-hoa-cuoi-cam-tay-dang-tron-thanh-lich',
    summary: 'Từng bước chọn hoa hồng trắng, baby và kỹ thuật xoắn cành spiral technique chuẩn châu Âu trong video thực tế.',
    content: `Tự tay tạo nên bó hoa cưới cho chính ngày trọng đại của bản thân hoặc làm quà cưới cho người bạn thân là trải nghiệm vô cùng ý nghĩa và đáng nhớ.

Trong video hướng dẫn này, Master Florist Hoàng An sẽ chia sẻ:
- Chuẩn bị nguyên liệu: 15 cành hồng kem pastel, 1 bó baby trắng Hà Lan, ruy băng lụa cao cấp và băng keo sáp chuyên dụng.
- Kỹ thuật xoắn cành Spiral: Đặt các cành hoa theo góc nghiêng một chiều để tạo dáng tròn đều, giúp bó hoa tự đứng vững.
- Bọc nơ trang trí: Thắt nơ đôi sang trọng che đi phần băng keo cố định.
- Bảo quản bó hoa: Giữ hoa trong phòng điều hòa nhiệt độ 22-24°C trước giờ làm lễ.`,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop',
    category: 'Trải nghiệm video',
    author: 'Master Florist Hoàng An',
    createdAt: '2026-11-09',
    readTime: '6 phút xem',
    views: 940,
    featured: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '06:45'
  },
  {
    id: 4,
    title: 'Top 5 loài hoa để bàn mang lại tài lộc và bình an cho góc làm việc',
    slug: 'top-5-loai-hoa-de-ban-mang-lai-tai-loc-va-binh-an',
    summary: 'Khám phá những loài hoa tươi giúp giải tỏa căng thẳng công việc, thanh lọc năng lượng tích cực và kích thích tư duy sáng tạo.',
    content: `Không gian làm việc có một lọ hoa tươi nho nhỏ sẽ giúp tăng 30% hiệu suất làm việc và giải tỏa căng thẳng hiệu quả:

1. Hoa Lan Hồ Điệp mini: Sang trọng, quý phái và giữ độ tươi cực lâu (lên đến hơn 1 tháng).
2. Hoa Cúc Tana: Những bông hoa bé xinh tựa ánh nắng nhỏ ban mai, tạo cảm giác mộc mạc, bình yên.
3. Hoa Sen Đá: Sức sống mãnh liệt, biểu tượng của sự kiên cường và thịnh vượng bền vững.
4. Hoa Đồng Tiền: Mang ý nghĩa phát tài phát lộc, thu hút may mắn trong các dự án mới.
5. Hoa Oải Hương (Lavender): Hương thơm dịu dàng tự nhiên giúp xua tan áp lực deadline.`,
    image: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=800&auto=format&fit=crop',
    category: 'Cẩm nang hoa',
    author: 'Minh Thảo Flower',
    createdAt: '2026-11-06',
    readTime: '3 phút đọc',
    views: 310,
    featured: false
  },
  {
    id: 5,
    title: '[Video] Trải nghiệm Workshop cắm hoa nghệ thuật cuối tuần tại BHShop Studio',
    slug: 'trai-nghiem-workshop-cam-hoa-nghe-thuat-cuoi-tuan',
    summary: 'Cùng hòa mình vào không gian ngập tràn sắc hoa và tự tay sáng tạo giỏ hoa tone màu pastel dịu dàng.',
    content: `Cuối tuần qua, buổi Workshop 'Giai Điệu Hương Sắc' đã diễn ra vô cùng thành công với sự tham gia của đông đảo các bạn yêu hoa tại TP.HCM.

Tham gia workshop, bạn sẽ nhận được:
- Trọn bộ dụng cụ cắm hoa và hoa tươi cao cấp chuẩn bị sẵn.
- Được nghệ nhân hướng dẫn trực tiếp từng thao tác phối màu và định hình bố cục.
- Thưởng thức trà bánh ấm cúng và mang thành phẩm giỏ hoa xinh xắn về nhà.

Mời bạn cùng xem lại những thước phim tràn đầy cảm xúc trong video này!`,
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&auto=format&fit=crop',
    category: 'Trải nghiệm video',
    author: 'BHShop Studio',
    createdAt: '2026-11-03',
    readTime: '4 phút xem',
    views: 730,
    featured: false,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '04:15'
  },
  {
    id: 6,
    title: 'Gợi ý chọn hoa kỷ niệm ngày yêu theo từng cột mốc ý nghĩa',
    slug: 'goi-y-chon-hoa-ky-niem-ngay-yeu-theo-tung-cot-moc-y-nghia',
    summary: 'Mỗi năm bên nhau là một dấu ấn tình yêu thiêng liêng. Hãy để bó hoa tươi thay lời thì thầm ngọt ngào gửi gắm đến người ấy.',
    content: `Tình yêu theo thời gian lại mang những cung bậc cảm xúc khác nhau:

- Năm thứ 1 - Khởi đầu nồng nàn: Bó hoa hồng phấn phối baby trong trẻo, e ấp như những rung động đầu tiên.
- Năm thứ 3 - Thấu hiểu gắn kết: Hoa Tulip đỏ rực hoặc cẩm tú cầu tượng trưng cho sự gắn bó và tôn trọng lẫn nhau.
- Năm thứ 5 - Son sắt vẹn nguyên: 99 đóa hồng đỏ tươi thắm tượng trưng cho tình yêu vĩnh cửu không phai tàn.
- Kỷ niệm ngày cưới: Giỏ hoa tone pastel kết hợp hoa mẫu đơn và lan hồ điệp trang nhã, đủ đầy hạnh phúc.`,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop',
    category: 'Xu hướng quà tặng',
    author: 'Florist Linh Trang',
    createdAt: '2026-10-28',
    readTime: '3 phút đọc',
    views: 460,
    featured: false
  }
];
