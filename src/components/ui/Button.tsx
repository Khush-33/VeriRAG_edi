import React from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

const variants: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: '#121316',
    color: '#ffffff',
    border: '1px solid #121316',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  },
  secondary: {
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
  },
  danger: {
    background: 'var(--verdict-contra-bg)',
    color: 'var(--verdict-contra-text)',
    border: '1px solid var(--verdict-contra-border)',
  },
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-sm gap-2',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className,
  disabled,
  style,
  ...props
}) => (
  <button
    disabled={disabled}
    className={cn(
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
      'disabled:opacity-40 disabled:pointer-events-none',
      'hover:brightness-95 active:scale-[0.98]',
      sizes[size],
      className
    )}
    style={{ ...variants[variant], ...style }}
    {...props}
  >
    {icon}
    {children}
  </button>
);
