import { Eye, Edit2, Trash2 } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/Table';
import { LeadStatusBadge, LeadSourceBadge } from './LeadStatusBadge';
import { formatDate } from '@/utils/formatDate';
import { Lead } from '@/types';

interface LeadRowProps {
  lead: Lead;
  isAdmin: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadRow = ({
  lead,
  isAdmin,
  onView,
  onEdit,
  onDelete,
}: LeadRowProps) => {
  return (
    <TableRow>
      {/* Name + email stacked */}
      <TableCell>
        <button
          onClick={() => onView(lead)}
          className="text-left group"
        >
          <p className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
            {lead.name}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{lead.email}</p>
        </button>
      </TableCell>

      {/* Status */}
      <TableCell>
        <LeadStatusBadge status={lead.status} />
      </TableCell>

      {/* Source */}
      <TableCell>
        <LeadSourceBadge source={lead.source} />
      </TableCell>

      {/* Created */}
      <TableCell className="text-slate-400 whitespace-nowrap text-xs">
        {formatDate(lead.createdAt)}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(lead)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-[#243044] hover:text-slate-200 transition-colors"
            aria-label={`View ${lead.name}`}
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => onEdit(lead)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-[#243044] hover:text-slate-200 transition-colors"
            aria-label={`Edit ${lead.name}`}
          >
            <Edit2 size={14} />
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(lead)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-red-900/30 hover:text-red-400 transition-colors"
              aria-label={`Delete ${lead.name}`}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
