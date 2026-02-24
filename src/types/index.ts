export interface Applicant {
  id: string;
  full_name: string;
  state: string;
  district: string;
  position: string;
  qualification: string;
  experience: number;
  mobile: string;
  email: string;
  resume_url: string | null;
  aadhaar_url: string | null;
  photo_url: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export interface LegalDocument {
  id: string;
  name: string;
  file_url: string;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'Projects' | 'Team' | 'Events' | 'Certificates';
  image_url: string;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export const INDIAN_STATES = [
  'Rajasthan',
  'Andhra Pradesh',
  'Telangana',
  'Karnataka',
  'Tamil Nadu',
  'Kerala',
] as const;

export const JOB_POSITIONS = [
  'State Project Manager',
  'District Project Manager',
  'Project Facilitator',
] as const;

export const LEGAL_DOCUMENT_TYPES = [
  'Organization PAN',
  'Owner Photo',
  'DID',
  'Agreement',
  '12A',
  '80G',
  'NGO Darpan',
  'NITI Aayog',
  'Owner PAN',
  'Cancel Cheque',
] as const;

export const GALLERY_CATEGORIES = [
  'Projects',
  'Team',
  'Events',
  'Certificates',
] as const;