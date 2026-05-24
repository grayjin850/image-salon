'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { GalleryItem } from '@/types';

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    createClient()
      .from('gallery_items')
      .select('*')
      .order('sort_order')
      .then(({ data }) => { if (data) setItems(data); });
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-img').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 80);
            });
          }
        });
      },
      { threshold: 0.06 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [items]);

  const openItem = (item: GalleryItem, index: number) => {
    setSelected(item);
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setSelected(null);
    document.body.style.overflow = '';
  }, []);

  const prevItem = useCallback(() => {
    if (!items.length) return;
    const i = (selectedIndex - 1 + items.length) % items.length;
    setSelected(items[i]);
    setSelectedIndex(i);
  }, [items, selectedIndex]);

  const nextItem = useCallback(() => {
    if (!items.length) return;
    const i = (selectedIndex + 1) % items.length;
    setSelected(items[i]);
    setSelectedIndex(i);
  }, [items, selectedIndex]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prevItem();
      if (e.key === 'ArrowRight') nextItem();
      if (e.key === 'Escape')     closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, prevItem, nextItem, closeLightbox]);

  const col1 = items.filter((_, i) => i % 3 === 0);
  const col2 = items.filter((_, i) => i % 3 === 1);
  const col3 = items.filter((_, i) => i % 3 === 2);

  // Slight rotation alternation — polaroid / editorial feel
  const ROTS = ['-1deg', '0.7deg', '-0.5deg', '1.1deg', '-0.8deg', '0.4deg'];

  const GalleryCard = ({ item, index }: { item: GalleryItem; index: number }) => (
    <div
      className="reveal-img group cursor-pointer opacity-0"
      style={{
        ['--rot' as string]: ROTS[index % ROTS.length],
        transform: `scale(0.95) rotate(${ROTS[index % ROTS.length]})`,
        transition: 'opacity 0.55s ease, transform 0.55s ease',
      }}
      onClick={() => openItem(item, index)}
    >
      {/* Card frame — white polaroid-style */}
      <div
        className="bg-white rounded-3xl overflow-hidden border border-[#EDE7DD] shadow-[0_3px_18px_rgba(28,25,23,0.08)] transition-all duration-500 group-hover:shadow-[0_18px_52px_rgba(28,25,23,0.16)] group-hover:-translate-y-2"
      >
        {/* Photo with thin top padding — polaroid strip look */}
        <div className="p-2.5 pb-0">
          <div className={`relative w-full ${index % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden rounded-2xl`}>
            <Image
              src={item.image_url}
              alt={item.caption || 'Gallery image'}
              fill
              unoptimized
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/75 via-[#1C1917]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4">
              <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                <Link
                  href="/booking"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 bg-white text-[#1C1917] px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold shadow-lg w-fit hover:bg-[#EFF5F1] hover:text-[#4A7C59] transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Book this look
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Polaroid caption strip */}
        <div className="px-3.5 py-2.5">
          {item.caption
            ? <p className="font-sans text-[11px] font-semibold text-[#57534E] tracking-wide truncate">{item.caption}</p>
            : <p className="font-sans text-[11px] text-[#C0B9B2]">Image Salon</p>
          }
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="gallery"
      className="py-28 relative overflow-hidden"
      ref={sectionRef}
      style={{ background: 'linear-gradient(160deg, #FFFAF4 0%, #FAF7F2 50%, #FFF4EE 100%)' }}
    >
      {/* Warm ambient blobs — makes photos glow */}
      <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] rounded-full bg-[#4A7C59]/7 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[500px] rounded-full bg-[#D4A853]/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 right-8 w-[350px] h-[600px] rounded-full bg-[#F7CBB8]/18 blur-[110px] pointer-events-none" />

      {/* Decorative dot grid — very subtle */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, #4A7C59 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-[#D4A853]/35 bg-[#FBF3E0] rounded-full px-4 py-1.5 mb-5">
            <span className="text-[#D4A853]">✦</span>
            <span className="text-[#A67C1E] text-xs font-sans font-semibold tracking-widest uppercase">Our Work</span>
          </div>
          <h2
            className="font-sans font-extrabold text-[#1C1917] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            Transformations That
            <span className="text-[#4A7C59]"> Speak for Themselves</span>
          </h2>
          <p className="text-[#78716C] font-sans text-base max-w-md mx-auto">
            Real results from real clients — tap any photo to book the same look.
          </p>
        </div>

        {/* Masonry grid */}
        {items.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {['aspect-[3/4]','aspect-square','aspect-[3/4]','aspect-square','aspect-[3/4]','aspect-square'].map((h, i) => (
              <div key={i} className={`${h} bg-[#1C1917]/6 rounded-3xl animate-pulse`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 items-start">
            <div className="flex flex-col gap-5">
              {col1.map((item) => <GalleryCard key={item.id} item={item} index={items.indexOf(item)} />)}
            </div>
            <div className="flex flex-col gap-5 mt-12">
              {col2.map((item) => <GalleryCard key={item.id} item={item} index={items.indexOf(item)} />)}
            </div>
            <div className="hidden md:flex flex-col gap-5 mt-6">
              {col3.map((item) => <GalleryCard key={item.id} item={item} index={items.indexOf(item)} />)}
            </div>
          </div>
        )}

        {/* Bottom CTA banner */}
        <div
          className="mt-20 rounded-3xl overflow-hidden relative shadow-xl shadow-[#4A7C59]/15"
          style={{ background: 'linear-gradient(135deg, #1C5E30 0%, #4A7C59 55%, #5C9A6E 100%)' }}
        >
          {/* Decorative light burst inside banner */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(ellipse at 15% 50%, #D4A853 0%, transparent 55%), radial-gradient(ellipse at 85% 50%, #ffffff 0%, transparent 55%)',
          }} />
          <div className="relative px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-sans font-bold text-white text-xl md:text-2xl tracking-tight mb-1">
                Love what you see?
              </p>
              <p className="text-white/65 font-sans text-sm">
                Book your appointment today and let our stylists work their magic.
              </p>
            </div>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-white text-[#1C5E30] px-8 py-3.5 rounded-full font-sans font-bold text-sm hover:bg-[#F0F9F3] transition-colors whitespace-nowrap shadow-lg"
            >
              Book an Appointment
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {selected && (
        <div
          className="fixed inset-0 z-[10002] flex flex-col"
          style={{ background: 'rgba(5,8,6,0.96)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-white/6">
            <div className="flex items-center gap-3">
              <span className="font-sans text-white/40 text-xs tabular-nums">
                {selectedIndex + 1} / {items.length}
              </span>
              {selected.caption && (
                <span className="hidden sm:block font-sans text-white/60 text-sm">{selected.caption}</span>
              )}
            </div>
            <button
              onClick={closeLightbox}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Image area */}
          <div className="flex-1 flex items-center justify-center relative min-h-0 px-16 py-4">
            {items.length > 1 && (
              <button
                onClick={prevItem}
                className="absolute left-3 sm:left-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/22 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            <div className="relative w-full h-full" onClick={closeLightbox}>
              <Image
                src={selected.image_url}
                alt={selected.caption || 'Gallery image'}
                fill
                unoptimized
                className="object-contain"
                sizes="(max-width: 768px) 95vw, 80vw"
                priority
              />
            </div>

            {items.length > 1 && (
              <button
                onClick={nextItem}
                className="absolute right-3 sm:right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/22 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Next"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Bottom bar */}
          <div className="shrink-0 border-t border-white/6 px-5 py-4 flex items-center justify-between gap-4">
            <p className="sm:hidden font-sans text-white/55 text-sm truncate">
              {selected.caption || ''}
            </p>
            <div className="flex-1 sm:flex-none" />
            <Link
              href="/booking"
              onClick={closeLightbox}
              className="inline-flex items-center gap-2 bg-[#4A7C59] text-white px-6 py-2.5 rounded-full font-sans font-bold text-sm hover:bg-[#3A6246] transition-colors shadow-lg shadow-[#4A7C59]/40 whitespace-nowrap"
            >
              Book This Look
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .reveal-img.visible {
          opacity: 1 !important;
          transform: scale(1) rotate(var(--rot, 0deg)) !important;
        }
      `}</style>
    </section>
  );
}
