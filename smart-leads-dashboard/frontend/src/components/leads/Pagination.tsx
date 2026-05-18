import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { page, totalPages, total, limit } = pagination;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  if (total === 0) return null;

  // Build page numbers to show (max 5 around current)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const btnBase =
    'flex h-8 min-w-[32px] items-center justify-center rounded-lg border border-[#2a3a50] px-2 text-sm font-medium transition-colors';
  const btnActive = 'bg-indigo-600 border-indigo-600 text-white';
  const btnInactive = 'bg-[#1a2332] text-slate-300 hover:bg-[#243044] hover:text-white';
  const btnDisabled = 'opacity-40 cursor-not-allowed';

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#1e2d45] px-5 py-4 sm:flex-row">
      {/* Record count */}
      <p className="text-sm text-slate-400">
        Showing{' '}
        <span className="font-medium text-slate-200">{start}–{end}</span>{' '}
        of{' '}
        <span className="font-medium text-slate-200">{total}</span>{' '}
        leads
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={isFirst}
          className={[btnBase, isFirst ? btnDisabled : btnInactive].join(' ')}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
          <span className="ml-1 hidden sm:inline">Prev</span>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={[btnBase, p === page ? btnActive : btnInactive].join(' ')}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={isLast}
          className={[btnBase, isLast ? btnDisabled : btnInactive].join(' ')}
          aria-label="Next page"
        >
          <span className="mr-1 hidden sm:inline">Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
