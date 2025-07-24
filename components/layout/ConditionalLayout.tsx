'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import FloatingActions from '@/components/enhanced/FloatingActions';
// import OnboardingFlow from '@/components/enhanced/OnboardingFlow';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Don't use pathname logic on server-side to prevent hydration mismatch
  const isAdminRoute = isClient && pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // For admin routes, just render children without header/footer
    return <>{children}</>;
  }

  // For all other routes, render with header and footer
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
      {/* <OnboardingFlow /> */}
    </div>
  );
}