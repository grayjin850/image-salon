import Link from 'next/link';
import Image from 'next/image';
import { CONTACT_INFO, BUSINESS_HOURS } from '@/constants';

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#B8860B]/20 py-20">
      <div className="max-w-7xl mx-auto px-8">

        {/* Center Logo */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo.png"
              alt="Image Salon & Spa"
              width={90}
              height={90}
              className="object-contain opacity-90"
            />
          </div>
          <h2 className="font-display text-5xl md:text-6xl italic text-white font-light mb-4">
            Image Salon
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#B8860B]/50" />
            <p className="text-[#B8860B] text-xs uppercase tracking-[0.4em] font-sans">
              Where Beauty Meets Excellence
            </p>
            <div className="h-px w-16 bg-[#B8860B]/50" />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="text-center">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-[#B8860B] font-sans mb-4">Hours</h4>
            <p className="text-gray-400 text-xs font-sans tracking-wide">{BUSINESS_HOURS.days}</p>
            <p className="text-gray-400 text-xs font-sans tracking-wide">
              {BUSINESS_HOURS.open} — {BUSINESS_HOURS.close}
            </p>
          </div>

          <div className="text-center">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-[#B8860B] font-sans mb-4">Contact</h4>
            <p className="text-gray-400 text-xs font-sans tracking-wide">{CONTACT_INFO.phone}</p>
            <p className="text-gray-400 text-xs font-sans tracking-wide">{CONTACT_INFO.email}</p>
          </div>

          <div className="text-center">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-[#B8860B] font-sans mb-4">Follow Us</h4>
            <div className="flex justify-center items-center gap-3">

              {/* Facebook button */}
              <Link
                href={CONTACT_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#1665d8] text-white text-xs uppercase tracking-[0.25em] font-sans px-4 py-2.5 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                Facebook
              </Link>

              {/* Instagram button */}
              <Link
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white text-xs uppercase tracking-[0.25em] font-sans px-4 py-2.5 transition-colors duration-300 border border-gray-700 hover:border-[#B8860B] hover:text-[#B8860B]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </Link>

            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#B8860B]/30 to-transparent mb-8" />

        {/* Copyright */}
        <p className="text-center text-gray-600 text-[10px] uppercase tracking-[0.4em] font-sans">
          © {new Date().getFullYear()} Image Salon & Spa. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
