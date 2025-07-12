import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why You Need to Invest in Houston Real Estate Now | 2025 Guide",
  description: "Discover why Houston offers the best real estate investment opportunities in America. No zoning laws, 22% ROI, massive population growth, and unmatched development freedom.",
  keywords: "invest in houston, houston real estate investment, why invest in houston, houston development opportunities, houston property investment, houston land investment, houston roi, houston vs other cities",
  authors: [{ name: "Houston Development Intelligence" }],
  openGraph: {
    title: "Why You Need to Invest in Houston Real Estate Now",
    description: "The definitive guide to Houston's investment advantages: 22% ROI, no zoning, fastest permits, and 100K+ annual growth.",
    url: "https://houstonlandguy.com/blog/why-invest-in-houston-real-estate/",
    siteName: "Houston Development Intelligence",
    type: "article",
    locale: "en_US",
    images: [
      {
        url: "/why-invest-houston-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Houston skyline showcasing development opportunities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Houston is America's #1 Investment Market",
    description: "No zoning + 22% ROI + 100K growth/year = Unmatched opportunity",
    images: ["/why-invest-houston-hero.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/blog/why-invest-in-houston-real-estate/",
  },
};

export default function WhyInvestHoustonLayout({
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
                "@type": "BlogPosting",
                "@id": "https://houstonlandguy.com/blog/why-invest-in-houston-real-estate/#article",
                headline: "Why You Need to Invest in Houston Real Estate Now",
                description: "Comprehensive guide on why Houston offers the best real estate investment opportunities in America.",
                author: {
                  "@type": "Organization",
                  name: "Houston Development Intelligence"
                },
                datePublished: "2025-01-15",
                dateModified: "2025-01-15",
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": "https://houstonlandguy.com/blog/why-invest-in-houston-real-estate/"
                },
                image: {
                  "@type": "ImageObject",
                  url: "/why-invest-houston-hero.jpg",
                  width: 1200,
                  height: 630
                },
                publisher: {
                  "@type": "Organization",
                  name: "Houston Development Intelligence",
                  logo: {
                    "@type": "ImageObject",
                    url: "/logo.png"
                  }
                }
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
                    name: "Blog",
                    item: "https://houstonlandguy.com/blog"
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "Why Invest in Houston",
                    item: "https://houstonlandguy.com/blog/why-invest-in-houston-real-estate"
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