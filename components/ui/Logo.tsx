'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'auto';
}

export function Logo({ className = '', showText = true, variant = 'auto' }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // Use the actual Houston Land Group logo
  const logoImagePath = '/houston-land-group-logo.png';
  
  const textColor = variant === 'light' ? 'text-white' : 
                   variant === 'dark' ? 'text-gray-900' : 
                   'text-gray-900'; // default

  return (
    <Link href="/" className={`flex items-center group ${className}`}>
      <motion.div
        className="flex items-center"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Try to show image logo first */}
        {!imageError && (
          <div className="relative mr-3">
            <Image
              src={logoImagePath}
              alt="Houston Land Group Logo"
              width={180}
              height={60}
              className="h-12 w-auto transition-all duration-200 drop-shadow-sm hover:drop-shadow-md"
              onError={() => setImageError(true)}
              priority
            />
          </div>
        )}
        
        {/* Fallback text logo if image fails to load */}
        {imageError && (
          <div className="flex flex-col">
            <span className={`text-lg font-bold ${textColor} group-hover:text-green-600 transition-colors`}>
              Houston Land Group
            </span>
            <span className="text-sm text-gray-600 -mt-1">
              Development Intelligence
            </span>
          </div>
        )}
      </motion.div>
    </Link>
  );
}