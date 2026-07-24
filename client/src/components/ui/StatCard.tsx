// StatCard
export function StatCard({
  label, value, sub, color = 'default',
}: { label: string; value: string | number; sub?: string; color?: 'default' | 'orange' | 'green' | 'violet' }) {
  const colors = {
    default: 'text-neutral-900 dark:text-white',
    orange: 'text-orange-500 dark:text-orange-400',
    green: 'text-teal-600 dark:text-teal-400',
    violet: 'text-violet-600 dark:text-violet-400',
  };
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${colors[color]}`}>{value}</p>
      {sub && <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// Empty state
export function Empty({ icon, title, description }: { icon?: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
      {icon && <div className="text-neutral-300 dark:text-neutral-600 mb-2">{icon}</div>}
      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</p>
      {description && <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-xs">{description}</p>}
    </div>
  );
}