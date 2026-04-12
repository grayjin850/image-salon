import { createClient } from '@/lib/supabase/server';

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: bookings } = await supabase.from('bookings').select('*');

  const total = bookings?.length || 0;
  const pending = bookings?.filter((b) => b.status === 'pending').length || 0;
  const confirmed = bookings?.filter((b) => b.status === 'confirmed').length || 0;
  const completed = bookings?.filter((b) => b.status === 'completed').length || 0;

  const cards = [
    { label: 'Total Bookings', value: total, color: 'text-white' },
    { label: 'Pending', value: pending, color: 'text-[#B8860B]' },
    { label: 'Confirmed', value: confirmed, color: 'text-green-400' },
    { label: 'Completed', value: completed, color: 'text-blue-400' },
  ];

  return (
    <div>
      <h1 className="text-white text-2xl font-semibold uppercase tracking-widest mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-[#B8860B]/30 p-6">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              {card.label}
            </p>
            <p className={`text-4xl font-semibold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}