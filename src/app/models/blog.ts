export interface Blog {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  author: string;
  createdAt: string;
  readTime: string;
  views: number;
  videoUrl?: string;
  videoDuration?: string;
}
