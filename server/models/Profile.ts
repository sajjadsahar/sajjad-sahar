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
