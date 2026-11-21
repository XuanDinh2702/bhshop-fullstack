import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Blog } from '../../models/blog';
import { BlogService } from '../../services/blog.service';
import { ARTICLES_DATA } from '../../data/articles.data';

interface UserComment {
  name: string;
  avatar: string;
  date: string;
  content: string;
}

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css'
})
export class ArticleDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  // Bài viết hiện tại
  currentArticle = signal<Blog | null>(null);

  // Bài viết liên quan
  relatedArticles = signal<Blog[]>([]);

  // Danh sách bình luận tương tác
  comments = signal<UserComment[]>([
    {
      name: 'Ngọc Mai',
      avatar: '🌸',
      date: 'Hôm qua',
      content: 'Bài viết chia sẻ rất chi tiết và dễ áp dụng! Mình đã thử pha chút đường vào bình hoa hồng và hoa tươi được hơn 10 ngày thật.'
    },
    {
      name: 'Thanh Tùng',
      avatar: '🌿',
      date: '2 ngày trước',
      content: 'Video cắm hoa workshop hướng dẫn rất có tâm. Bó hoa cưới dáng tròn nhìn cực kỳ sang và tinh tế.'
    }
  ]);

  // Form bình luận mới
  newCommentName = signal<string>('');
  newCommentContent = signal<string>('');
  commentSubmitted = signal<boolean>(false);

  ngOnInit(): void {
    // Lắng nghe slug hoặc id từ URL
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      const id = params.get('id');

      if (slug) {
        this.loadBlogBySlug(slug);
      } else if (id) {
        this.loadBlogById(Number(id));
      } else {
        this.loadFallback();
      }
    });
  }

  // Tải chi tiết bài viết từ Backend API qua Slug
  loadBlogBySlug(slug: string): void {
    this.blogService.getBlogBySlug(slug).subscribe({
      next: (blog) => {
        this.currentArticle.set(blog);
        this.loadRelatedBlogs();
      },
      error: () => {
        // Fallback từ local seed data
        const local = ARTICLES_DATA.find(a => (a as any).slug === slug || a.id.toString() === slug);
        if (local) {
          this.currentArticle.set(local as any);
        } else {
          this.loadFallback();
        }
      }
    });
  }

  // Tải theo ID
  loadBlogById(id: number): void {
    const local = ARTICLES_DATA.find(a => a.id === id);
    if (local) {
      this.currentArticle.set(local as any);
      this.loadRelatedBlogs();
    } else {
      this.loadFallback();
    }
  }

  private loadFallback(): void {
    this.currentArticle.set(ARTICLES_DATA[0] as any);
    this.loadRelatedBlogs();
  }

  private loadRelatedBlogs(): void {
    this.blogService.getBlogs(3).subscribe({
      next: (blogs) => {
        const curId = this.currentArticle()?.id;
        this.relatedArticles.set(blogs.filter(b => b.id !== curId).slice(0, 3));
      },
      error: () => {
        const curId = this.currentArticle()?.id;
        this.relatedArticles.set(ARTICLES_DATA.filter(b => b.id !== curId).slice(0, 3) as any);
      }
    });
  }

  // Thêm bình luận tương tác
  addComment(): void {
    const name = this.newCommentName().trim();
    const content = this.newCommentContent().trim();

    if (name && content) {
      this.comments.update(prev => [
        {
          name: name,
          avatar: '🌼',
          date: 'Vừa xong',
          content: content
        },
        ...prev
      ]);
      this.newCommentName.set('');
      this.newCommentContent.set('');
      this.commentSubmitted.set(true);
      setTimeout(() => this.commentSubmitted.set(false), 3000);
    }
  }
}
