'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NAV_LINKS } from '@/constants';

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = NAV_LINKS.map((l) => l.href.replace('#', ''));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
  setIsOpen(false);

  // Kung may / prefix — direct navigation (e.g. /booking)
  if (href.startsWith('/')) {
    window.location.href = href;
    return;
  }

  const id = href.replace('#', '');

  // Kung nasa ibang page, pumunta muna sa home tapos scroll
  if (window.location.pathname !== '/') {
    window.location.href = '/' + href;
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

  const linkClass = (href: string) =>
    `text-[10px] uppercase tracking-[0.4em] font-sans transition-colors duration-300 ${
      activeSection === href.replace('#', '')
        ? 'text-[#B8860B]'
        : 'text-gray-300 hover:text-[#B8860B]'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-[#B8860B]/30'
          : 'bg-transparent'
      }`}
    >
      {/* Top bar — contact number (hides on scroll) */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
        }`}
      >
        <div className="flex justify-end items-center px-8 py-1.5 border-b border-[#B8860B]/15">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.45 5.45l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="text-[#B8860B] text-[10px] uppercase tracking-[0.3em] font-sans">
              +691 320 3289
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo + Name */}
       <Link
  href="/"
  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
>
          <Image
            src="/images/logo.png"
            alt="Image Salon & Spa"
            width={44}
            height={44}
            className="object-contain"
          />
          <div className="flex-col items-start hidden sm:flex">
            <span className="font-display text-lg italic text-[#B8860B] tracking-widest leading-tight">
              Image Salon & Spa
            </span>
            <span className="text-[8px] uppercase tracking-[0.35em] text-[#B8860B]/50 font-sans leading-tight">
              Where Beauty Meets Excellence
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              {link.href.startsWith('/') ? (
                <Link href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              ) : (
                <button
                  onClick={() => handleNavClick(link.href)}
                  className={linkClass(link.href)}
                >
                  {link.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[10px] uppercase tracking-[0.4em] text-[#B8860B] font-sans"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          <Image
            src="/images/logo.png"
            alt="Image Salon & Spa"
            width={80}
            height={80}
            className="object-contain mb-2"
          />
          <div className="text-center mb-2">
            <p className="font-display text-2xl italic text-[#B8860B] tracking-widest">
              Image Salon & Spa
            </p>
            <p className="text-[8px] uppercase tracking-[0.35em] text-[#B8860B]/50 font-sans mt-1">
              Where Beauty Meets Excellence
            </p>
          </div>
          {NAV_LINKS.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontStyle: 'italic',
                  color: '#B8860B',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontStyle: 'italic',
                  color: activeSection === link.href.replace('#', '') ? '#B8860B' : 'white',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {link.label}
              </button>
            )
          ))}
          <p className="text-[#B8860B]/50 text-[10px] uppercase tracking-[0.3em] font-sans mt-4">
            +691 320 3289
          </p>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '2rem',
              color: '#999',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </nav>
  );
}
