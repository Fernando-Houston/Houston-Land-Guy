import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Your Houston Land Fast | Cash Offers in 7 Days | Houston Development Intelligence",
  description: "Get cash for your Houston property in 7 days. No repairs, no commissions, no hassles. We buy land, commercial, and development sites as-is. Free valuation. $483M+ in purchases.",
  keywords: "sell land houston, houston land buyers, sell development property houston, cash for land houston, sell commercial property houston, houston property valuation, quick land sale houston, sell vacant land houston, houston cash buyers, sell property fast houston",
  authors: [{ name: "Houston Development Intelligence" }],
  openGraph: {
    title: "Sell Your Houston Land Fast | Cash Offers | No Commissions",
    description: "Get top dollar for your Houston property. Quick closing, cash offers, no repairs needed. 15+ years, $483M+ in purchases.",
    url: "https://houstonlandguy.com/sellers/",
    siteName: "Houston Development Intelligence",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/houston-land-sellers.jpg",
        width: 1200,
        height: 630,
        alt: "Sell Your Houston Land Fast - Cash Offers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Your Houston Land Fast | Cash Offers",
    description: "Need to sell Houston property? Get cash offers in 48 hours. No repairs, no commissions. 7-day closing available.",
    images: ["/houston-land-sellers.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/sellers/",
  },
};

export default function SellersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                "@id": "https://houstonlandguy.com/#business",
                name: "Houston Development Intelligence",
                description: "Houston's premier land and property buyer. Cash offers, quick closing, no commissions.",
                url: "https://houstonlandguy.com",
                telephone: "(713) 555-LAND",
                email: "sellers@houstonlandguy.com",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "1000 Main Street, Suite 2300",
                  addressLocality: "Houston",
                  addressRegion: "TX",
                  postalCode: "77002",
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
                    "@type": "AdministrativeArea",
                    name: "Fort Bend County"
                  },
                  {
                    "@type": "AdministrativeArea",
                    name: "Montgomery County"
                  }
                ],
                priceRange: "$$$$",
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.9",
                  reviewCount: "523",
                  bestRating: "5"
                }
              },
              {
                "@type": "Service",
                "@id": "https://houstonlandguy.com/sellers/#service",
                serviceType: "Property Buying Service",
                provider: {
                  "@id": "https://houstonlandguy.com/#business"
                },
                areaServed: {
                  "@type": "City",
                  name: "Houston"
                },
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Property Buying Services",
                  itemListElement: [
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Cash Property Purchase",
                        description: "Quick cash offers for Houston properties"
                      }
                    },
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Free Property Valuation",
                        description: "Complimentary property value assessment"
                      }
                    },
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Quick Closing",
                        description: "Close in as little as 7 days"
                      }
                    }
                  ]
                }
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "How quickly can you close on my Houston property?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We can close in as little as 7 days for cash purchases. Our typical closing timeline is 14-21 days, but we can work with your schedule. We handle all paperwork and can even arrange remote closing for out-of-state sellers."
                    }
                  },
                  {
                    "@type": "Question",
                    name: "What types of properties do you buy in Houston?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We buy all types of properties including vacant land, development sites, commercial properties, industrial land, distressed properties, estate sales, and properties with title issues. No property is too big or too small."
                    }
                  },
                  {
                    "@type": "Question",
                    name: "Do I need to make repairs before selling?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No repairs needed! We buy properties as-is. Whether your property needs clearing, has environmental issues, or requires major repairs, we'll make you a fair cash offer based on its current condition."
                    }
                  },
                  {
                    "@type": "Question",
                    name: "How do you determine your offer price?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We evaluate location, size, zoning, development potential, market conditions, and comparable sales. Our 15+ years of Houston market experience ensures you get a fair offer that reflects your property's true value."
                    }
                  },
                  {
                    "@type": "Question",
                    name: "Are there any fees or commissions?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No! Unlike traditional real estate sales, there are no commissions, fees, or hidden costs. The price we offer is the amount you receive at closing. We even cover all closing costs."
                    }
                  }
                ]
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://houstonlandguy.com"
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Sell Your Land",
                    item: "https://houstonlandguy.com/sellers"
                  }
                ]
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}