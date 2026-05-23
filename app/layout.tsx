import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
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

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
  themeColor: '#4A7C59',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jakarta.variable} bg-[#FAF7F2] text-[#1C1917] antialiased`}>
        <Cursor />
         <Nav />
        <main>{children}</main>
        <Footer />
        <script src="/voice-widget.js" defer></script>
      </body>
    </html>
  );
}
