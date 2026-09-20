import React from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-white text-zinc-950 hover:bg-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
  secondary:
    'bg-white/[0.04] text-zinc-200 border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12]',
  ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]',
  danger: 'bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-sm gap-2',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className,
  disabled,
  ...props
}) => (
  <button
    disabled={disabled}
    className={cn(
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
      'disabled:opacity-40 disabled:pointer-events-none',
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  >
    {icon}
    {children}
  </button>
);
