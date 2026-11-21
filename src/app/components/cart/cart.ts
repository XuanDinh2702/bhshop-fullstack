import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  imports: [RouterLink],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
  protected cartService = inject(CartService);

  // Trạng thái đặt hàng thành công
  checkoutSuccess = signal<boolean>(false);

  // Tăng số lượng
  increaseQty(productId: number, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  // Giảm số lượng
  decreaseQty(productId: number, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty - 1);
  }

  // Xóa sản phẩm khỏi giỏ
  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  // Xử lý thanh toán
  checkout(): void {
    if (this.cartService.cartItems().length > 0) {
      this.checkoutSuccess.set(true);
      this.cartService.clearCart();
    }
  }

  // Đóng thông báo thanh toán
  closeSuccess(): void {
    this.checkoutSuccess.set(false);
  }
}
