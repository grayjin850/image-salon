import { createClient } from '@/lib/supabase/server';
import { BookingsTable } from '@/components/admin/bookings-table';

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-white text-2xl font-semibold uppercase tracking-widest mb-8">
        Bookings
      </h1>
      <div className="border border-[#B8860B]/30">
        <BookingsTable bookings={bookings || []} />
      </div>
    </div>
  );
}