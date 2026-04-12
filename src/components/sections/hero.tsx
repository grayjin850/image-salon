'use client';

import { Button } from '@/components/ui/button';

export function Hero() {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#B8860B10_0%,_transparent_70%)]" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-[#B8860B] uppercase tracking-[0.5em] text-xs mb-6">
          Welcome to
        </p>
        <h1 className="font-heading text-6xl md:text-8xl text-white mb-6">
          Image Salon
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Where beauty meets excellence. Experience luxury hair, skin, and nail services.
        </p>
        <Button size="lg" onClick={scrollToBooking}>
          Book an Appointment
        </Button>
      </div>
    </section>
  );
}