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
  <div className={cn('rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5', className)}>
    <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500 font-medium">{label}</p>
    <p className={cn('mt-2 text-2xl font-semibold tracking-tight text-zinc-50 tabular-nums', accent)}>
      {value}
    </p>
    {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
  </div>
);
