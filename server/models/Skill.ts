export type SkillCategory = 'Programming' | 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'AI / Machine Learning';
export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Learning' | number | string;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  description?: string;
  icon?: string;
  yearsOfExperience?: string;
  featured?: boolean;
}
