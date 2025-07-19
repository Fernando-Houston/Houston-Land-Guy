import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Houston Development Intelligence Hub | AI-Powered Real Estate Analytics",
  description: "Real-time Houston market intelligence powered by Fernando-X AI. Advanced analytics for developers, sellers, and investors. 3D maps, AI scout, zoning intelligence, and more.",
  keywords: "houston development intelligence, fernando-x ai, houston real estate analytics, ai development scout, houston market intelligence, real-time property data, houston zoning ai, development cost intelligence, houston permit tracker, investment analytics houston",
  authors: [{ name: "Houston Development Intelligence Hub" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Houston Development Intelligence Hub | AI-Powered Analytics Platform",
    description: "Real-time market intelligence powered by Fernando-X AI. Advanced analytics for Houston real estate professionals. 24/7 AI assistant, 3D maps, and predictive insights.",
    url: "https://houstonlandguy.com",
    siteName: "Houston Development Intelligence Hub",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/houston-development-opportunities.jpg",
        width: 1200,
        height: 630,
        alt: "Houston skyline showing development opportunities and growth potential",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Development Intelligence Hub | AI-Powered Analytics",
    description: "Real-time market intelligence powered by Fernando-X AI. Advanced analytics for Houston real estate. 24/7 AI assistant & predictive insights.",
    images: ["/houston-development-opportunities.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7C3AED" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Houston Intel" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://houstonlandguy.com/#organization",
                  name: "Houston Development Intelligence Hub",
                  alternateName: "HDI Hub",
                  url: "https://houstonlandguy.com",
                  description: "AI-powered real estate intelligence platform featuring Fernando-X assistant, real-time analytics, 3D visualization, and predictive market insights for Houston professionals.",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Houston",
                    addressRegion: "TX",
                    addressCountry: "US"
                  },
                  areaServed: [
                    {
                      "@type": "City",
                      name: "Houston"
                    },
                    {
                      "@type": "AdministrativeArea",
                      name: "Harris County"
                    },
                    {
                      "@type": "City",
                      name: "The Woodlands"
                    },
                    {
                      "@type": "City", 
                      name: "Katy"
                    },
                    {
                      "@type": "City",
                      name: "Sugar Land"
                    }
                  ],
                  foundingDate: "2009",
                  slogan: "AI-Powered Intelligence for Houston Real Estate"
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://houstonlandguy.com/#business",
                  name: "Houston Development Intelligence Hub",
                  businessType: "AI-Powered Real Estate Intelligence Platform",
                  url: "https://houstonlandguy.com",
                  description: "Comprehensive intelligence platform featuring Fernando-X AI assistant, real-time market analytics, 3D development maps, and predictive insights for Houston real estate professionals.",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Houston",
                    addressRegion: "TX",
                    addressCountry: "US"
                  },
                  areaServed: {
                    "@type": "GeoCircle",
                    geoMidpoint: {
                      "@type": "GeoCoordinates",
                      latitude: 29.7604,
                      longitude: -95.3698
                    },
                    geoRadius: "50 miles"
                  },
                  priceRange: "$$$$",
                  paymentAccepted: ["Cash", "Check", "Wire Transfer"],
                  yearsSinceEstablished: 15,
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Houston Development Services",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Off-Market Land Acquisition",
                          description: "Exclusive access to off-market Houston development opportunities"
                        }
                      },
                      {
                        "@type": "Offer", 
                        itemOffered: {
                          "@type": "Service",
                          name: "Development Site Analysis",
                          description: "Comprehensive Houston development feasibility studies"
                        }
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service", 
                          name: "Market Intelligence Reports",
                          description: "Real-time Houston real estate market analysis and trends"
                        }
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Builder Lot Sourcing",
                          description: "Premium Houston builder lots and developer properties"
                        }
                      }
                    ]
                  }
                },
                {
                  "@type": "RealEstateAgent",
                  "@id": "https://houstonlandguy.com/#agent",
                  name: "Houston Development Intelligence Hub",
                  description: "AI-powered intelligence platform for Houston real estate professionals",
                  areaServed: "Harris County, Texas",
                  serviceArea: ["Houston", "The Woodlands", "Katy", "Sugar Land", "Cypress", "Spring Branch"],
                  specialty: ["Development land acquisition", "Market intelligence", "Off-market opportunities"],
                  knowsAbout: ["Houston real estate market", "Harris County zoning", "Development regulations", "Investment analysis"]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://houstonlandguy.com/#website",
                  url: "https://houstonlandguy.com",
                  name: "Houston Development Intelligence Hub",
                  description: "AI-powered real estate intelligence platform featuring Fernando-X assistant, real-time analytics, and predictive market insights for Houston professionals",
                  publisher: {
                    "@id": "https://houstonlandguy.com/#organization"
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: "https://houstonlandguy.com/search?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // requestIdleCallback polyfill for Safari and other browsers
              if (!window.requestIdleCallback) {
                window.requestIdleCallback = function (cb) {
                  var start = Date.now();
                  return setTimeout(function () {
                    cb({
                      didTimeout: false,
                      timeRemaining: function () {
                        return Math.max(0, 50 - (Date.now() - start));
                      }
                    });
                  }, 1);
                }
              }
              
              if (!window.cancelIdleCallback) {
                window.cancelIdleCallback = function (id) {
                  clearTimeout(id);
                }
              }
            `
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <GoogleAnalytics />
        <ConditionalLayout>{children}</ConditionalLayout>
        <InstallPrompt />
        <Analytics />
        <SpeedInsights />
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#059669',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#DC2626',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
