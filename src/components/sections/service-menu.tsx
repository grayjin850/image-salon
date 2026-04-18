'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Service } from '@/types';

export function ServiceMenu() {
  const [services, setServices] = useState<Service[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-col').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const categories = ['hair', 'skin', 'nails', 'packages'];

  return (
    <section className="py-32 bg-[#050505]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16 bg-[#B8860B]/50" />
          <p className="text-[#B8860B] uppercase tracking-[0.6em] text-xs font-sans">
            Pricing
          </p>
          <div className="h-px w-16 bg-[#B8860B]/50" />
        </div>
        <h2 className="font-display text-5xl md:text-6xl text-white font-light italic text-center mb-20">
          Service Menu
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {categories.map((cat) => {
            const items = services.filter((s) => s.category === cat);
            if (items.length === 0) return null;
            return (
              <div
                key={cat}
                className="reveal-col opacity-0 translate-y-4"
                style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}
              >
                <h3 className="font-display text-2xl italic text-[#B8860B] font-light mb-2">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </h3>
                <div className="h-px bg-gradient-to-r from-[#B8860B] to-transparent mb-6" />
                <ul className="space-y-4">
                  {items.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-4">
                      <span className="text-gray-300 text-xs font-sans tracking-wide">{s.name}</span>
                      <div className="flex-1 border-b border-dotted border-gray-800" />
                      {/* ⚠️ price_label comes from Supabase — update prices in the Supabase dashboard */}
                      <span className="text-[#B8860B] text-xs font-sans whitespace-nowrap">{s.price_label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Price update notice — remove after updating Supabase */}
        <p className="text-center text-gray-700 text-[10px] uppercase tracking-[0.3em] font-sans mt-16">
          Prices are managed via the admin dashboard
        </p>
      </div>

      <style>{`
        .reveal-col.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
}
