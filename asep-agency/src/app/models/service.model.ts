export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  long_description: string;
  icon: string;
  image_url: string;
  color: string;
  grid_area: string;
  features: string[];
  display_order: number;
  is_active: boolean;
}

export type ClientType = 'particulier' | 'entreprise' | 'institution';
export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'closed';

export interface OrderRequest {
  service_slug: string;
  service_id?: string;
  client_type: ClientType;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  duration: string;
  notes: string;
}

export interface Lead extends OrderRequest {
  id?: string;
  created_at?: string;
  status?: LeadStatus;
}

export interface AdminToken {
  id?: string;
  token: string;
  created_at?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}
