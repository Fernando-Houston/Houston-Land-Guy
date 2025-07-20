'use client';

import { useEffect, useState } from 'react';

export function HeroVideo() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Check if we're on a slow connection
    if (typeof navigator !== 'undefined') {
      const connection = (navigator as any).connection;
      if (connection && (connection.saveData || connection.effectiveType === 'slow-2g')) {
        setHasError(true); // Use fallback on slow connections
        return;
      }
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Force play on mobile if autoplay fails
  useEffect(() => {
    if (!isLoading && !hasError && isMobile) {
      const video = document.getElementById('hero-video') as HTMLVideoElement;
      if (video && video.paused) {
        video.play().catch(() => {
          // If autoplay fails, show poster image
          console.log('Autoplay failed on mobile');
        });
      }
    }
  }, [isLoading, hasError, isMobile]);

  if (hasError) {
    return (
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500 via-emerald-600 to-gray-900" />
    );
  }

  return (
    <>
      {/* Loading state - gradient background */}
      {isLoading && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500 via-emerald-600 to-gray-900 animate-pulse" />
      )}
      
      {/* Video */}
      <video
        id="hero-video"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        x-webkit-airplay="allow"
        poster="https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/df599a037464f8c9e45dc495484035ee/thumbnails/thumbnail.jpg"
        preload={isMobile ? "none" : "metadata"}
        onLoadedData={handleLoadedData}
        onError={handleError}
        controlsList="nodownload nofullscreen noremoteplayback"
      >
        {/* HLS stream for better adaptive quality */}
        <source 
          src="https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/df599a037464f8c9e45dc495484035ee/manifest/video.m3u8" 
          type="application/x-mpegURL" 
        />
        {/* Fallback MP4 */}
        <source 
          src="https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/df599a037464f8c9e45dc495484035ee/watch" 
          type="video/mp4" 
        />
      </video>
      
      {/* Fallback gradient always present but behind video */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500 via-emerald-600 to-gray-900 -z-10" />
    </>
  );
}