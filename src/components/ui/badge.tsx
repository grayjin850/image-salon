import { cn } from '@/lib/utils';
import { BookingStatus } from '@/types';

interface BadgeProps {
  status: BookingStatus;
}

export function Badge({ status }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-3 py-1 text-xs uppercase tracking-widest font-semibold',
        status === 'pending' && 'bg-[#B8860B]/20 text-[#B8860B]',
        status === 'confirmed' && 'bg-green-500/20 text-green-400',
        status === 'cancelled' && 'bg-red-500/20 text-red-400',
        status === 'completed' && 'bg-blue-500/20 text-blue-400'
      )}
    >
      {status}
    </span>
  );
}