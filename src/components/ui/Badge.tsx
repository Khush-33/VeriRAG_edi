import React from 'react';
import { cn } from '../../lib/cn';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-white/[0.06] text-zinc-300 border-white/[0.08]',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  danger: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  info: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
};

export const Badge: React.FC<BadgeProps> = ({ children, tone = 'neutral', className }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide',
      tones[tone],
      className
    )}
  >
    {children}
  </span>
);
