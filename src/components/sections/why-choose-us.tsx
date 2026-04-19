'use client';

import { useEffect, useRef } from 'react';

const REASONS = [
  {
    icon: '✂',
    title: 'Expert Stylists',
    description:
      'Our team of highly trained professionals brings years of experience and passion to every service. Your look is in the best hands.',
  },
  {
    icon: '✦',
    title: 'Premium Products',
    description:
      'We use only salon-grade, top-quality products that are gentle on your hair and skin — because you deserve nothing less.',
  },
  {
    icon: '◉',
    title: 'Clean & Relaxing',
    description:
      'Step into a spotless, air-conditioned sanctuary designed to make you feel comfortable, calm, and completely at ease.',
  },
  {
    icon: '★',
    title: 'Affordable Prices',
    description:
      'Exceptional quality doesn\'t have to break the bank. We offer competitive rates so everyone can experience the Image Salon difference.',
  },
];

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.wcu-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-choose-us" className="py-32 bg-black" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-4 wcu-reveal opacity-0 translate-y-6">
          <div className="h-px w-16 bg-[#B8860B]/50" />
          <p className="text-[#B8860B] uppercase tracking-[0.6em] text-xs font-sans">
            The Image Difference
          </p>
          <div className="h-px w-16 bg-[#B8860B]/50" />
        </div>

        <h2 className="font-display text-5xl md:text-6xl text-white font-light italic text-center mb-6 wcu-reveal opacity-0 translate-y-6">
          Why Choose Us
        </h2>

        <p className="text-gray-500 text-sm font-sans text-center tracking-wide max-w-xl mx-auto mb-20 wcu-reveal opacity-0 translate-y-6">
          More than a salon — a place where you are seen, heard, and truly cared for.
        </p>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#B8860B]/20">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="wcu-reveal opacity-0 translate-y-6 bg-black p-10 group hover:bg-[#B8860B]/5 transition-all duration-500 cursor-default"
            >
              {/* Icon */}
              <div className="w-12 h-12 border border-[#B8860B]/30 flex items-center justify-center mb-6 group-hover:border-[#B8860B] transition-colors duration-300">
                <span className="text-[#B8860B] text-lg">{reason.icon}</span>
              </div>

              {/* Title */}
              <h3 className="font-display text-xl italic text-white font-light mb-3 group-hover:text-[#B8860B] transition-colors duration-300">
                {reason.title}
              </h3>

              {/* Divider */}
              <div className="h-px w-8 bg-[#B8860B]/40 mb-4 group-hover:w-16 transition-all duration-500" />

              {/* Description */}
              <p className="text-gray-500 text-xs font-sans leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom quote */}
        <div className="text-center mt-20 wcu-reveal opacity-0 translate-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-[#B8860B]/30" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#B8860B]/50" />
            <div className="h-px w-24 bg-[#B8860B]/30" />
          </div>
          <p className="font-display text-2xl md:text-3xl italic text-white/40 font-light">
            "Beauty begins the moment you decide to be yourself."
          </p>
        </div>

      </div>

      <style>{`
        .wcu-reveal {
          transition: opacity 0.7s ease, transform 0.7s ease;
          transform: translateY(1.5rem);
        }
        .wcu-reveal.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
}
