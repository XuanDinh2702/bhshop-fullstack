export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  author: string;
  createdAt: string; // Định dạng 'YYYY-MM-DD'
  readTime: string;  // Ví dụ: '3 phút đọc'
  views: number;
  featured?: boolean;
  videoUrl?: string; // Tùy chọn video trải nghiệm (nếu có)
  videoDuration?: string;
}
