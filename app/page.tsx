import { Hero } from '@/components/sections/hero';
import { ServicesGrid } from '@/components/sections/services-grid';
import { ServiceMenu } from '@/components/sections/service-menu';
import { GalleryGrid } from '@/components/sections/gallery-grid';
import { Testimonials } from '@/components/sections/testimonials';
import { BookingForm } from '@/components/sections/booking-form';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <ServiceMenu />
      <GalleryGrid />
      <Testimonials />
      <BookingForm />
    </>
  );
}