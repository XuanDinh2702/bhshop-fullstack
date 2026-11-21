import { Banner } from './banner';
import { Product } from './product';
import { Category } from './category';
import { Blog } from './blog';

export interface HomeDataResponse {
  success: boolean;
  data: {
    banners: Banner[];
    newProducts: Product[];
    saleProducts: Product[];
    bestSellers: Product[];
    categories: Category[];
    blogs: Blog[];
  };
}
