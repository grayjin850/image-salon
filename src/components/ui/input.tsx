import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs uppercase tracking-widest text-[#B8860B]">
          {label}
        </label>
      )}
      <input
        className={cn(
          'bg-black text-white border border-gray-600 px-4 py-3 text-sm focus:outline-none focus:border-[#B8860B] transition-colors',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}