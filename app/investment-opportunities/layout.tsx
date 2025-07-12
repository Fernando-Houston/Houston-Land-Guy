import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Real Estate Investment Opportunities | Development Projects 2024",
  description: "Exclusive Houston development investment opportunities with 18%+ average returns. Access pre-vetted land development projects, joint ventures, and syndication deals in Houston's top growth markets.",
  keywords: "houston real estate investment opportunities, houston development investment, invest in houston land development, houston real estate syndication, houston development joint venture, houston investment properties, houston land investment deals",
  openGraph: {
    title: "Houston Development Investment Opportunities | 18%+ Returns",
    description: "Access exclusive Houston real estate development opportunities. Pre-vetted projects with strong ROI potential.",
    url: "https://houstonlandguy.com/investment-opportunities/",
    siteName: "Houston Development Intelligence",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/houston-investment-opportunities.jpg",
        width: 1200,
        height: 630,
        alt: "Houston Development Investment Opportunities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Development Investment Opportunities",
    description: "Exclusive access to Houston's premier development investment deals. 18%+ average returns.",
    images: ["/houston-investment-opportunities.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/investment-opportunities/",
  },
};

export default function InvestmentLayout({
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
            "@type": "InvestmentService",
            name: "Houston Development Investment Opportunities",
            description: "Investment opportunities in Houston real estate development projects",
            provider: {
              "@type": "Organization",
              name: "Houston Development Intelligence",
              url: "https://houstonlandguy.com",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "47",
                bestRating: "5"
              }
            },
            areaServed: {
              "@type": "City",
              name: "Houston",
              containedInPlace: {
                "@type": "State",
                name: "Texas"
              }
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Development Investment Opportunities",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Land Development Joint Ventures",
                    description: "Partner in Houston land development projects"
                  }
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Development Syndication",
                    description: "Invest in syndicated development deals"
                  }
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Build-to-Rent Partnerships",
                    description: "Invest in build-to-rent communities"
                  }
                }
              ]
            }
          })
        }}
      />
      {children}
    </>
  );
}