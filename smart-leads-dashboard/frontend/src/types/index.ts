/**
 * Shared TypeScript types for the Smart Leads Dashboard frontend.
 */

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type UserRole = 'admin' | 'sales_user';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedLeadsResponse {
  success: boolean;
  message: string;
  data: Lead[];
  pagination: PaginationMeta;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: 'latest' | 'oldest';
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;
