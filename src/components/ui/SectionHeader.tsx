import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, action }) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-stone-200 pb-3">
    <div>
      <h2 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-stone-950">
        {title}
      </h2>
      {description && (
        <p className="mt-1 max-w-2xl text-xs sm:text-sm font-sans text-stone-600">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);
