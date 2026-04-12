import { CONTACT_INFO, BUSINESS_HOURS } from '@/constants';

export function Footer() {
  return (
    <footer className="bg-black border-t border-[#B8860B]/20 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-[#B8860B] uppercase tracking-widest font-semibold text-lg mb-3">
            Image Salon
          </h3>
          <p className="text-gray-400 text-sm">Where beauty meets excellence.</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#B8860B] mb-3">Hours</h4>
          <p className="text-gray-400 text-sm">{BUSINESS_HOURS.days}</p>
          <p className="text-gray-400 text-sm">{BUSINESS_HOURS.open} — {BUSINESS_HOURS.close}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#B8860B] mb-3">Contact</h4>
          <p className="text-gray-400 text-sm">{CONTACT_INFO.phone}</p>
          <p className="text-gray-400 text-sm">{CONTACT_INFO.email}</p>
          <p className="text-gray-400 text-sm mt-2">{CONTACT_INFO.address}</p>
          <div className="flex gap-4 mt-4">
            <a href={CONTACT_INFO.facebook} target="_blank" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#B8860B] transition-colors">
              Facebook
            </a>
            <a href={CONTACT_INFO.instagram} target="_blank" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#B8860B] transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8 text-xs text-gray-600 uppercase tracking-widest">
        © {new Date().getFullYear()} Image Salon. All rights reserved.
      </div>
    </footer>
  );
}