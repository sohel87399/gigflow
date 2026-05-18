import { apiClient } from './client';
import {
  ApiResponse,
  PaginatedLeadsResponse,
  Lead,
  LeadFilters,
  CreateLeadPayload,
  UpdateLeadPayload,
} from '@/types';

/**
 * Builds a URLSearchParams object from the given lead filters,
 * omitting empty/undefined values.
 */
const buildParams = (filters: LeadFilters): Record<string, string> => {
  const params: Record<string, string> = {};
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search) params.search = filters.search;
  if (filters.sort) params.sort = filters.sort;
  return params;
};

/**
 * Fetches a paginated, filtered list of leads.
 */
export const fetchLeads = async (
  filters: LeadFilters
): Promise<PaginatedLeadsResponse> => {
  const { data } = await apiClient.get<PaginatedLeadsResponse>('/leads', {
    params: buildParams(filters),
  });
  return data;
};

/**
 * Fetches a single lead by ID.
 */
export const fetchLeadById = async (id: string): Promise<ApiResponse<Lead>> => {
  const { data } = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
  return data;
};

/**
 * Creates a new lead.
 */
export const createLeadApi = async (
  payload: CreateLeadPayload
): Promise<ApiResponse<Lead>> => {
  const { data } = await apiClient.post<ApiResponse<Lead>>('/leads', payload);
  return data;
};

/**
 * Updates an existing lead.
 */
export const updateLeadApi = async (
  id: string,
  payload: UpdateLeadPayload
): Promise<ApiResponse<Lead>> => {
  const { data } = await apiClient.put<ApiResponse<Lead>>(
    `/leads/${id}`,
    payload
  );
  return data;
};

/**
 * Deletes a lead by ID.
 */
export const deleteLeadApi = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/leads/${id}`);
  return data;
};

/**
 * Exports leads as a CSV file download.
 * Returns the raw Blob for the browser to download.
 */
export const exportLeadsCSV = async (
  filters: Omit<LeadFilters, 'page' | 'limit' | 'sort'>
): Promise<Blob> => {
  const params: Record<string, string> = {};
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search) params.search = filters.search;

  const { data } = await apiClient.get<Blob>('/leads/export/csv', {
    params,
    responseType: 'blob',
  });
  return data;
};
