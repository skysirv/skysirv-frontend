import { Metadata } from 'next';
import Script from 'next/script';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import { Inter } from 'next/font/google';
import 'styles/main.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '800']
});

const title = 'Skysirv';
const description =
  'Flight intelligence that helps travelers understand pricing and book with more confidence.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title,
  description,
  openGraph: {
    title,
    description
  },
  icons: {
    icon: [
      { url: '/branding/favicon/favicon.ico' },
      { url: '/branding/icon/skysirv-icon-white-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/branding/icon/skysirv-icon-white-16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: '/branding/icon/skysirv-icon-512.png'
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        (function () {
          try {
            const storedTheme = localStorage.getItem('theme');

            if (storedTheme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (e) {}
        })();
        `
          }}
        />
      </head>

      <body
        className={`${inter.className} min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100`}
      >
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />

        <Navbar />

        <main
          id="skip"
          className="min-h-[calc(100dvh-4rem)] pt-28 md:min-h-[calc(100dvh-5rem)] md:pt-32"
        >
          {children}
        </main>

        <Footer />

        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}