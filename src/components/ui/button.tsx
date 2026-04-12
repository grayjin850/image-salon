import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'outline',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'uppercase tracking-widest font-semibold border border-[#B8860B] text-[#B8860B] transition-all duration-300',
        variant === 'filled' && 'bg-[#B8860B] text-white',
        variant === 'outline' && 'hover:bg-[#B8860B] hover:text-white',
        size === 'sm' && 'px-4 py-2 text-xs',
        size === 'md' && 'px-6 py-3 text-sm',
        size === 'lg' && 'px-8 py-4 text-base',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}