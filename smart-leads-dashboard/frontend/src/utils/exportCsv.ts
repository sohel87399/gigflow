import { exportLeadsCSV } from '@/api/leads.api';
import { LeadFilters } from '@/types';
import toast from 'react-hot-toast';

/**
 * Triggers a CSV file download for the given lead filters.
 * Creates a temporary anchor element to initiate the browser download.
 */
export const downloadLeadsCSV = async (
  filters: Omit<LeadFilters, 'page' | 'limit' | 'sort'>
): Promise<void> => {
  const blob = await exportLeadsCSV(filters);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  toast.success('CSV exported successfully');
};
