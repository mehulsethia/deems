import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@fontsource-variable/bricolage-grotesque';
import './globals.css';
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
import { MotionProvider } from '@/components/Reveal';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `Deems: ${site.tagline}`, template: '%s · Deems' },
  description: site.description,
  applicationName: 'Deems',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'Deems',
    title: `Deems: ${site.tagline}`,
    description: site.description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Deems. Reply and leave.' }],
  },
  twitter: { card: 'summary_large_image', title: `Deems: ${site.tagline}`, description: site.description, images: ['/og.png'] },
};

export const viewport: Viewport = {
  themeColor: '#0E0F12',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <MotionProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
