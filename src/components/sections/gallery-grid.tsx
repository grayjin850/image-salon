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
              setTimeout(() => el.classList.add('visible'), i * 70);
            });
          }
        });
      },
      { threshold: 0.08 }
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

  // Split into 3 masonry columns
  const col1 = items.filter((_, i) => i % 3 === 0);
  const col2 = items.filter((_, i) => i % 3 === 1);
  const col3 = items.filter((_, i) => i % 3 === 2);

  const GalleryCard = ({ item, index }: { item: GalleryItem; index: number }) => (
    <div
      className="reveal-img relative cursor-pointer overflow-hidden rounded-2xl opacity-0 scale-95 group"
      style={{ transition: 'opacity 0.5s ease, transform 0.5s ease' }}
      onClick={() => openItem(item, index)}
    >
      <div className={`relative w-full ${index % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
        <Image
          src={item.image_url}
          alt={item.caption || 'Gallery image'}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-5">
          {item.caption && (
            <p className="font-sans font-semibold text-white text-sm mb-3 translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
              {item.caption}
            </p>
          )}
          <div className="inline-flex items-center gap-2 bg-white text-[#1C1917] px-4 py-2 rounded-full text-xs font-sans font-bold translate-y-3 group-hover:translate-y-0 transition-transform duration-400 delay-75 w-fit">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Book this look
          </div>
        </div>
      </div>
    </div>
  );

  const skeletonHeights = ['aspect-[3/4]', 'aspect-square', 'aspect-[3/4]', 'aspect-square', 'aspect-[3/4]', 'aspect-square'];

  return (
    <section id="gallery" className="py-28 bg-[#0F0E0C]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-[#D4A853]/30 bg-[#D4A853]/10 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
            <span className="text-[#D4A853] text-xs font-sans font-semibold tracking-wide">Our Work</span>
          </div>
          <h2
            className="font-sans font-extrabold text-white tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            Transformations That
            <span className="text-[#4A7C59]"> Speak for Themselves</span>
          </h2>
          <p className="text-[#A8A29E] font-sans text-base max-w-md mx-auto">
            Real results from real clients. Hover over any photo to book the same look.
          </p>
        </div>

        {/* 3-column masonry grid */}
        {items.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skeletonHeights.map((h, i) => (
              <div key={i} className={`${h} bg-white/5 rounded-2xl animate-pulse`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-start">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              {col1.map((item) => <GalleryCard key={item.id} item={item} index={items.indexOf(item)} />)}
            </div>
            {/* Column 2 — offset down for stagger */}
            <div className="flex flex-col gap-4 mt-10">
              {col2.map((item) => <GalleryCard key={item.id} item={item} index={items.indexOf(item)} />)}
            </div>
            {/* Column 3 */}
            <div className="hidden md:flex flex-col gap-4">
              {col3.map((item) => <GalleryCard key={item.id} item={item} index={items.indexOf(item)} />)}
            </div>
          </div>
        )}

        {/* Bottom CTA banner */}
        <div className="mt-20 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-sans font-bold text-white text-xl md:text-2xl tracking-tight mb-1">
              Love what you see?
            </p>
            <p className="text-[#A8A29E] font-sans text-sm">
              Book your appointment today and let our stylists work their magic.
            </p>
          </div>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-[#4A7C59] text-white px-8 py-3.5 rounded-full font-sans font-bold text-sm hover:bg-[#3A6246] transition-colors whitespace-nowrap shadow-lg shadow-[#4A7C59]/30"
          >
            Book an Appointment
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Custom Lightbox ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
          onClick={closeLightbox}
        >
          {/* Image container */}
          <div
            className="relative max-w-3xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-2 font-sans text-sm"
            >
              Close <span className="text-lg">×</span>
            </button>

            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ maxHeight: '80vh' }}>
              <div className="relative" style={{ aspectRatio: '4/5', maxHeight: '80vh' }}>
                <Image
                  src={selected.image_url}
                  alt={selected.caption || 'Gallery image'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 95vw, 800px"
                />
              </div>
            </div>

            {/* Caption + counter */}
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="font-sans text-white/70 text-sm">
                {selected.caption || ''}
              </p>
              <p className="font-sans text-white/40 text-xs tabular-nums">
                {selectedIndex + 1} / {items.length}
              </p>
            </div>

            {/* Book this look CTA */}
            <div className="mt-4 flex justify-center">
              <Link
                href="/booking"
                onClick={closeLightbox}
                className="inline-flex items-center gap-2 bg-[#4A7C59] text-white px-7 py-3 rounded-full font-sans font-bold text-sm hover:bg-[#3A6246] transition-colors shadow-lg shadow-[#4A7C59]/40"
              >
                Book This Look
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Prev / Next arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevItem(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextItem(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        .reveal-img.visible {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
      `}</style>
    </section>
  );
}
