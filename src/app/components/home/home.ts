import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { Banner } from '../../models/banner';
import { Blog } from '../../models/blog';
import { HomeService } from '../../services/home.service';
import { CartService } from '../../services/cart.service';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private homeService = inject(HomeService);
  protected cartService = inject(CartService);

  // Trạng thái đang tải dữ liệu
  loading = signal<boolean>(true);

  // Danh sách Banner quảng cáo từ API
  banners = signal<Banner[]>([
    {
      id: 1,
      title: 'Trao hoa tươi, gửi yêu thương',
      slug: 'trao-hoa-tuoi-gui-yeu-thuong',
      subtitle: 'Ưu đãi đặc biệt đến 30%',
      image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&auto=format&fit=crop',
      buttonText: 'Khám phá ngay →',
      link: '/products',
      order: 1
    }
  ]);
  activeBannerIndex = signal<number>(0);

  // 1. DỮ LIỆU SẢN PHẨM LOAD TỪ BACKEND API
  newProducts = signal<Product[]>([]);
  saleProducts = signal<Product[]>([]);
  bestSellingProducts = signal<Product[]>([]);

  // 2. DỮ LIỆU BÀI VIẾT LOAD TỪ BACKEND API
  articles = signal<Blog[]>([]);

  // Computed lấy 3 bài viết mới nhất
  latestArticles = computed(() => this.articles().slice(0, 3));

  ngOnInit(): void {
    this.loadHomeData();
  }

  // Gọi API tổng hợp trang chủ: GET /api/home
  loadHomeData(): void {
    this.loading.set(true);
    this.homeService.getHomeData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const { banners, newProducts, saleProducts, bestSellers, blogs } = response.data;
          if (banners && banners.length > 0) this.banners.set(banners);
          if (newProducts) this.newProducts.set(newProducts);
          if (saleProducts) this.saleProducts.set(saleProducts);
          if (bestSellers) this.bestSellingProducts.set(bestSellers);
          if (blogs) this.articles.set(blogs);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.warn('Backend chưa bật hoặc lỗi kết nối, kích hoạt dữ liệu dự phòng:', err.message);
        this.loadFallbackData();
        this.loading.set(false);
      }
    });
  }

  // Dữ liệu dự phòng khi chưa bật server backend
  private loadFallbackData(): void {
    this.newProducts.set([
      {
        id: 1,
        name: 'Bó hoa hồng Pastel 1 cành',
        slug: 'bo-hoa-hong-pastel-1-canh',
        price: '380.000đ',
        oldPrice: '-',
        image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500&auto=format&fit=crop',
        discount: 0,
        sold: 120,
        categoryId: 6,
        badge: 'Mới',
        badgeClass: 'label-new',
        createdAt: '2026-11-01'
      },
      {
        id: 2,
        name: 'Bó hoa Đồng Nội',
        slug: 'bo-hoa-dong-noi',
        price: '290.000đ',
        oldPrice: '-',
        image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&auto=format&fit=crop',
        discount: 0,
        sold: 85,
        categoryId: 4,
        badge: 'Mới',
        badgeClass: 'label-new',
        createdAt: '2026-11-02'
      },
      {
        id: 3,
        name: 'Hoa Tình Yêu Ngọt Ngào',
        slug: 'hoa-tinh-yeu-ngot-ngao',
        price: '420.000đ',
        oldPrice: '-',
        image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=500&auto=format&fit=crop',
        discount: 0,
        sold: 310,
        categoryId: 6,
        badge: 'Hot',
        badgeClass: 'label-hot',
        createdAt: '2026-11-03'
      },
      {
        id: 4,
        name: 'Giỏ Hoa Thanh Xuân',
        slug: 'gio-hoa-thanh-xuan',
        price: '390.000đ',
        oldPrice: '-',
        image: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=500&auto=format&fit=crop',
        discount: 0,
        sold: 45,
        categoryId: 2,
        badge: 'Mới',
        badgeClass: 'label-new',
        createdAt: '2026-11-04'
      }
    ]);

    this.saleProducts.set([
      {
        id: 5,
        name: 'Bó Hồng Đỏ Nồng Nàn',
        slug: 'bo-hong-do-nong-nan',
        price: '320.000đ',
        oldPrice: '400.000đ',
        image: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=500&auto=format&fit=crop',
        discount: 20,
        sold: 520,
        categoryId: 6,
        createdAt: '2026-11-05'
      },
      {
        id: 6,
        name: 'Hoa Sắc Màu Rực Rỡ',
        slug: 'hoa-sac-mau-ruc-ro',
        price: '300.000đ',
        oldPrice: '400.000đ',
        image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=500&auto=format&fit=crop',
        discount: 25,
        sold: 260,
        categoryId: 5,
        createdAt: '2026-11-06'
      },
      {
        id: 7,
        name: 'Bó Hoa Dịu Dàng',
        slug: 'bo-hoa-diu-dang',
        price: '255.000đ',
        oldPrice: '300.000đ',
        image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=500&auto=format&fit=crop',
        discount: 15,
        sold: 180,
        categoryId: 4,
        createdAt: '2026-11-07'
      },
      {
        id: 8,
        name: 'Giỏ Hoa Ngọt Ngào 2',
        slug: 'gio-hoa-ngot-ngao-2',
        price: '350.000đ',
        oldPrice: '500.000đ',
        image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&auto=format&fit=crop',
        discount: 30,
        sold: 410,
        categoryId: 3,
        createdAt: '2026-11-08'
      }
    ]);

    this.articles.set([
      {
        id: 1,
        title: 'Bí quyết giữ hoa hồng tươi lâu đến 2 tuần trong phòng khách',
        slug: 'bi-quyet-giu-hoa-hong-tuoi-lau-den-2-tuan',
        summary: 'Những mẹo đơn giản từ cắt vát gốc 45 độ, pha nước ấm với chút đường và chanh...',
        content: '',
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
        summary: 'Hoa hướng dương thể hiện niềm tin, cẩm tú cầu biểu trưng cho lòng biết ơn...',
        content: '',
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
        summary: 'Từng bước chọn hoa hồng trắng, baby và kỹ thuật xoắn cành spiral technique chuẩn châu Âu...',
        content: '',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop',
        category: 'Trải nghiệm video',
        author: 'Master Florist Hoàng An',
        createdAt: '2026-11-09',
        readTime: '6 phút xem',
        views: 940,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: '06:45'
      }
    ]);
  }

  // Chức năng Mua hàng (lưu vào LocalStorage qua CartService)
  buyProduct(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(product);
  }

  // Chọn banner
  setBanner(index: number): void {
    this.activeBannerIndex.set(index);
  }
}
