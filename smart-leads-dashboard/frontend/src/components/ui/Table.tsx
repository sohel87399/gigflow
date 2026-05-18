interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeadProps {
  children: React.ReactNode;
}

interface TableBodyProps {
  children: React.ReactNode;
}

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

export const Table = ({ children, className = '' }: TableProps) => (
  <div className="w-full overflow-x-auto">
    <table className={['w-full border-collapse text-sm', className].join(' ')}>
      {children}
    </table>
  </div>
);

export const TableHead = ({ children }: TableHeadProps) => (
  <thead className="border-b border-[#1e2d45]">{children}</thead>
);

export const TableBody = ({ children }: TableBodyProps) => (
  <tbody className="divide-y divide-[#1e2d45]">{children}</tbody>
);

export const TableRow = ({ children, onClick, className = '' }: TableRowProps) => (
  <tr
    onClick={onClick}
    className={[
      'transition-colors',
      onClick ? 'cursor-pointer hover:bg-[#1e2d45]/50' : 'hover:bg-[#1e2d45]/30',
      className,
    ].join(' ')}
  >
    {children}
  </tr>
);

export const TableHeader = ({ children, className = '' }: TableHeaderProps) => (
  <th
    className={[
      'px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500',
      className,
    ].join(' ')}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className = '', colSpan }: TableCellProps) => (
  <td
    colSpan={colSpan}
    className={['px-5 py-3.5 text-slate-300', className].join(' ')}
  >
    {children}
  </td>
);
