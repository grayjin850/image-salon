'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { GalleryItem } from '@/types';
import { Modal } from '@/components/ui/modal';

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('gallery_items')
        .select('*')
        .order('sort_order');
      if (data) setItems(data);
    };
    fetch();
  }, []);

  return (
    <section id="gallery" className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-[#B8860B] uppercase tracking-[0.5em] text-xs text-center mb-4">
          Our Work
        </p>
        <h2 className="font-heading text-4xl md:text-5xl text-white text-center mb-16">
          Gallery
        </h2>

        {items.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[#B8860B]/10 border border-[#B8860B]/20"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="aspect-square relative cursor-pointer overflow-hidden"
                onClick={() => setSelected(item)}
              >
                <Image
                  src={item.image_url}
                  alt={item.caption || 'Gallery image'}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.caption || 'Gallery'}
      >
        {selected && (
          <div className="relative w-full aspect-square">
            <Image
              src={selected.image_url}
              alt={selected.caption || 'Gallery image'}
              fill
              className="object-cover"
            />
          </div>
        )}
      </Modal>
    </section>
  );
}