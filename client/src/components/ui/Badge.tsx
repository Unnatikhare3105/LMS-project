//client/src/components/ui/Badge.tsx

// Badge
export function Badge({
  children, variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'violet' | 'teal' | 'amber' | 'rose' | 'blue';
}) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}



// Input
export function Input({
  placeholder, value, onChange, type = 'text', className = '', icon,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700
          rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-400
          focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500
          transition-colors
          ${icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5'}
        `}
      />
    </div>
  );
}
