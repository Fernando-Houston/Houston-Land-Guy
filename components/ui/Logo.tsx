'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'auto';
}

export function Logo({ className = '', showText = true, variant = 'auto' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center group ${className}`}>
      <div className="flex items-center hover:scale-105 transition-transform duration-200">
        <Image
          src="/houston-land-guy-logo-header.png"
          alt="Houston Land Guy - Development Intelligence"
          width={220}
          height={70}
          className="h-14 w-auto"
          priority
        />
      </div>
    </Link>
  );
}