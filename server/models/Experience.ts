export interface Experience {
  id: string;
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
