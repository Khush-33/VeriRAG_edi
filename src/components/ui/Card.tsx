import React from 'react';
import { cn } from '../../lib/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className, hover, onClick, style }) => (
  <div
    onClick={onClick}
    className={cn(
      'rounded-2xl',
      hover && 'cursor-pointer transition-all duration-200',
      onClick && 'cursor-pointer',
      className
    )}
    style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      boxShadow: '0 1px 3px rgba(18,19,22,0.04)',
      ...(hover ? { } : {}),
      ...style,
    }}
    onMouseEnter={hover ? (e) => {
      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(18,19,22,0.08)';
      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)';
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
    } : undefined}
    onMouseLeave={hover ? (e) => {
      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(18,19,22,0.04)';
      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-default)';
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
    } : undefined}
  >
    {children}
  </div>
);
