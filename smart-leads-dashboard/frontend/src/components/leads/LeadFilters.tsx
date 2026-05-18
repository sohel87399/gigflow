import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { LeadStatus, LeadSource } from '@/types';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const inputCls =
  'rounded-lg border border-[#2a3a50] bg-[#111827] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors';

export const LeadFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') ?? ''
  );
  const debouncedSearch = useDebounce(searchInput, 300);

  const status = searchParams.get('status') ?? '';
  const source = searchParams.get('source') ?? '';

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedSearch) {
        next.set('search', debouncedSearch);
      } else {
        next.delete('search');
      }
      next.set('page', '1');
      return next;
    });
  }, [debouncedSearch, setSearchParams]);

  const handleStatusChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('status', value as LeadStatus);
      else next.delete('status');
      next.set('page', '1');
      return next;
    });
  };

  const handleSourceChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('source', value as LeadSource);
      else next.delete('source');
      next.set('page', '1');
      return next;
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Label */}
      <span className="text-sm font-semibold text-slate-200 mr-1">All Leads</span>

      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search name or email…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={`${inputCls} pl-9 w-full`}
          aria-label="Search leads"
        />
      </div>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={`${inputCls} cursor-pointer`}
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#111827]">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Source filter */}
      <select
        value={source}
        onChange={(e) => handleSourceChange(e.target.value)}
        className={`${inputCls} cursor-pointer`}
        aria-label="Filter by source"
      >
        {SOURCE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#111827]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
