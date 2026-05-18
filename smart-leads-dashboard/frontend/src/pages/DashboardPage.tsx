import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Plus, Users, CheckCircle, PhoneCall, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadForm } from '@/components/leads/LeadForm';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/store/authStore';
import { downloadLeadsCSV } from '@/utils/exportCsv';
import { useLeads } from '@/hooks/useLeads';
import { LeadFilters as LeadFiltersType, LeadStatus, LeadSource } from '@/types';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
  trend?: { value: string; direction: 'up' | 'down' | 'flat' };
}

const StatCard = ({ label, value, icon, iconBg, valueColor, trend }: StatCardProps) => (
  <div className="rounded-xl border border-[#1e2d45] bg-[#1a2332] p-5">
    <div className="flex items-start justify-between mb-3">
      <span className="text-sm text-slate-400">{label}</span>
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
    </div>
    <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    {trend && (
      <div className="mt-2 flex items-center gap-1 text-xs">
        {trend.direction === 'up' && (
          <>
            <TrendingUp size={12} className="text-green-400" />
            <span className="text-green-400">↑ {trend.value}</span>
          </>
        )}
        {trend.direction === 'down' && (
          <>
            <TrendingDown size={12} className="text-red-400" />
            <span className="text-red-400">↑ {trend.value}</span>
          </>
        )}
        {trend.direction === 'flat' && (
          <>
            <Minus size={12} className="text-slate-400" />
            <span className="text-slate-400">→ No change</span>
          </>
        )}
      </div>
    )}
  </div>
);

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  // Build filters from URL params
  const filters: LeadFiltersType = {
    page: parseInt(searchParams.get('page') ?? '1', 10),
    limit: 10,
    status: (searchParams.get('status') as LeadStatus) || undefined,
    source: (searchParams.get('source') as LeadSource) || undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as 'latest' | 'oldest') || 'latest',
  };

  // Fetch stats — use separate queries for each status
  const { data: allData } = useLeads({ page: 1, limit: 1 });
  const { data: qualifiedData } = useLeads({ page: 1, limit: 1, status: 'Qualified' });
  const { data: contactedData } = useLeads({ page: 1, limit: 1, status: 'Contacted' });
  const { data: lostData } = useLeads({ page: 1, limit: 1, status: 'Lost' });

  const totalLeads = allData?.pagination?.total ?? 0;
  const qualifiedCount = qualifiedData?.pagination?.total ?? 0;
  const contactedCount = contactedData?.pagination?.total ?? 0;
  const lostCount = lostData?.pagination?.total ?? 0;

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
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Leads Overview</h1>
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

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Leads"
            value={totalLeads}
            icon={<Users size={14} className="text-slate-300" />}
            iconBg="bg-[#243044]"
            valueColor="text-white"
            trend={{ value: '12% this month', direction: 'up' }}
          />
          <StatCard
            label="Qualified"
            value={qualifiedCount}
            icon={<CheckCircle size={14} className="text-green-400" />}
            iconBg="bg-green-900/30"
            valueColor="text-green-400"
            trend={{ value: '8% this month', direction: 'up' }}
          />
          <StatCard
            label="Contacted"
            value={contactedCount}
            icon={<PhoneCall size={14} className="text-yellow-400" />}
            iconBg="bg-yellow-900/30"
            valueColor="text-yellow-400"
            trend={{ value: '', direction: 'flat' }}
          />
          <StatCard
            label="Lost"
            value={lostCount}
            icon={<XCircle size={14} className="text-red-400" />}
            iconBg="bg-red-900/30"
            valueColor="text-red-400"
            trend={{ value: '3% this month', direction: 'down' }}
          />
        </div>

        {/* Filters + Table section */}
        <div className="rounded-xl border border-[#1e2d45] bg-[#1a2332] overflow-hidden">
          {/* Filters bar */}
          <div className="border-b border-[#1e2d45] px-5 py-4">
            <LeadFilters />
          </div>

          {/* Table */}
          <LeadTable
            filters={filters}
            onPageChange={handlePageChange}
            onAddLead={() => setCreateOpen(true)}
          />
        </div>
      </div>

      {/* Create lead modal */}
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
