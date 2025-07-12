import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Houston Development Intelligence | Premier Land Development Opportunities",
  description: "Discover exclusive Houston development opportunities with advanced market intelligence. 15 years experience, $483M in deals across Harris County. Off-market land deals and development sites.",
  keywords: "houston development intelligence, houston land development, harris county property, houston development opportunities, off market land houston, houston real estate, houston commercial real estate, harris county development, houston builder lots, houston land deals",
  authors: [{ name: "Houston Development Intelligence" }],
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
    title: "Houston Development Intelligence | Premier Land Development Opportunities",
    description: "Discover exclusive Houston development opportunities with advanced market intelligence. 15 years experience, $483M+ in deals across Harris County.",
    url: "https://houstonlandguy.com",
    siteName: "Houston Development Intelligence",
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
    title: "Houston Development Intelligence | Premier Land Development Opportunities",
    description: "Discover exclusive Houston development opportunities with advanced market intelligence. 15 years experience, $483M+ in deals.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://houstonlandguy.com/#organization",
                  name: "Houston Development Intelligence",
                  alternateName: "Houston Land Guy",
                  url: "https://houstonlandguy.com",
                  description: "Premier Houston development intelligence and off-market land opportunities. 15 years experience with $483M+ in transactions across Harris County.",
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
                  slogan: "Houston's Premier Development Intelligence Platform"
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://houstonlandguy.com/#business",
                  name: "Houston Development Intelligence",
                  businessType: "Real Estate Development Consultancy",
                  url: "https://houstonlandguy.com",
                  description: "Exclusive Houston development opportunities and off-market land deals. Advanced market intelligence for builders, developers, and investors in Harris County.",
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
                  name: "Houston Development Intelligence",
                  description: "Specialized real estate development consulting for Houston and Harris County",
                  areaServed: "Harris County, Texas",
                  serviceArea: ["Houston", "The Woodlands", "Katy", "Sugar Land", "Cypress", "Spring Branch"],
                  specialty: ["Development land acquisition", "Market intelligence", "Off-market opportunities"],
                  knowsAbout: ["Houston real estate market", "Harris County zoning", "Development regulations", "Investment analysis"]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://houstonlandguy.com/#website",
                  url: "https://houstonlandguy.com",
                  name: "Houston Development Intelligence",
                  description: "Premier Houston development intelligence platform providing exclusive off-market land deals and market analysis",
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
