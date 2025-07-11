import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston vs Austin Development Comparison 2024 | Texas Real Estate Markets",
  description: "Comprehensive comparison of Houston and Austin development markets. Compare costs, ROI, regulations, growth trends, and investment opportunities between Texas' top real estate markets.",
  keywords: "houston vs austin real estate, houston austin development comparison, texas real estate markets, houston austin investment analysis, houston vs austin development costs, houston austin market comparison, texas development opportunities, houston austin roi comparison",
  authors: [{ name: "Houston Development Intelligence" }],
  openGraph: {
    title: "Houston vs. Austin: Development Opportunity Comparison",
    description: "In-depth comparison of development opportunities, costs, and ROI potential between Houston and Austin markets for real estate developers and investors.",
    url: "https://houstonlandguy.com/blog/houston-vs-austin-development-comparison/",
    siteName: "Houston Development Intelligence",
    type: "article",
    publishedTime: "2024-01-08T00:00:00.000Z",
    modifiedTime: "2024-01-08T00:00:00.000Z",
    authors: ["Houston Development Intelligence"],
    locale: "en_US",
    images: [
      {
        url: "/houston-austin-development-comparison.jpg",
        width: 1200,
        height: 630,
        alt: "Houston vs Austin development market comparison chart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston vs Austin Development Comparison 2024",
    description: "Compare development costs, ROI, and opportunities between Houston and Austin real estate markets.",
    images: ["/houston-austin-development-comparison.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/blog/houston-vs-austin-development-comparison/",
  },
};

export default function ComparisonLayout({
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
            "@type": "Article",
            "@id": "https://houstonlandguy.com/blog/houston-vs-austin-development-comparison/#article",
            headline: "Houston vs. Austin: Development Opportunity Comparison",
            description: "Comprehensive comparison of development opportunities between Houston and Austin real estate markets",
            datePublished: "2024-01-08T00:00:00.000Z",
            dateModified: "2024-01-08T00:00:00.000Z",
            author: {
              "@type": "Organization",
              name: "Houston Development Intelligence",
              url: "https://houstonlandguy.com"
            },
            publisher: {
              "@type": "Organization",
              name: "Houston Development Intelligence",
              url: "https://houstonlandguy.com",
              logo: {
                "@type": "ImageObject",
                url: "https://houstonlandguy.com/logo.png"
              }
            },
            image: {
              "@type": "ImageObject",
              url: "https://houstonlandguy.com/houston-austin-development-comparison.jpg",
              width: 1200,
              height: 630
            },
            articleSection: "Market Analysis",
            keywords: ["houston", "austin", "development", "real estate", "comparison", "investment"],
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://houstonlandguy.com/blog/houston-vs-austin-development-comparison/"
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", "h2", ".comparison-table"]
            }
          })
        }}
      />
      {children}
    </>
  );
}