export interface SocialLinks {
  github: string;
  linkedin: string;
  facebook?: string;
  email: string;
  whatsapp?: string;
  twitter?: string;
}

export interface Profile {
  id?: string;
  _id?: string;
  name: string;
  title: string;
  field: string;
  university: string;
  program: string;
  currentSemester: string;
  cgpa: string;
  bio: string;
  aboutText: string;
  developmentPhilosophy: string;
  careerGoals: string;
  avatarUrl: string;
  resumeUrl: string;
  githubUsername: string;
  socialLinks: SocialLinks;
  location: string;
  availableForHire: boolean;
}

export type SkillCategory = 'Programming' | 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'AI / Machine Learning';
export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Learning' | number | string;

export interface Skill {
  id: string;
  _id?: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  description?: string;
  icon?: string;
  yearsOfExperience?: string;
  featured?: boolean;
}

export type ProjectCategory = 'All' | 'Web' | 'MERN' | 'Java' | 'C++' | 'AI/ML' | 'Database';

export interface Project {
  id: string;
  _id?: string;
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

export type CertificateCategory = 
  | 'All' 
  | 'All Certificates'
  | 'Artificial Intelligence' 
  | 'Generative AI' 
  | 'Data Science' 
  | 'Programming' 
  | 'Cloud' 
  | 'Web Development' 
  | 'AI/ML' 
  | 'Cybersecurity' 
  | 'Database' 
  | 'Other' 
  | string;

export interface CertificateDocument {
  url: string;
  publicId?: string;
  fileType: 'image' | 'pdf' | string;
  originalName?: string;
}

export interface Certificate {
  id: string;
  _id?: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  certificateId: string;
  fileUrl: string; // URL or base64 (image/pdf)
  fileType: 'image' | 'pdf';
  certificateDocument?: CertificateDocument;
  skillsCovered: string[];
  description: string;
  verificationUrl: string;
  category: CertificateCategory;
  featured: boolean;
  views?: number;
}

export interface Experience {
  id: string;
  _id?: string;
  organization: string;
  position: string;
  type: 'Education' | 'Experience' | 'Leadership';
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string;
  technologies?: string[];
  achievements?: string[];
  location?: string;
}

export interface Achievement {
  id: string;
  _id?: string;
  title: string;
  organization: string;
  date: string;
  category: 'Academic' | 'Hackathon' | 'Competition' | 'Scholarship' | 'Award';
  description: string;
  badgeIcon?: string;
  featured?: boolean;
}

export interface Blog {
  id: string;
  _id?: string;
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

export interface ContactMessage {
  id: string;
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  replied?: boolean;
}

export interface AnalyticsSummary {
  pageViews: number;
  projectViews: number;
  certificateViews: number;
  blogViews: number;
  messageCount: number;
  dailyViews: { date: string; views: number }[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  topics?: string[];
}

export interface UserAuth {
  id: string;
  username: string;
  email: string;
  role: 'admin';
  token?: string;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
  skills: Skill[];
  experience: Experience[];
  achievements: Achievement[];
  blogs: Blog[];
}
