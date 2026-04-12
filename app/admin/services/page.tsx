import { createClient } from '@/lib/supabase/server';

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('category');

  return (
    <div>
      <h1 className="text-white text-2xl font-semibold uppercase tracking-widest mb-8">
        Services
      </h1>
      <div className="border border-[#B8860B]/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#B8860B]/20">
              <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-[#B8860B]">Category</th>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-[#B8860B]">Name</th>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-[#B8860B]">Price</th>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-[#B8860B]">Status</th>
            </tr>
          </thead>
          <tbody>
            {services?.map((service) => (
              <tr key={service.id} className="border-b border-gray-800 hover:bg-white/5">
                <td className="py-3 px-4 text-gray-300 uppercase">{service.category}</td>
                <td className="py-3 px-4 text-gray-300">{service.name}</td>
                <td className="py-3 px-4 text-[#B8860B]">{service.price_label}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs uppercase tracking-widest ${service.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}