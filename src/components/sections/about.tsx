'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const STATS = [
  { value: '500+', label: 'Happy Clients' },
  { value: '6+', label: 'Services Offered' },
  { value: '5★', label: 'Average Rating' },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 150);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-32 bg-[#050505]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-8">

        {/* Section label */}
        <div className="flex items-center justify-center gap-4 mb-4 reveal opacity-0 translate-y-6">
          <div className="h-px w-16 bg-[#B8860B]/50" />
          <p className="text-[#B8860B] uppercase tracking-[0.6em] text-xs font-sans">
            Our Story
          </p>
          <div className="h-px w-16 bg-[#B8860B]/50" />
        </div>

        <h2 className="font-display text-5xl md:text-6xl text-white font-light italic text-center mb-20 reveal opacity-0 translate-y-6">
          About Us
        </h2>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Photo */}
          <div className="relative reveal opacity-0 translate-y-6">
            <div className="relative h-[500px] w-full overflow-hidden">
              <Image
                src="/images/about.jpg"
                alt="Image Salon & Spa Interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              {/* Gold border accent */}
              <div className="absolute inset-0 border border-[#B8860B]/20" />
            </div>
            {/* Decorative gold corner */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-[#B8860B]/40" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-[#B8860B]/40" />
          </div>

          {/* Right — Text */}
          <div className="flex flex-col gap-8">
            <div className="reveal opacity-0 translate-y-6">
              <h3 className="font-display text-3xl italic text-white font-light mb-6">
                Where Every Visit Is a Transformation
              </h3>
              <p className="text-gray-400 text-sm font-sans leading-relaxed mb-4">
                At Image Salon & Spa, we believe that beauty is more than appearance — it's confidence, self-care, and the feeling you carry when you walk out our door. Nestled in the heart of Kolonia, Pohnpei, we are dedicated to providing premium salon and spa services tailored to every individual.
              </p>
              <p className="text-gray-400 text-sm font-sans leading-relaxed">
                Our team of passionate and skilled professionals is committed to delivering exceptional results using only the finest products. From hair transformations to relaxing spa treatments, every service is performed with care, precision, and a genuine love for the craft.
              </p>
            </div>

            {/* Gold divider */}
            <div className="flex items-center gap-4 reveal opacity-0 translate-y-6">
              <div className="h-px w-12 bg-[#B8860B]/50" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B8860B]" />
              <div className="h-px w-12 bg-[#B8860B]/50" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 reveal opacity-0 translate-y-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center border border-[#B8860B]/20 py-6 px-4 hover:border-[#B8860B]/50 transition-colors duration-300">
                  <p className="font-display text-3xl italic text-[#B8860B] font-light mb-1">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-sans">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .reveal {
          transition: opacity 0.7s ease, transform 0.7s ease;
          transform: translateY(1.5rem);
        }
        .reveal.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
}
