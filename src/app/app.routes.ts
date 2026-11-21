import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Trang chủ
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
  },

  // 2. Trang danh sách sản phẩm
  {
    path: 'products',
    loadComponent: () => import('./components/products/products').then((m) => m.Products),
  },

  // 3. Dynamic Route theo Slug danh mục: /category/:slug
  {
    path: 'category/:slug',
    loadComponent: () => import('./components/products/products').then((m) => m.Products),
  },

  // 4. Dynamic Route theo Slug chi tiết sản phẩm: /product/:slug
  {
    path: 'product/:slug',
    loadComponent: () => import('./components/product/product').then((m) => m.ProductComponent),
  },

  // 5. Trang bài viết cẩm nang: /bai_viet
  {
    path: 'bai_viet',
    loadComponent: () => import('./components/articles/articles').then((m) => m.Articles),
  },
  {
    path: 'articles',
    redirectTo: 'bai_viet',
    pathMatch: 'full',
  },

  // 6. Chi tiết bài viết: /bai_viet/:slug
  {
    path: 'bai_viet/:slug',
    loadComponent: () => import('./components/article-detail/article-detail').then((m) => m.ArticleDetail),
  },
  {
    path: 'article/:id',
    loadComponent: () => import('./components/article-detail/article-detail').then((m) => m.ArticleDetail),
  },

  // 7. Trang giỏ hàng
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart').then((m) => m.Cart),
  },

  // 8. Chuyển hướng các đường dẫn khác về Trang chủ
  {
    path: '**',
    redirectTo: '',
  },
];
