import type { Metadata } from 'next';
import { Cormorant_Garamond, Raleway } from 'next/font/google';
import { Nav } from '@/components/layout/nav';
import { Footer } from '@/components/layout/footer';
import './globals.css';
import { Cursor } from '@/components/ui/cursor';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Image Salon | Hair, Skin & Nail Services',
  description: 'Experience luxury hair, skin, and nail services at Image Salon. Book your appointment today.',
  openGraph: {
    title: 'Image Salon',
    description: 'Where beauty meets excellence.',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#B8860B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${raleway.variable} bg-black text-white antialiased`}>
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}