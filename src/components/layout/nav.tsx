'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Testimonials', href: '#testimonials' },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('/')) {
      window.location.href = href;
      return;
    }
    const id = href.replace('#', '');
    if (window.location.pathname !== '/') {
      window.location.href = '/' + href;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E8E1D9] shadow-sm'
            : 'bg-[#FAF7F2]/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo.png"
              alt="Image Salon & Spa"
              width={36}
              height={36}
              className="object-contain"
            />
            <div className="hidden sm:block leading-tight">
              <p className="font-sans font-bold text-[#1C1917] text-sm tracking-tight">Image Salon</p>
              <p className="font-sans text-[9px] text-[#4A7C59] tracking-[0.18em] uppercase">& Spa</p>
            </div>
          </Link>

          {/* Desktop nav links — centered pill group */}
          <div className="hidden md:flex items-center gap-0.5 bg-white/70 border border-[#E8E1D9] rounded-full px-2 py-1.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="px-4 py-1.5 rounded-full text-[13px] font-sans font-medium text-[#44403C] hover:text-[#4A7C59] hover:bg-[#EFF5F1] transition-all duration-200 whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right: Book CTA + mobile hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/booking"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#4A7C59] text-white px-5 py-2 rounded-full text-[13px] font-sans font-semibold hover:bg-[#3A6246] transition-colors shadow-sm"
            >
              Book Now
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-full hover:bg-[#EFF5F1] transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <span className={`h-[1.5px] w-5 bg-[#1C1917] rounded-full transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`h-[1.5px] w-5 bg-[#1C1917] rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`h-[1.5px] w-5 bg-[#1C1917] rounded-full transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[10004] md:hidden transition-all duration-300 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />

        {/* Slide-in panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-16 flex items-center px-6 border-b border-[#E8E1D9]">
            <p className="font-sans font-bold text-[#1C1917] text-sm">Menu</p>
          </div>

          <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="w-full text-left px-4 py-3 rounded-xl font-sans font-medium text-[#44403C] hover:text-[#4A7C59] hover:bg-[#EFF5F1] transition-all duration-200 text-sm"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-6 pb-8">
            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#4A7C59] text-white py-3 rounded-full font-sans font-semibold text-sm hover:bg-[#3A6246] transition-colors"
            >
              Book an Appointment
            </Link>
            <p className="text-[#A8A29E] text-[11px] font-sans text-center mt-4">
              +691 320 3289 · Mon–Sat 9AM–6PM
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
