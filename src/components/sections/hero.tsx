'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const SLIDES = [
  { src: '/images/hero1.jpg', label: 'Hair Highlights' },
  { src: '/images/hero2.jpg', label: 'Hair Styling' },
  { src: '/images/hero3.jpg', label: 'Hair Color' },
  { src: '/images/hero4.jpg', label: 'Image Salon & Spa' },
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
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 900);
    },
    [animating, current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    const elements = document.querySelectorAll('.fade-up');
    const delays = [200, 400, 600, 800];
    elements.forEach((el, i) => {
      setTimeout(
        () => el.classList.add('visible'),
        delays[i] ?? i * 200
      );
    });
  }, []);

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Slideshow background */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 w-full h-full transition-opacity duration-[900ms] ease-in-out"
          style={{
            opacity: i === current ? 1 : i === prev ? 0 : 0,
            zIndex: i === current ? 1 : i === prev ? 0 : -1,
          }}
        >
          <Image
            src={slide.src}
            alt={slide.label}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Replaced "Est. 2024" with elegant tagline */}
        <div className="flex items-center justify-center gap-4 mb-8 fade-up">
          <div className="h-px w-16 bg-[#B8860B]" />
          <p className="text-[#B8860B] uppercase tracking-[0.6em] text-xs font-sans">
            Where Beauty Meets Excellence
          </p>
          <div className="h-px w-16 bg-[#B8860B]" />
        </div>

        <h1 className="font-display text-7xl md:text-9xl text-white font-light italic mb-6 fade-up">
          Image Salon
        </h1>

        <div className="flex items-center justify-center gap-4 mb-8 fade-up">
          <div className="h-px w-24 bg-[#B8860B]/50" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#B8860B]" />
          <div className="h-px w-24 bg-[#B8860B]/50" />
        </div>

        <p className="text-gray-300 text-lg md:text-xl mb-12 font-sans font-light tracking-widest fade-up">
          Premium Salon & Spa Services
        </p>

        <div className="fade-up">
          <Button size="lg" onClick={scrollToBooking}>
            Book an Appointment
          </Button>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group flex flex-col items-center gap-1"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className="block h-px transition-all duration-500"
              style={{
                width: i === current ? '32px' : '16px',
                backgroundColor: i === current ? '#B8860B' : 'rgba(184,134,11,0.35)',
              }}
            />
          </button>
        ))}
      </div>

      {/* Current slide label */}
      <div className="absolute bottom-28 right-8 z-10 hidden md:block">
        <p
          key={current}
          className="text-[#B8860B]/60 text-xs uppercase tracking-[0.4em] font-sans"
        >
          {SLIDES[current].label}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 z-10">
        <div className="w-px h-12 bg-[#B8860B] animate-pulse" />
        <p className="text-[#B8860B] text-[9px] uppercase tracking-[0.4em] font-sans">Scroll</p>
      </div>
    </section>
  );
}
