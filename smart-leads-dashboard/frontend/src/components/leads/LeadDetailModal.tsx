import { useState } from 'react';
import { Edit2, Trash2, Mail, Calendar, Tag, Globe } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LeadStatusBadge, LeadSourceBadge } from './LeadStatusBadge';
import { LeadForm } from './LeadForm';
import { useDeleteLead } from '@/hooks/useLeads';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/formatDate';
import { Lead } from '@/types';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadDetailModal = ({
  lead,
  isOpen,
  onClose,
}: LeadDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const deleteMutation = useDeleteLead(() => {
    onClose();
    setShowDeleteConfirm(false);
  });

  if (!lead) return null;

  if (isEditing) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsEditing(false);
          onClose();
        }}
        title="Edit Lead"
      >
        <LeadForm
          lead={lead}
          onSuccess={() => {
            setIsEditing(false);
            onClose();
          }}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details">
      <div className="space-y-4">
        {/* Name & badges */}
        <div>
          <h3 className="text-xl font-semibold text-slate-100">
            {lead.name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <LeadStatusBadge status={lead.status} />
            <LeadSourceBadge source={lead.source} />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 rounded-lg bg-[#111827] border border-[#2a3a50] p-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={15} className="shrink-0 text-slate-500" />
            <span className="text-slate-300">{lead.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Tag size={15} className="shrink-0 text-slate-500" />
            <span className="text-slate-300">
              Status: <strong className="text-slate-100">{lead.status}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Globe size={15} className="shrink-0 text-slate-500" />
            <span className="text-slate-300">
              Source: <strong className="text-slate-100">{lead.source}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={15} className="shrink-0 text-slate-500" />
            <span className="text-slate-300">
              Created: {formatDate(lead.createdAt)}
            </span>
          </div>
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="rounded-lg border border-red-800/50 bg-red-900/20 p-4">
            <p className="mb-3 text-sm font-medium text-red-400">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                loading={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(lead._id)}
              >
                Yes, Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        {!showDeleteConfirm && (
          <div className="flex justify-end gap-2 pt-2">
            {isAdmin && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 size={14} />}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Edit2 size={14} />}
              onClick={() => setIsEditing(true)}
            >
              Edit Lead
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
