import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, action }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-zinc-50">{title}</h2>
      {description && <p className="mt-1 max-w-2xl text-sm text-zinc-500">{description}</p>}
    </div>
    {action}
  </div>
);
