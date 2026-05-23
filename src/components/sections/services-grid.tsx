'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Service } from '@/types';
import Link from 'next/link';

const CATEGORY_META: Record<string, { label: string; desc: string; icon: string; color: string; bg: string }> = {
  hair:     { label: 'Hair',       desc: 'Cut, color & treatment',    icon: '✂',  color: '#4A7C59', bg: '#EFF5F1' },
  nails:    { label: 'Nails',      desc: 'Manicure & pedicure',       icon: '💅', color: '#B56AB6', bg: '#F8EFF8' },
  skin:     { label: 'Skin Care',  desc: 'Facials & skincare',        icon: '✦',  color: '#D4A853', bg: '#FBF3E2' },
  waxing:   { label: 'Waxing',     desc: 'Smooth hair removal',       icon: '◇',  color: '#C97A5B', bg: '#FBF1EC' },
  massage:  { label: 'Massage',    desc: 'Relaxation & therapy',      icon: '◉',  color: '#5B8AC9', bg: '#EEF3FB' },
  packages: { label: 'Packages',   desc: 'Value bundles & combos',    icon: '★',  color: '#7C5BAF', bg: '#F3EEF8' },
};

const CATEGORIES = ['hair', 'nails', 'skin', 'waxing', 'massage', 'packages'];

export function ServicesGrid() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
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
            entry.target.querySelectorAll('.reveal-card').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 80);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveModal(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeModal]);

  const scrollToBooking = () => {
    setActiveModal(null);
    setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const modalServices = activeModal ? services.filter((s) => s.category === activeModal) : [];
  const meta = activeModal ? CATEGORY_META[activeModal] : null;

  return (
    <section id="services" className="py-28 bg-[#FAF7F2]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-[#4A7C59]/25 bg-[#EFF5F1] rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59]" />
            <span className="text-[#4A7C59] text-xs font-sans font-semibold tracking-wide">What We Offer</span>
          </div>
          <h2 className="font-sans font-extrabold text-[#1C1917] tracking-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            Our Services
          </h2>
          <p className="text-[#78716C] text-base font-sans max-w-xl mx-auto">
            From hair to nails to full-body packages — everything you need for a complete salon experience.
          </p>
        </div>

        {/* 6-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const m = CATEGORY_META[cat];
            const items = services.filter((s) => s.category === cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveModal(cat)}
                className="reveal-card text-left bg-white border border-[#E8E1D9] rounded-2xl p-6 card-hover cursor-pointer opacity-0 translate-y-6 group"
                style={{ transition: 'opacity 0.5s ease, transform 0.5s ease' }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5"
                  style={{ backgroundColor: m.bg, color: m.color }}
                >
                  {m.icon}
                </div>

                {/* Title + desc */}
                <h3 className="font-sans font-bold text-[#1C1917] text-lg mb-1 group-hover:text-[#4A7C59] transition-colors">
                  {m.label}
                </h3>
                <p className="font-sans text-[#A8A29E] text-xs mb-5">{m.desc}</p>

                {/* Price preview */}
                {items.length > 0 ? (
                  <ul className="space-y-2.5 mb-5">
                    {items.slice(0, 3).map((s) => (
                      <li key={s.id} className="flex justify-between items-center gap-2">
                        <span className="text-[#57534E] text-xs font-sans truncate">{s.name}</span>
                        <span className="font-sans text-xs font-semibold whitespace-nowrap" style={{ color: m.color }}>
                          {s.price_label}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-2.5 mb-5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-3 bg-[#F0EBE3] rounded-full animate-pulse" />
                    ))}
                  </div>
                )}

                {/* View all link */}
                <div className="flex items-center gap-1.5 text-xs font-sans font-semibold" style={{ color: m.color }}>
                  {items.length > 3 ? `+${items.length - 3} more` : 'View all'}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {activeModal && meta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(28,25,23,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden border border-[#E8E1D9]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-7 pt-7 pb-5 border-b border-[#F0EBE3] flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: meta.bg, color: meta.color }}
                >
                  {meta.icon}
                </div>
                <div>
                  <p className="font-sans text-xs font-medium text-[#A8A29E] mb-0.5">Services</p>
                  <h3 className="font-sans font-bold text-[#1C1917] text-xl">{meta.label}</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#F0EBE3] hover:bg-[#E8E1D9] flex items-center justify-center transition-colors text-[#57534E] text-sm font-medium"
              >
                ✕
              </button>
            </div>

            {/* Service list */}
            <div className="px-7 py-5 overflow-y-auto flex-1">
              {modalServices.length > 0 ? (
                <ul className="space-y-3.5">
                  {modalServices.map((s) => (
                    <li
                      key={s.id}
                      className="flex justify-between items-center gap-4 pb-3.5 border-b border-[#F0EBE3] last:border-0 last:pb-0"
                    >
                      <p className="font-sans font-medium text-sm text-[#1C1917]">{s.name}</p>
                      <span className="font-sans text-sm font-bold whitespace-nowrap" style={{ color: meta.color }}>
                        {s.price_label}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#A8A29E] text-sm font-sans">No services listed yet.</p>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-7 py-5 border-t border-[#F0EBE3]">
              <button
                onClick={scrollToBooking}
                className="w-full py-3 rounded-full font-sans font-semibold text-sm text-white transition-colors"
                style={{ backgroundColor: meta.color }}
              >
                Book {meta.label} Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .reveal-card.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
}
