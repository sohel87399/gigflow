import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState = ({
  title = 'No results found',
  description = 'Try adjusting your filters or create a new entry.',
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-[#243044] p-5">
        {icon ?? (
          <Inbox
            size={32}
            className="text-slate-500"
            aria-hidden="true"
          />
        )}
      </div>
      <h3 className="mb-1 text-base font-semibold text-slate-300">
        {title}
      </h3>
      <p className="mb-5 max-w-xs text-sm text-slate-500">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
