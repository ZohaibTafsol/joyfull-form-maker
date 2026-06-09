export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-[10px] bg-brand-primary text-white shadow-sm shadow-brand-primary/20"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5h12l4 4v10a1 1 0 0 1-1 1H4z" />
          <path d="M16 5v4h4" />
          <path d="m8 14 2 2 4-4" />
        </svg>
      </span>
      <span className="font-display text-2xl font-medium tracking-tight text-brand-primary">
        1099<span className="italic">ly</span><span className="text-brand-accent">.</span>
      </span>
    </span>
  );
}