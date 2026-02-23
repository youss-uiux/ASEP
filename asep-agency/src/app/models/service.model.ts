export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  gridArea: string;
  color: string;
}

export interface OrderRequest {
  service: string;
  fullName: string;
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
  status?: 'new' | 'contacted' | 'closed';
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

