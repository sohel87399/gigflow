import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadForm } from '@/components/leads/LeadForm';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/store/authStore';
import { downloadLeadsCSV } from '@/utils/exportCsv';
import { LeadFilters as LeadFiltersType, LeadStatus, LeadSource } from '@/types';

export default function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const filters: LeadFiltersType = {
    page: parseInt(searchParams.get('page') ?? '1', 10),
    limit: 10,
    status: (searchParams.get('status') as LeadStatus) || undefined,
    source: (searchParams.get('source') as LeadSource) || undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as 'latest' | 'oldest') || 'latest',
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(page));
      return next;
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await downloadLeadsCSV({
        status: filters.status,
        source: filters.source,
        search: filters.search,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Leads</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage and track your sales pipeline
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <button
                onClick={() => void handleExport()}
                disabled={isExporting}
                className="flex items-center gap-2 rounded-lg border border-[#2a3a50] bg-[#1a2332] px-4 py-2 text-sm font-medium text-slate-200 hover:bg-[#243044] transition-colors disabled:opacity-60"
              >
                {isExporting ? <Spinner size="sm" /> : <Download size={15} />}
                Export CSV
              </button>
            )}
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-[#2a3a50] bg-[#1a2332] px-4 py-2 text-sm font-medium text-slate-200 hover:bg-[#243044] transition-colors"
            >
              <Plus size={15} />
              Add Lead
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[#1e2d45] bg-[#1a2332] overflow-hidden">
          <div className="border-b border-[#1e2d45] px-5 py-4">
            <LeadFilters />
          </div>
          <LeadTable
            filters={filters}
            onPageChange={handlePageChange}
            onAddLead={() => setCreateOpen(true)}
          />
        </div>
      </div>

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add New Lead"
      >
        <LeadForm
          onSuccess={() => setCreateOpen(false)}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>
    </DashboardLayout>
  );
}
