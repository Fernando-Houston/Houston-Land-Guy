import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston vs Texas Cities | Development & Investment Comparison | Houston Development Intelligence",
  description: "Compare Houston's development opportunities with Dallas, Austin, San Antonio & Fort Worth. See why Houston leads Texas in land investment ROI, development costs, and growth potential.",
  keywords: "houston vs dallas development, houston vs austin real estate, houston vs san antonio investment, houston vs fort worth land, texas city comparison, houston development advantages, texas real estate comparison",
  authors: [{ name: "Houston Development Intelligence" }],
  openGraph: {
    title: "Houston vs Other Texas Cities - Development Comparison Guide",
    description: "Comprehensive comparison of development opportunities across Texas major cities. Discover why Houston offers superior land investment potential.",
    url: "https://houstonlandguy.com/houston-vs-texas/",
    siteName: "Houston Development Intelligence",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/houston-texas-comparison.jpg",
        width: 1200,
        height: 630,
        alt: "Houston vs Texas Cities Development Comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston vs Texas Cities - Development Comparison",
    description: "Compare development costs, ROI, regulations & opportunities across Texas major cities.",
    images: ["/houston-texas-comparison.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/houston-vs-texas/",
  },
};

export default function HoustonVsTexasLayout({
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
                "@type": "WebPage",
                "@id": "https://houstonlandguy.com/houston-vs-texas/",
                url: "https://houstonlandguy.com/houston-vs-texas/",
                name: "Houston vs Texas Cities Development Comparison",
                description: "Compare development opportunities, costs, and ROI across Texas major cities",
                breadcrumb: {
                  "@id": "https://houstonlandguy.com/houston-vs-texas/#breadcrumb"
                },
                isPartOf: {
                  "@id": "https://houstonlandguy.com/#website"
                }
              },
              {
                "@type": "BreadcrumbList",
                "@id": "https://houstonlandguy.com/houston-vs-texas/#breadcrumb",
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
                    name: "Houston vs Texas Cities",
                    item: "https://houstonlandguy.com/houston-vs-texas"
                  }
                ]
              },
              {
                "@type": "Article",
                headline: "Houston vs Other Texas Cities: Development & Investment Comparison",
                author: {
                  "@type": "Organization",
                  name: "Houston Development Intelligence"
                },
                datePublished: "2024-01-15",
                dateModified: "2024-01-15",
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": "https://houstonlandguy.com/houston-vs-texas/"
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}