'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Testimonial } from '@/types';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true);
      if (data) setTestimonials(data);
    };
    fetch();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-[#B8860B] uppercase tracking-[0.5em] text-xs text-center mb-4">
          What They Say
        </p>
        <h2 className="font-heading text-4xl md:text-5xl text-white text-center mb-16">
          Testimonials
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="min-w-[300px] border border-[#B8860B]/30 p-6 flex-shrink-0"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating ? 'text-[#B8860B] fill-[#B8860B]' : 'text-gray-600'}
                  />
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4">"{t.review}"</p>
              <p className="text-[#B8860B] text-xs uppercase tracking-widest">
                — {t.client_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}