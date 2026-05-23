'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Testimonial } from '@/types';

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 14 14" fill="#D4A853">
          <path d="M7 1l1.56 3.16 3.49.51-2.53 2.46.6 3.47L7 8.93l-3.12 1.67.6-3.47L2 4.67l3.49-.51L7 1z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t, delay }: { t: Testimonial; delay: number }) {
  return (
    <div
      className="bg-white border border-[#E8E1D9] rounded-2xl p-6 flex flex-col gap-4 card-hover h-fit"
      style={{ animationDelay: `${delay}ms` }}
    >
      <StarRating />
      <p className="font-sans text-[#44403C] text-sm leading-relaxed flex-1">
        &ldquo;{t.review}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-[#F0EBE3]">
        <div className="w-8 h-8 rounded-full bg-[#EFF5F1] flex items-center justify-center text-sm font-bold text-[#4A7C59]">
          {t.client_name.charAt(0).toUpperCase()}
        </div>
        <p className="font-sans font-semibold text-sm text-[#1C1917]">{t.client_name}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#E8E1D9] rounded-2xl p-6 space-y-3 animate-pulse">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full bg-[#F0EBE3]" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-[#F0EBE3] rounded-full w-full" />
        <div className="h-3 bg-[#F0EBE3] rounded-full w-5/6" />
        <div className="h-3 bg-[#F0EBE3] rounded-full w-4/6" />
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-[#F0EBE3]">
        <div className="w-8 h-8 rounded-full bg-[#F0EBE3]" />
        <div className="h-3 bg-[#F0EBE3] rounded-full w-28" />
      </div>
    </div>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true);
      if (data) setTestimonials(data);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  const col1 = testimonials.filter((_, i) => i % 3 === 0);
  const col2 = testimonials.filter((_, i) => i % 3 === 1);
  const col3 = testimonials.filter((_, i) => i % 3 === 2);

  return (
    <section id="testimonials" className="py-28 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-[#D4A853]/30 bg-[#FBF3E2] rounded-full px-4 py-1.5 mb-5">
            <StarRating count={5} />
            <span className="text-[#D4A853] text-xs font-sans font-semibold tracking-wide ml-1">Client Reviews</span>
          </div>
          <h2 className="font-sans font-extrabold text-[#1C1917] tracking-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            What Our Clients Say
          </h2>
          <p className="text-[#78716C] text-base font-sans max-w-md mx-auto">
            Real reviews from real clients who trust Image Salon with their look.
          </p>
        </div>

        {/* Masonry-style 3-col grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : testimonials.length === 0 ? null : (
          <>
            {/* Desktop: 3 columns */}
            <div className="hidden lg:grid grid-cols-3 gap-5 items-start">
              <div className="flex flex-col gap-5">
                {col1.map((t, i) => <TestimonialCard key={t.id} t={t} delay={i * 80} />)}
              </div>
              <div className="flex flex-col gap-5 mt-8">
                {col2.map((t, i) => <TestimonialCard key={t.id} t={t} delay={80 + i * 80} />)}
              </div>
              <div className="flex flex-col gap-5">
                {col3.map((t, i) => <TestimonialCard key={t.id} t={t} delay={160 + i * 80} />)}
              </div>
            </div>

            {/* Mobile/tablet: single column */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5">
              {testimonials.map((t, i) => (
                <TestimonialCard key={t.id} t={t} delay={i * 60} />
              ))}
            </div>
          </>
        )}

        {/* Bottom trust badge */}
        {!loading && testimonials.length > 0 && (
          <div className="mt-14 flex justify-center">
            <div className="inline-flex items-center gap-3 bg-white border border-[#E8E1D9] rounded-full px-6 py-3 shadow-sm">
              <div className="flex -space-x-1.5">
                {['M','J','S','A','R'].map((l, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-[#EFF5F1] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#4A7C59]">
                    {l}
                  </div>
                ))}
              </div>
              <p className="font-sans text-sm text-[#57534E]">
                <span className="font-bold text-[#1C1917]">500+</span> happy clients & counting
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
