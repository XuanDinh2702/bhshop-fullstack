import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'bhshop_cart';

  // Signal chứa danh sách món hàng trong giỏ (load từ localStorage)
  cartItems = signal<CartItem[]>(this.loadFromStorage());

  // Signal đếm tổng số lượng món (hiển thị trên badge icon 🛒 của Header)
  cartCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  // Signal tính tổng tiền thanh toán thực tế
  totalAmount = computed(() =>
    this.cartItems().reduce((sum, item) => {
      const price = item.product.priceNumber || this.parsePrice(item.product.price);
      return sum + price * item.quantity;
    }, 0)
  );

  // Tổng tiền định dạng VND (vd: 730.000đ)
  formattedTotal = computed(() => this.formatVND(this.totalAmount()));

  // Toast thông báo thêm vào giỏ thành công
  toastMessage = signal<string | null>(null);

  // Đọc từ LocalStorage
  private loadFromStorage(): CartItem[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  // Lưu vào LocalStorage
  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Lỗi lưu LocalStorage:', e);
    }
  }

  // Parse chuỗi giá "380.000đ" -> 380000
  parsePrice(priceStr: string): number {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/\D/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  }

  // Định dạng số thành tiền VND: 380000 -> "380.000đ"
  formatVND(amount: number): string {
    return amount.toLocaleString('vi-VN') + 'đ';
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(product: Product, quantity = 1): void {
    this.cartItems.update(items => {
      const existingIndex = items.findIndex(item => item.product.id === product.id);
      let updated: CartItem[];

      if (existingIndex > -1) {
        updated = [...items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
      } else {
        updated = [...items, { product, quantity }];
      }

      this.saveToStorage(updated);
      return updated;
    });

    this.showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  // Cập nhật số lượng của một món
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.cartItems.update(items => {
      const updated = items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      this.saveToStorage(updated);
      return updated;
    });
  }

  // Xóa một món khỏi giỏ
  removeItem(productId: number): void {
    this.cartItems.update(items => {
      const updated = items.filter(item => item.product.id !== productId);
      this.saveToStorage(updated);
      return updated;
    });
    this.showToast('Đã xóa sản phẩm khỏi giỏ hàng.');
  }

  // Xóa sạch giỏ hàng (khi đặt hàng thành công)
  clearCart(): void {
    this.cartItems.set([]);
    this.saveToStorage([]);
  }

  // Hiển thị thông báo Toast
  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set(null);
      }
    }, 2500);
  }
}
