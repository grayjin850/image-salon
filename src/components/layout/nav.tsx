'use client';

import { useState } from 'react';
import { NAV_LINKS } from '@/constants';

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-[#B8860B]/20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-[#B8860B] uppercase tracking-widest font-semibold text-lg">
          Image Salon
        </span>
        <ul className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-xs uppercase tracking-widest text-gray-300 hover:text-[#B8860B] transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button className="md:hidden text-[#B8860B]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      {isOpen && (
        <ul className="md:hidden flex flex-col bg-black border-t border-[#B8860B]/20">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setIsOpen(false)} className="block px-6 py-4 text-xs uppercase tracking-widest text-gray-300 hover:text-[#B8860B] transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}