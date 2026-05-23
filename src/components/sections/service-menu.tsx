'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Service } from '@/types';
import Link from 'next/link';

const TABS = [
  { key: 'hair',     label: 'Hair',      icon: '✂',  color: '#4A7C59', bg: '#EFF5F1' },
  { key: 'nails',    label: 'Nails',     icon: '💅', color: '#B56AB6', bg: '#F8EFF8' },
  { key: 'skin',     label: 'Skin Care', icon: '✦',  color: '#D4A853', bg: '#FBF3E2' },
  { key: 'waxing',   label: 'Waxing',    icon: '◇',  color: '#C97A5B', bg: '#FBF1EC' },
  { key: 'massage',  label: 'Massage',   icon: '◉',  color: '#5B8AC9', bg: '#EEF3FB' },
  { key: 'packages', label: 'Packages',  icon: '★',  color: '#7C5BAF', bg: '#F3EEF8' },
];

export function ServiceMenu() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState('hair');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => { if (data) setServices(data); });
  }, []);

  const visible = services.filter((s) => s.category === activeTab);
  const tab = TABS.find((t) => t.key === activeTab)!;

  return (
    <section className="py-28 bg-[#FAF7F2]" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 border border-[#4A7C59]/25 bg-[#EFF5F1] rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59]" />
            <span className="text-[#4A7C59] text-xs font-sans font-semibold tracking-wide">Pricing</span>
          </div>
          <h2
            className="font-sans font-extrabold text-[#1C1917] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            Service Menu
          </h2>
          <p className="text-[#78716C] font-sans text-base max-w-md mx-auto">
            Transparent pricing — no hidden fees. Pick a category below to explore.
          </p>
        </div>

        {/* Category tab pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map((t) => {
            const active = t.key === activeTab;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-semibold text-sm transition-all duration-200"
                style={{
                  background: active ? t.color : 'white',
                  color: active ? 'white' : '#57534E',
                  border: active ? `2px solid ${t.color}` : '2px solid #E8E1D9',
                  boxShadow: active ? `0 4px 16px ${t.color}35` : 'none',
                }}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Service list panel */}
        <div className="bg-white border border-[#E8E1D9] rounded-3xl overflow-hidden shadow-sm">

          {/* Panel header */}
          <div
            className="flex items-center gap-4 px-8 py-5 border-b border-[#F0EBE3]"
            style={{ background: tab.bg }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'white', color: tab.color }}
            >
              {tab.icon}
            </div>
            <div>
              <p className="font-sans font-bold text-[#1C1917] text-lg leading-tight">{tab.label}</p>
              <p className="font-sans text-xs text-[#A8A29E] mt-0.5">{visible.length} services available</p>
            </div>
          </div>

          {/* Service rows */}
          {visible.length === 0 ? (
            <div className="px-8 py-12 text-center">
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center gap-4 animate-pulse">
                    <div className="h-3 bg-[#F0EBE3] rounded-full w-48" />
                    <div className="h-3 bg-[#F0EBE3] rounded-full w-16" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-[#F5F0E8]">
              {visible.map((s, i) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-6 px-8 py-4 hover:bg-[#FAF7F2] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: tab.color }}
                    />
                    <span className="font-sans font-medium text-[#1C1917] text-sm truncate">{s.name}</span>
                  </div>
                  <span
                    className="font-sans font-bold text-sm whitespace-nowrap px-3 py-1 rounded-full flex-shrink-0"
                    style={{ background: tab.bg, color: tab.color }}
                  >
                    {s.price_label}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Panel footer CTA */}
          <div className="px-8 py-5 bg-[#FAF7F2] border-t border-[#F0EBE3] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans text-sm text-[#78716C]">
              Ready to book a <span className="font-semibold text-[#1C1917]">{tab.label}</span> service?
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-sans font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: tab.color, boxShadow: `0 4px 16px ${tab.color}40` }}
            >
              Book Now
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
