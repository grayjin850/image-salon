import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs uppercase tracking-widest text-[#B8860B]">
          {label}
        </label>
      )}
      <select
        className={cn(
          'bg-black text-white border border-gray-600 px-4 py-3 text-sm focus:outline-none focus:border-[#B8860B] transition-colors',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}