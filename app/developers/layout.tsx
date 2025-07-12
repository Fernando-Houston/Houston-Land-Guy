import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Land Development Partners | Exclusive Off-Market Opportunities",
  description: "Partner with Houston's premier land acquisition experts. Access exclusive off-market development sites, comprehensive due diligence, and 15+ years of local expertise. $483M+ in successful transactions.",
  keywords: "houston land development, houston developer partners, houston off-market land, houston development sites, houston land acquisition, houston real estate developers, houston development opportunities, houston land deals",
  authors: [{ name: "Houston Development Intelligence" }],
  openGraph: {
    title: "Houston Development Partners | Premier Land Acquisition",
    description: "Join 500+ successful developers. Access exclusive off-market sites with 15+ years local expertise.",
    url: "https://houstonlandguy.com/developers/",
    siteName: "Houston Development Intelligence",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/houston-developer-partners.jpg",
        width: 1200,
        height: 630,
        alt: "Houston Development Intelligence - Developer Partnerships",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Development Partners | Exclusive Land Opportunities",
    description: "Access off-market development sites in Houston's hottest markets. 15+ years, $483M+ in deals.",
    images: ["/houston-developer-partners.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/developers/",
  },
};

export default function DevelopersLayout({
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
                "@type": "RealEstateAgent",
                "@id": "https://houstonlandguy.com/#agent",
                name: "Houston Development Intelligence",
                description: "Premier Houston land acquisition and development partner",
                url: "https://houstonlandguy.com",
                telephone: "(713) 555-LAND",
                email: "info@houstonlandguy.com",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "1000 Main Street, Suite 2300",
                  addressLocality: "Houston",
                  addressRegion: "TX",
                  postalCode: "77002",
                  addressCountry: "US"
                },
                areaServed: {
                  "@type": "City",
                  name: "Houston",
                  containedInPlace: {
                    "@type": "State",
                    name: "Texas"
                  }
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.9",
                  reviewCount: "147",
                  bestRating: "5"
                }
              },
              {
                "@type": "Service",
                "@id": "https://houstonlandguy.com/developers/#service",
                serviceType: "Land Development Partnership Services",
                provider: {
                  "@id": "https://houstonlandguy.com/#agent"
                },
                areaServed: {
                  "@type": "City",
                  name: "Houston"
                },
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Development Services",
                  itemListElement: [
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Off-Market Land Sourcing",
                        description: "Exclusive access to off-market development sites"
                      }
                    },
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Due Diligence Services",
                        description: "Comprehensive site analysis and feasibility studies"
                      }
                    },
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Financial Analysis",
                        description: "ROI projections and development pro formas"
                      }
                    },
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Entitlement Support",
                        description: "Navigate Houston's development regulations"
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
                    name: "How do you find off-market development sites in Houston?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We leverage 15+ years of relationships with landowners, estates, and institutions. Our network includes exclusive pocket listings, distressed properties, and direct owner connections across Harris County."
                    }
                  },
                  {
                    "@type": "Question",
                    name: "What size development projects do you work with?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We work with projects from 5-acre residential developments to 100+ acre master-planned communities. Our sweet spot is 10-50 acre sites for residential, commercial, and mixed-use developments."
                    }
                  },
                  {
                    "@type": "Question",
                    name: "Do you co-invest or partner on deals?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, we offer various partnership structures including joint ventures, co-investments, and fee-based acquisition services depending on the project and developer needs."
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
                    name: "Developers",
                    item: "https://houstonlandguy.com/developers"
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