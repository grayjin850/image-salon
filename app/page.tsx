import { Hero } from '@/components/sections/hero';
import { ServicesGrid } from '@/components/sections/services-grid';
import { ServiceMenu } from '@/components/sections/service-menu';
import { GalleryGrid } from '@/components/sections/gallery-grid';
import { Testimonials } from '@/components/sections/testimonials';
import { BookingForm } from '@/components/sections/booking-form';
import { Loader } from '@/components/ui/loader';
import { Cursor } from '@/components/ui/cursor';
import { About } from '@/components/sections/about';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ServicesGrid />
      <ServiceMenu />
      <GalleryGrid />
      <Testimonials />
      <BookingForm />
      <Loader />
      <Cursor />
    </>
  );
}