'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Service } from '@/types';

export function ServiceMenu() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (data) setServices(data);
    };
    fetch();
  }, []);

  const categories = ['hair', 'skin', 'nails', 'packages'];

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-[#B8860B] uppercase tracking-[0.5em] text-xs text-center mb-4">
          Pricing
        </p>
        <h2 className="font-heading text-4xl md:text-5xl text-white text-center mb-16">
          Service Menu
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {categories.map((cat) => {
            const items = services.filter((s) => s.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat}>
                <h3 className="text-[#B8860B] uppercase tracking-widest text-sm font-semibold mb-4">
                  {cat}
                </h3>
                <div className="border-t border-[#B8860B]/30 mb-4" />
                <ul className="space-y-3">
                  {items.map((s) => (
                    <li key={s.id} className="flex justify-between text-sm">
                      <span className="text-gray-300">{s.name}</span>
                      <span className="text-[#B8860B]">{s.price_label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}