'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Service } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  hair: 'Hair',
  skin: 'Skin Care',
  nails: 'Nails',
  packages: 'Packages',
  waxing: 'Waxing',
  massage: 'Massage',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  hair: 'Cut, color & treatments',
  skin: 'Facials & skincare',
  nails: 'Manicure & pedicure',
  packages: 'Value bundles',
  waxing: 'Hair removal services',
  massage: 'Relaxation & therapy',
};

const CATEGORY_ICONS: Record<string, string> = {
  hair: '✂',
  skin: '✦',
  nails: '◆',
  packages: '★',
  waxing: '◇',
  massage: '◉',
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

  // Scroll-triggered reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-card').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeModal]);

  const scrollToBooking = () => {
    setActiveModal(null);
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const modalServices = activeModal
    ? services.filter((s) => s.category === activeModal)
    : [];

  return (
    <section id="services" className="py-32 bg-black" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16 bg-[#B8860B]/50" />
          <p className="text-[#B8860B] uppercase tracking-[0.6em] text-xs font-sans">
            What We Offer
          </p>
          <div className="h-px w-16 bg-[#B8860B]/50" />
        </div>
        <h2 className="font-display text-5xl md:text-6xl text-white font-light italic text-center mb-20">
          Our Services
        </h2>

        {/* 6-category grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#B8860B]/20">
          {CATEGORIES.map((cat) => {
            const items = services.filter((s) => s.category === cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveModal(cat)}
                className="reveal-card bg-black p-10 hover:bg-[#B8860B]/5 transition-all duration-500 group opacity-0 translate-y-6 text-left cursor-pointer"
                style={{ transition: 'opacity 0.6s ease, transform 0.6s ease, background-color 0.5s ease' }}
              >
                <p className="text-[#B8860B] text-xs mb-3">{CATEGORY_ICONS[cat] ?? '✦'}</p>
                <h3 className="font-display text-2xl italic text-white font-light mb-1 group-hover:text-[#B8860B] transition-colors duration-300">
                  {CATEGORY_LABELS[cat] ?? cat}
                </h3>
                <p className="text-gray-600 text-[10px] uppercase tracking-[0.25em] font-sans mb-6">
                  {CATEGORY_DESCRIPTIONS[cat] ?? ''}
                </p>
                <div className="h-px w-8 bg-[#B8860B]/50 mb-6" />
                {items.length > 0 ? (
                  <ul className="space-y-3">
                    {items.slice(0, 4).map((s) => (
                      <li key={s.id} className="flex justify-between items-center gap-2">
                        <span className="text-gray-400 text-xs font-sans tracking-wide truncate">{s.name}</span>
                        <span className="text-[#B8860B] text-xs font-sans whitespace-nowrap">{s.price_label}</span>
                      </li>
                    ))}
                    {items.length > 4 && (
                      <li className="text-[#B8860B]/50 text-[10px] uppercase tracking-[0.3em] font-sans pt-1">
                        +{items.length - 4} more — tap to view
                      </li>
                    )}
                  </ul>
                ) : (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-3 bg-[#B8860B]/10 rounded-sm animate-pulse" />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#B8860B]/30 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#B8860B]/20 px-8 py-6 flex items-center justify-between z-10">
              <div>
                <p className="text-[#B8860B] text-[10px] uppercase tracking-[0.4em] font-sans mb-1">
                  {CATEGORY_ICONS[activeModal]} Services
                </p>
                <h3 className="font-display text-3xl italic text-white font-light">
                  {CATEGORY_LABELS[activeModal]}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-500 hover:text-[#B8860B] transition-colors text-[10px] uppercase tracking-[0.3em] font-sans"
              >
                Close
              </button>
            </div>

            {/* Modal services list */}
            <div className="px-8 py-6">
              {modalServices.length > 0 ? (
                <ul className="space-y-4">
                  {modalServices.map((s, i) => (
                    <li
                      key={s.id}
                      className="flex justify-between items-center gap-4 pb-4 border-b border-[#B8860B]/10 last:border-0 last:pb-0"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <span className="text-gray-300 text-sm font-sans">{s.name}</span>
                      <span className="text-[#B8860B] text-sm font-sans whitespace-nowrap">{s.price_label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm font-sans">No services available.</p>
              )}
            </div>

            {/* Modal footer - Book button */}
            <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-[#B8860B]/20 px-8 py-5">
              <button
                onClick={scrollToBooking}
                className="w-full py-3 bg-[#B8860B] text-black text-[11px] uppercase tracking-[0.4em] font-sans hover:bg-[#d4a017] transition-colors duration-300"
              >
                Book an Appointment
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
