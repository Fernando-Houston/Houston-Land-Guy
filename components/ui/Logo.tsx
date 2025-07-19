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
      <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-200">
        {/* Intelligence Hub Logo */}
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
        
        {/* Text Logo */}
        {showText && (
          <div className="flex flex-col">
            <div className="text-lg font-bold text-gray-900 leading-tight">
              Houston Development
            </div>
            <div className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              Intelligence Hub
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}