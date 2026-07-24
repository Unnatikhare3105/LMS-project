
// Loader
export function Loader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{text}</p>
    </div>
  );
}

// AILoader – shown when waiting for Gemini
export function AILoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-2 border-violet-200 dark:border-violet-900 rounded-full" />
        <div className="absolute inset-0 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">AI is generating...</p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">This may take up to 30 seconds</p>
      </div>
    </div>
  );
}