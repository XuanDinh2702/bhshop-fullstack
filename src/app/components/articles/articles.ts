import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Blog } from '../../models/blog';
import { BlogService } from '../../services/blog.service';
import { ARTICLES_DATA } from '../../data/articles.data';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './articles.html',
  styleUrl: './articles.css',
})
export class Articles implements OnInit {
  private blogService = inject(BlogService);

  // Toàn bộ dữ liệu bài viết
  allArticles = signal<Blog[]>(ARTICLES_DATA as any);

  // Danh sách chuyên mục
  categories: string[] = [
    'Tất cả',
    'Mẹo cắm hoa',
    'Ý nghĩa hoa',
    'Trải nghiệm video',
    'Cẩm nang hoa',
    'Xu hướng quà tặng'
  ];

  // Chuyên mục đang chọn
  selectedCategory = signal<string>('Tất cả');

  // Từ khóa tìm kiếm
  searchQuery = signal<string>('');

  // Bài viết đang được mở trong Quick Read Modal
  activeModalArticle = signal<Blog | null>(null);

  // Video đang được mở trong Video Player Modal
  activeVideoUrl = signal<string | null>(null);

  // Form đăng ký nhận tin
  subscriberEmail = signal<string>('');
  subscribeSuccess = signal<boolean>(false);

  // Bài viết nổi bật (featured)
  featuredArticle = computed(() => {
    return this.allArticles().find(a => (a as any).featured) || this.allArticles()[0];
  });

  // Danh sách video trải nghiệm thực tế
  videoArticles = computed(() => {
    return this.allArticles().filter(a => !!a.videoUrl);
  });

  // Danh sách bài viết sau khi lọc theo chuyên mục và từ khóa
  filteredArticles = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();

    return this.allArticles().filter(article => {
      const matchCategory = category === 'Tất cả' || article.category === category;
      const matchQuery = !query ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
  });

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        if (blogs && blogs.length > 0) {
          this.allArticles.set(blogs);
        }
      },
      error: () => {
        // Giữ ARTICLES_DATA làm fallback
      }
    });
  }

  // Chọn chuyên mục
  filterByCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  // Mở modal đọc nhanh
  openModal(article: Blog): void {
    this.activeModalArticle.set(article);
  }

  // Đóng modal đọc nhanh
  closeModal(): void {
    this.activeModalArticle.set(null);
  }

  // Mở video modal
  openVideo(url?: string): void {
    if (url) {
      this.activeVideoUrl.set(url);
    }
  }

  // Đóng video modal
  closeVideo(): void {
    this.activeVideoUrl.set(null);
  }

  // Xử lý đăng ký nhận bản tin
  onSubscribe(): void {
    if (this.subscriberEmail().trim() && this.subscriberEmail().includes('@')) {
      this.subscribeSuccess.set(true);
      setTimeout(() => {
        this.subscriberEmail.set('');
        this.subscribeSuccess.set(false);
      }, 4000);
    }
  }
}
