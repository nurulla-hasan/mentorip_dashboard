export type PostStatus = "published" | "draft";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  iconName: string;
}

export interface Post {
  _id: string;
  title: string;
  subtitle: string;
  slug: string;
  coverImage: string;
  tag: string[];
  readTime: string;
  content: string;
  category: string | Category; // Can be ID string or populated object
  views: number;
  status: PostStatus | string;
}

