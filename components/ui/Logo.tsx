'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'auto';
}

export function Logo({ className = '', showText = true, variant = 'auto' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center group ${className}`}>
      <motion.div
        className="flex items-center"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Custom CSS Logo */}
        <div className="flex items-center space-x-3">
          {/* Location Pin Icon */}
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-green-600"></div>
          </div>
          
          {/* Company Text */}
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 tracking-wide leading-none group-hover:text-green-600 transition-colors duration-200">
                HOUSTON
              </span>
              <span className="text-xl font-black text-gray-900 tracking-wide leading-none group-hover:text-green-600 transition-colors duration-200">
                LAND GUY
              </span>
            </div>
            <span className="text-xs font-semibold text-green-700 tracking-wider mt-0.5 opacity-90">
              Development Intelligence
            </span>
          </div>
          
          {/* Texas Icon */}
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 transform rotate-12 rounded-sm shadow-md flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}