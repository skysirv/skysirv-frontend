'use client';

import { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';

export default function MainContentShell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const isFullBleedPage =
    pathname === '/pricing' ||
    pathname === '/dev/pricing-lab' ||
    pathname === '/choose-plan' ||
    pathname.startsWith('/dev/plan-with-lucy-lab') ||
    pathname.startsWith('/dev/booking-lab') ||
    pathname.startsWith('/dev/plan-smarter-lab') ||
    pathname.startsWith('/dev/lucy-trip-lab') ||
    pathname === '/booking' ||
    pathname === '/beta';

  return (
    <main
      id="skip"
      className={
        isHomePage || isFullBleedPage
          ? 'min-h-screen'
          : 'min-h-[calc(100dvh-4rem)] pt-28 md:min-h-[calc(100dvh-5rem)] md:pt-32'
      }
    >
      {children}
    </main>
  );
}