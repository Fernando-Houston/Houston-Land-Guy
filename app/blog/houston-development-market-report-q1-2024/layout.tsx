import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Development Market Report Q1 2024 | Market Analysis & Trends",
  description: "Comprehensive Q1 2024 Houston development market analysis including $2.3B in permits, 15% YoY growth, geographic hotspots, and investment opportunities across Harris County.",
  keywords: "houston development market report, houston real estate market 2024, harris county development trends, houston permit activity, houston development opportunities 2024, houston real estate investment analysis, houston market forecast 2024",
  authors: [{ name: "Houston Development Intelligence" }],
  openGraph: {
    title: "Houston Development Market Report Q1 2024",
    description: "$2.3B in development permits issued in Q1 2024. Comprehensive analysis of Houston's real estate development trends and opportunities.",
    url: "https://houstonlandguy.com/blog/houston-development-market-report-q1-2024/",
    siteName: "Houston Development Intelligence",
    type: "article",
    publishedTime: "2024-01-15T00:00:00.000Z",
    modifiedTime: "2024-01-15T00:00:00.000Z",
    authors: ["Houston Development Intelligence"],
    locale: "en_US",
    images: [
      {
        url: "/houston-q1-2024-market-report.jpg",
        width: 1200,
        height: 630,
        alt: "Houston Development Market Report Q1 2024 showing growth trends and opportunities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Development Market Report Q1 2024",
    description: "$2.3B in permits, 15% YoY growth. Complete Houston development market analysis.",
    images: ["/houston-q1-2024-market-report.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/blog/houston-development-market-report-q1-2024/",
  },
};

export default function MarketReportLayout({
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
            "@id": "https://houstonlandguy.com/blog/houston-development-market-report-q1-2024/#article",
            headline: "Houston Development Market Report Q1 2024",
            description: "Comprehensive Q1 2024 Houston development market analysis including $2.3B in permits and 15% YoY growth",
            datePublished: "2024-01-15T00:00:00.000Z",
            dateModified: "2024-01-15T00:00:00.000Z",
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
              url: "https://houstonlandguy.com/houston-q1-2024-market-report.jpg",
              width: 1200,
              height: 630
            },
            articleSection: "Market Reports",
            keywords: ["houston development", "market report", "real estate investment", "harris county", "development trends"],
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://houstonlandguy.com/blog/houston-development-market-report-q1-2024/"
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", "h2", ".executive-summary"]
            }
          })
        }}
      />
      {children}
    </>
  );
}