import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import {
  fetchLeads,
  createLeadApi,
  updateLeadApi,
  deleteLeadApi,
} from '@/api/leads.api';
import {
  LeadFilters,
  CreateLeadPayload,
  UpdateLeadPayload,
  ApiResponse,
} from '@/types';

export const LEADS_QUERY_KEY = 'leads';

/**
 * Fetches a paginated, filtered list of leads.
 */
export const useLeads = (filters: LeadFilters) => {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, filters],
    queryFn: () => fetchLeads(filters),
    placeholderData: (prev) => prev,
  });
};

/**
 * Mutation: create a new lead.
 */
export const useCreateLead = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => createLeadApi(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      toast.success('Lead created successfully');
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.message ?? 'Failed to create lead';
      toast.error(message);
    },
  });
};

/**
 * Mutation: update an existing lead.
 */
export const useUpdateLead = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadPayload }) =>
      updateLeadApi(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      toast.success('Lead updated successfully');
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.message ?? 'Failed to update lead';
      toast.error(message);
    },
  });
};

/**
 * Mutation: delete a lead.
 */
export const useDeleteLead = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLeadApi(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      toast.success('Lead deleted successfully');
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.message ?? 'Failed to delete lead';
      toast.error(message);
    },
  });
};
