export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  priceNumber?: number;
  oldPrice: string;
  image: string;

  discount: number; // Phần trăm giảm giá
  sold: number;     // Số lượt bán
  categoryId: number; // Khóa ngoại liên kết danh mục
  categorySlug?: string;
  description?: string;
  createdAt: string; // Ngày nhập sản phẩm

  badge?: string;
  badgeClass?: string;
}
