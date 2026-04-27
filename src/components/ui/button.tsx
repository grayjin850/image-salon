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
        'relative uppercase tracking-[0.4em] font-sans font-light border border-[#B8860B] text-[#B8860B] transition-all duration-500 overflow-hidden group',
        variant === 'filled' && 'bg-[#B8860B] text-black',
        variant === 'outline' && 'hover:text-black',
        size === 'sm' && 'px-6 py-2 text-xs',
        size === 'md' && 'px-8 py-3 text-xs',
        size === 'lg' && 'px-12 py-4 text-xs',
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 bg-[#B8860B] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}