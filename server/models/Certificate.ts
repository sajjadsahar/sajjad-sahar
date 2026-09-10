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
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  certificateId: string;
  fileUrl: string;
  fileType: 'image' | 'pdf';
  certificateDocument?: CertificateDocument;
  skillsCovered: string[];
  description: string;
  verificationUrl: string;
  category: CertificateCategory;
  featured: boolean;
  views?: number;
}
