import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import { Nav } from '@/components/layout/nav';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Image Salon | Hair, Skin & Nail Services',
  description: 'Experience luxury hair, skin, and nail services at Image Salon. Book your appointment today.',
  openGraph: {
    title: 'Image Salon',
    description: 'Where beauty meets excellence.',
    type: 'website',
  },
  themeColor: '#B8860B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} bg-black text-white antialiased font-body`}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}