'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { GalleryItem } from '@/types';
import { Modal } from '@/components/ui/modal';

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('gallery_items')
        .select('*')
        .order('sort_order');
      if (data) setItems(data);
    };
    fetchItems();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-img').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 60);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [items]);

  const openItem = (item: GalleryItem, index: number) => {
    setSelected(item);
    setSelectedIndex(index);
  };

  const prev = () => {
    const newIndex = (selectedIndex - 1 + items.length) % items.length;
    setSelected(items[newIndex]);
    setSelectedIndex(newIndex);
  };

  const next = () => {
    const newIndex = (selectedIndex + 1) % items.length;
    setSelected(items[newIndex]);
    setSelectedIndex(newIndex);
  };

  return (
    <section id="gallery" className="py-32 bg-black" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16 bg-[#B8860B]/50" />
          <p className="text-[#B8860B] uppercase tracking-[0.6em] text-xs font-sans">
            Our Work
          </p>
          <div className="h-px w-16 bg-[#B8860B]/50" />
        </div>
        <h2 className="font-display text-5xl md:text-6xl text-white font-light italic text-center mb-20">
          Gallery
        </h2>

        {items.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`bg-[#B8860B]/5 border border-[#B8860B]/10 animate-pulse ${i % 3 === 0 ? 'row-span-2' : ''}`}
                style={{ aspectRatio: i % 3 === 0 ? '1/2' : '1/1' }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`reveal-img relative cursor-pointer overflow-hidden group opacity-0 scale-95 ${
                  index % 5 === 0 ? 'row-span-2' : ''
                }`}
                style={{
                  aspectRatio: index % 5 === 0 ? '1/2' : '1/1',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
                onClick={() => openItem(item, index)}
              >
                <Image
                  src={item.image_url}
                  alt={item.caption || 'Gallery image'}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-center justify-center">
                  <p className="text-white text-xs uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans">
                    {item.caption || 'View'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="">
        {selected && (
          <div className="relative">
            <div className="relative w-full aspect-square">
              <Image
                src={selected.image_url}
                alt={selected.caption || ''}
                fill
                className="object-cover"
              />
            </div>
            {items.length > 1 && (
              <div className="flex justify-between mt-4">
                <button onClick={prev} className="text-xs uppercase tracking-[0.4em] text-[#B8860B] font-sans">
                  ← Prev
                </button>
                <button onClick={next} className="text-xs uppercase tracking-[0.4em] text-[#B8860B] font-sans">
                  Next →
                </button>
              </div>
            )}
            {selected.caption && (
              <p className="text-gray-400 text-xs text-center mt-2 font-sans">{selected.caption}</p>
            )}
          </div>
        )}
      </Modal>

      <style>{`
        .reveal-img.visible {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
      `}</style>
    </section>
  );
}
