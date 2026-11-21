export interface Banner {
  id: number;
  title: string;
  slug: string;
  image: string;
  subtitle: string;
  buttonText: string;
  link: string;
  order: number;
  createdAt?: string;
}
