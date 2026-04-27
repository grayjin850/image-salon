'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Testimonial } from '@/types';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true);
      if (data) setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
        setFading(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const goTo = (i: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(i);
      setFading(false);
    }, 300);
  };

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-32 bg-[#050505]">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16 bg-[#B8860B]/50" />
          <p className="text-[#B8860B] uppercase tracking-[0.6em] text-xs font-sans">
            What They Say
          </p>
          <div className="h-px w-16 bg-[#B8860B]/50" />
        </div>
        <h2 className="font-display text-5xl md:text-6xl text-white font-light italic text-center mb-20">
          Testimonials
        </h2>

        <div
          className="relative min-h-[220px] flex items-center justify-center"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <div>
            <p className="font-display text-6xl text-[#B8860B] font-light leading-none mb-6">"</p>
            <p className="font-display text-2xl md:text-3xl text-white font-light italic leading-relaxed mb-8">
              {testimonials[current].review}
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#B8860B]/50" />
              <p className="text-[#B8860B] text-xs uppercase tracking-[0.4em] font-sans">
                {testimonials[current].client_name}
              </p>
              <div className="h-px w-8 bg-[#B8860B]/50" />
            </div>
          </div>
        </div>

        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-1.5 h-1.5 rotate-45 transition-all duration-300 ${
                  i === current ? 'bg-[#B8860B]' : 'bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
