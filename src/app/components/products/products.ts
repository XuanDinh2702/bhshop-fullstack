import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';

@Component({
  imports: [RouterLink],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  protected cartService = inject(CartService);

  // Danh sách danh mục từ API
  categories = signal<Category[]>([]);
  
  // Danh sách sản phẩm từ API
  products = signal<Product[]>([]);

  // Slug danh mục đang chọn (mặc định 'tat-ca')
  currentCategorySlug = signal<string>('tat-ca');
  
  // Từ khóa tìm kiếm nếu có
  currentSearch = signal<string>('');

  // Kiểu sắp xếp (newest, bestseller, sale, price-asc, price-desc)
  currentSort = signal<string>('newest');

  // Trạng thái tải dữ liệu
  loading = signal<boolean>(true);

  ngOnInit(): void {
    // 1. Tải danh sách danh mục hoa từ API
    this.loadCategories();

    // 2. Bắt tham số động trên URL bằng ActivatedRoute:
    // Theo slug (/category/:slug) và theo query param (?search=...)
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || 'tat-ca';
      this.currentCategorySlug.set(slug);

      this.route.queryParamMap.subscribe(queryParams => {
        const search = queryParams.get('search') || '';
        this.currentSearch.set(search);
        this.loadProducts();
      });
    });
  }

  // Tải danh mục hoa từ Backend API
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => {
        // Fallback danh mục nếu backend chưa bật
        this.categories.set([
          { id: 1, name: 'Tất cả', slug: 'tat-ca', order: 1, icon: '🌸' },
          { id: 2, name: 'Hoa chúc mừng', slug: 'hoa-chuc-mung', order: 2, icon: '🎉' },
          { id: 3, name: 'Hoa cưới', slug: 'hoa-cuoi', order: 3, icon: '💍' },
          { id: 4, name: 'Hoa sinh nhật', slug: 'hoa-sinh-nhat', order: 4, icon: '🎂' },
          { id: 5, name: 'Hoa khai trương', slug: 'hoa-khai-truong', order: 5, icon: '🏢' },
          { id: 6, name: 'Hoa tình yêu', slug: 'hoa-tinh-yeu', order: 6, icon: '❤️' }
        ]);
      }
    });
  }

  // Tải sản phẩm theo danh mục và từ khóa từ Backend API
  loadProducts(): void {
    this.loading.set(true);
    const filter = {
      categorySlug: this.currentCategorySlug(),
      search: this.currentSearch(),
      sort: this.currentSort()
    };

    this.productService.getProducts(filter).subscribe({
      next: (prods) => {
        this.products.set(prods);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  // Thay đổi kiểu sắp xếp
  onSortChange(sort: string): void {
    this.currentSort.set(sort);
    this.loadProducts();
  }

  // Thêm vào giỏ hàng (lưu LocalStorage)
  buyProduct(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(product);
  }
}
