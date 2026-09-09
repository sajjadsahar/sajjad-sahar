export type ProjectCategory = 'All' | 'Web' | 'MERN' | 'Java' | 'C++' | 'AI/ML' | 'Database';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  liveDemoUrl?: string;
  date: string;
  featured: boolean;
  features: string[];
  challenges?: string;
  whatILearned?: string;
  screenshots?: string[];
  views?: number;
}
