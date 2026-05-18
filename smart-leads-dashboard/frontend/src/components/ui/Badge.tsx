interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'pink' | 'orange' | 'slate';
  className?: string;
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  blue: 'border border-blue-500/40 bg-blue-500/10 text-blue-300',
  yellow: 'border border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
  green: 'border border-green-500/40 bg-green-500/10 text-green-300',
  red: 'border border-red-500/40 bg-red-500/10 text-red-300',
  purple: 'border border-purple-500/40 bg-purple-500/10 text-purple-300',
  pink: 'border border-pink-500/40 bg-pink-500/10 text-pink-300',
  orange: 'border border-orange-500/40 bg-orange-500/10 text-orange-300',
  slate: 'border border-slate-500/40 bg-slate-500/10 text-slate-300',
};

export const Badge = ({
  children,
  variant = 'slate',
  className = '',
}: BadgeProps) => {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
};
