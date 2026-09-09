export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  category: 'Academic' | 'Hackathon' | 'Competition' | 'Scholarship' | 'Award';
  description: string;
  badgeIcon?: string;
  featured?: boolean;
}
