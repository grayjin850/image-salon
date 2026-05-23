'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

const SLIDES = [
  { src: '/images/hero1.jpg', label: 'Hair Highlights' },
  { src: '/images/hero2.jpg', label: 'Hair Styling' },
  { src: '/images/hero3.jpg', label: 'Hair Color' },
  { src: '/images/hero4.jpg', label: 'Image Salon & Spa' },
];

const STATS = [
  { value: '500+', label: 'Happy Clients' },
  { value: '6+', label: 'Services' },
  { value: '5.0★', label: 'Rating' },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setPrev(current);
      setCurrent(index);
      setAnimating(true);
      setTimeout(() => { setPrev(null); setAnimating(false); }, 900);
    },
    [animating, current]
  );

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#FAF7F2] flex items-center pt-16 overflow-hidden"
    >
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-[#4A7C59]/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#D4A853]/8 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-4rem)]">

          {/* ── Left: Content ── */}
          <div className="flex flex-col justify-center order-2 lg:order-1">

            {/* Badge pill */}
            <div className="inline-flex w-fit items-center gap-2 border border-[#4A7C59]/30 bg-[#EFF5F1] rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#4A7C59] animate-pulse" />
              <span className="text-[#4A7C59] text-xs font-sans font-semibold tracking-wide">
                Premium Salon & Spa · Pohnpei, FSM
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-sans font-extrabold text-[#1C1917] leading-[1.08] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
            >
              Transform<br />
              Your Look at<br />
              <span className="text-[#4A7C59]">Image Salon</span>
            </h1>

            {/* Subheading */}
            <p className="text-[#78716C] text-lg leading-relaxed mb-10 max-w-[420px] font-sans">
              Premium hair, skin &amp; nail services delivered by expert stylists.
              Walk in, walk out beautiful.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-14">
              <button
                onClick={() => scrollTo('booking')}
                className="inline-flex items-center gap-2 bg-[#4A7C59] text-white px-7 py-3.5 rounded-full font-sans font-semibold text-sm hover:bg-[#3A6246] active:scale-95 transition-all duration-200 shadow-sm shadow-[#4A7C59]/25"
              >
                Book an Appointment
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => scrollTo('services')}
                className="inline-flex items-center gap-2 border border-[#1C1917]/20 bg-white text-[#1C1917] px-7 py-3.5 rounded-full font-sans font-semibold text-sm hover:border-[#4A7C59] hover:text-[#4A7C59] hover:bg-[#EFF5F1] active:scale-95 transition-all duration-200"
              >
                Explore Services
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-0 pt-8 border-t border-[#E8E1D9] w-fit">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-0">
                  <div className={i > 0 ? 'pl-8' : ''}>
                    <p className="font-sans font-bold text-2xl text-[#1C1917] leading-none">{stat.value}</p>
                    <p className="text-[#A8A29E] text-xs font-sans font-medium mt-0.5">{stat.label}</p>
                  </div>
                  {i < STATS.length - 1 && <div className="ml-8 w-px h-10 bg-[#E8E1D9]" />}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Slideshow ── */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center">
            {/* Glow ring behind the frame */}
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[#4A7C59]/15 via-transparent to-[#D4A853]/15 blur-2xl pointer-events-none" />

            {/* Slide frame */}
            <div className="relative w-full max-w-[480px] rounded-[2rem] overflow-hidden shadow-2xl shadow-[#1C1917]/10 aspect-[4/5]">
              {SLIDES.map((slide, i) => (
                <div
                  key={slide.src}
                  className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
                  style={{
                    opacity: i === current ? 1 : i === prev ? 0 : 0,
                    zIndex: i === current ? 1 : i === prev ? 0 : -1,
                  }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.label}
                    fill
                    sizes="(max-width: 768px) 90vw, 480px"
                    className="object-cover object-center"
                    priority={i === 0}
                  />
                </div>
              ))}
              {/* Bottom overlay — slide label + dots */}
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-[#1C1917]/40 to-transparent px-5 pb-4 pt-10 flex items-end justify-between">
                <p className="font-sans text-white/80 text-xs font-medium tracking-wide">
                  {SLIDES[current].label}
                </p>
                <div className="flex gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === current ? '20px' : '6px',
                        height: '6px',
                        background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
                      }}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating card — bottom left */}
            <div className="absolute -bottom-4 -left-4 lg:-left-8 bg-white rounded-2xl shadow-lg px-4 py-3.5 flex items-center gap-3 border border-[#E8E1D9] z-20">
              <div className="w-10 h-10 rounded-xl bg-[#EFF5F1] flex items-center justify-center text-xl">✂</div>
              <div>
                <p className="font-sans font-bold text-sm text-[#1C1917] leading-tight">Expert Stylists</p>
                <p className="font-sans text-[11px] text-[#A8A29E] mt-0.5">Mon–Sat, 9AM–6PM</p>
              </div>
            </div>

            {/* Floating card — top right */}
            <div className="absolute -top-4 -right-4 lg:-right-6 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2.5 border border-[#E8E1D9] z-20">
              <span className="text-[#D4A853] text-lg">⭐</span>
              <div>
                <p className="font-sans font-bold text-sm text-[#1C1917] leading-tight">5.0 Rating</p>
                <p className="font-sans text-[11px] text-[#A8A29E]">500+ reviews</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
