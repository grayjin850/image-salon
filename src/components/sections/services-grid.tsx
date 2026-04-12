'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Service } from '@/types';

const ICONS: Record<string, string> = {
  hair: '✂️',
  skin: '✨',
  nails: '💅',
  packages: '🎁',
};

export function ServicesGrid() {
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
    <section id="services" className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-[#B8860B] uppercase tracking-[0.5em] text-xs text-center mb-4">
          What We Offer
        </p>
        <h2 className="font-heading text-4xl md:text-5xl text-white text-center mb-16">
          Our Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const items = services.filter((s) => s.category === cat);
            return (
              <div
                key={cat}
                className="border border-[#B8860B]/30 p-6 hover:border-[#B8860B] transition-colors"
              >
                <div className="text-3xl mb-4">{ICONS[cat]}</div>
                <h3 className="text-[#B8860B] uppercase tracking-widest text-sm font-semibold mb-4">
                  {cat}
                </h3>
                <ul className="space-y-2">
                  {items.slice(0, 4).map((s) => (
                    <li key={s.id} className="text-gray-400 text-sm flex justify-between">
                      <span>{s.name}</span>
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