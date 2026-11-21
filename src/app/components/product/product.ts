import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';

@Component({
  imports: [RouterLink],
  selector: 'app-product',
  styleUrl: './product.css',
  templateUrl: './product.html',
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  protected cartService = inject(CartService);

  // Chi tiết sản phẩm hiện tại
  product = signal<Product | null>(null);

  // Số lượng chọn mua
  quantity = signal<number>(1);

  // Danh sách sản phẩm liên quan
  relatedProducts = signal<Product[]>([]);

  // Trạng thái tải
  loading = signal<boolean>(true);

  ngOnInit(): void {
    // Lắng nghe slug trên URL: /product/:slug
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProductDetail(slug);
      }
    });
  }

  // Tải chi tiết sản phẩm theo Slug từ API
  loadProductDetail(slug: string): void {
    this.loading.set(true);
    this.quantity.set(1);

    this.productService.getProductBySlug(slug).subscribe({
      next: (prod) => {
        this.product.set(prod);
        this.loading.set(false);
        this.loadRelatedProducts(prod.categorySlug || 'tat-ca');
      },
      error: () => {
        // Fallback chi tiết nếu backend chưa bật
        this.product.set({
          id: 1,
          name: 'Bó Hoa Hồng Pastel Ngọt Ngào',
          slug: 'bo-hoa-hong-pastel-ngot-ngao',
          price: '380.000đ',
          priceNumber: 380000,
          oldPrice: '450.000đ',
          discount: 15,
          sold: 120,
          categoryId: 6,
          image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&auto=format&fit=crop',
          description: 'Bó hoa hồng pastel phối cùng hoa baby trắng tinh khôi, biểu trưng cho tình yêu thuần khiết và sự trân trọng. Phù hợp tặng sinh nhật, kỷ niệm hoặc chúc mừng.',
          createdAt: '2026-11-01',
          badge: 'Mới',
          badgeClass: 'label-new'
        });
        this.loading.set(false);
      }
    });
  }

  // Tải sản phẩm liên quan
  loadRelatedProducts(categorySlug: string): void {
    this.productService.getProducts({ categorySlug, limit: 3 }).subscribe({
      next: (prods) => {
        const currentId = this.product()?.id;
        this.relatedProducts.set(prods.filter(p => p.id !== currentId).slice(0, 3));
      }
    });
  }

  // Tăng số lượng
  increaseQty(): void {
    this.quantity.update(q => q + 1);
  }

  // Giảm số lượng
  decreaseQty(): void {
    this.quantity.update(q => (q > 1 ? q - 1 : 1));
  }

  // Thêm vào giỏ
  addToCart(): void {
    const prod = this.product();
    if (prod) {
      this.cartService.addToCart(prod, this.quantity());
    }
  }

  // Mua ngay (thêm vào giỏ rồi chuyển thẳng sang trang /cart)
  buyNow(): void {
    const prod = this.product();
    if (prod) {
      this.cartService.addToCart(prod, this.quantity());
      this.router.navigate(['/cart']);
    }
  }
}

export { ProductComponent as Product };
