import React from 'react';
import { cn } from '../../lib/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, hover, onClick }) => (
  <div
    onClick={onClick}
    className={cn(
      'rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm',
      hover && 'cursor-pointer transition-colors hover:border-white/10 hover:bg-white/[0.04]',
      onClick && 'cursor-pointer',
      className
    )}
  >
    {children}
  </div>
);
