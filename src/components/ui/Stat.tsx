import React from 'react';
import { cn } from '../../lib/cn';

interface StatProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({ label, value, hint, accent, className }) => (
  <div
    className={cn('rounded-lg p-5 border border-stone-200 bg-white shadow-2xs', className)}
  >
    <p className="text-[11px] uppercase tracking-wider font-mono font-semibold text-stone-500">
      {label}
    </p>
    <p className={cn('mt-2 font-serif text-3xl font-bold tracking-tight tabular-nums text-stone-950', accent)}>
      {value}
    </p>
    {hint && <p className="mt-1 text-xs text-stone-500 font-sans">{hint}</p>}
  </div>
);
