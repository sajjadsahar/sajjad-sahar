export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  published: boolean;
  publishedAt: string;
  readingTimeMinutes: number;
  views?: number;
}
