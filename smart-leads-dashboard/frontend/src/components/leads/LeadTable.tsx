import { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LeadRow } from './LeadRow';
import { LeadDetailModal } from './LeadDetailModal';
import { LeadForm } from './LeadForm';
import { Pagination } from './Pagination';
import { useLeads, useDeleteLead } from '@/hooks/useLeads';
import { useAuthStore } from '@/store/authStore';
import { Lead, LeadFilters } from '@/types';

interface LeadTableProps {
  filters: LeadFilters;
  onPageChange: (page: number) => void;
  onAddLead: () => void;
}

const SkeletonRow = () => (
  <TableRow>
    {Array.from({ length: 5 }).map((_, i) => (
      <TableCell key={i}>
        <div className="h-4 animate-pulse rounded bg-[#243044]" />
      </TableCell>
    ))}
  </TableRow>
);

export const LeadTable = ({ filters, onPageChange, onAddLead }: LeadTableProps) => {
  const { data, isLoading, isError, refetch } = useLeads(filters);
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useDeleteLead(() => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  });

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditLead(lead);
    setEditOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setDeleteTarget(lead);
    setDeleteOpen(true);
  };

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle size={32} className="mb-3 text-red-400" />
        <p className="mb-4 text-sm font-medium text-red-400">
          Failed to load leads
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          leftIcon={<RefreshCw size={14} />}
        >
          Retry
        </Button>
      </div>
    );
  }

  const leads = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-0">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Source</TableHeader>
            <TableHeader>Created</TableHeader>
            <TableHeader>Act</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <EmptyState
                  title="No leads found"
                  description="Try adjusting your filters or add a new lead to get started."
                  actionLabel="Add Lead"
                  onAction={onAddLead}
                />
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <LeadRow
                key={lead._id}
                lead={lead}
                isAdmin={isAdmin}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
      {pagination && pagination.totalPages <= 1 && pagination.total > 0 && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}

      {/* Lead detail modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedLead(null);
        }}
      />

      {/* Edit modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditLead(null);
        }}
        title="Edit Lead"
      >
        <LeadForm
          lead={editLead ?? undefined}
          onSuccess={() => {
            setEditOpen(false);
            setEditLead(null);
          }}
          onCancel={() => {
            setEditOpen(false);
            setEditLead(null);
          }}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        title="Delete Lead"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Are you sure you want to delete{' '}
            <strong className="text-slate-100">
              {deleteTarget?.name}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDeleteOpen(false);
                setDeleteTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleteMutation.isPending}
              onClick={() => {
                if (deleteTarget) deleteMutation.mutate(deleteTarget._id);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
