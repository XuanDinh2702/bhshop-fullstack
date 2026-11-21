import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  protected router = inject(Router);
  protected cartService = inject(CartService);
  private productService = inject(ProductService);

  // Từ khóa tìm kiếm trên thanh Header
  searchKeyword = signal<string>('');
  
  // Kết quả tìm kiếm nhanh gợi ý
  searchResults = signal<Product[]>([]);
  isSearching = signal<boolean>(false);
  showDropdown = signal<boolean>(false);

  // Xử lý khi gõ vào ô tìm kiếm (Mức Khá: Gọi API /api/products?search=...)
  onSearchChange(keyword: string): void {
    this.searchKeyword.set(keyword);
    const query = keyword.trim();

    if (!query) {
      this.searchResults.set([]);
      this.showDropdown.set(false);
      return;
    }

    this.isSearching.set(true);
    this.showDropdown.set(true);

    this.productService.getProducts({ search: query, limit: 5 }).subscribe({
      next: (products) => {
        this.searchResults.set(products);
        this.isSearching.set(false);
      },
      error: () => {
        this.searchResults.set([]);
        this.isSearching.set(false);
      }
    });
  }

  // Khi nhấn phím Enter hoặc nút Tìm kiếm -> Chuyển sang trang Products với query param
  onSearchSubmit(event?: Event): void {
    if (event) event.preventDefault();
    const query = this.searchKeyword().trim();
    this.showDropdown.set(false);

    if (query) {
      this.router.navigate(['/products'], { queryParams: { search: query } });
    } else {
      this.router.navigate(['/products']);
    }
  }

  // Chọn sản phẩm từ danh sách gợi ý
  selectProduct(product: Product): void {
    this.showDropdown.set(false);
    this.searchKeyword.set('');
    this.router.navigate(['/product', product.slug]);
  }
}
