import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Guide to Houston Development Regulations 2024 | No-Zoning Explained",
  description: "Master Houston's unique no-zoning development regulations. Comprehensive guide covering permits, deed restrictions, ordinances, setbacks, and approval processes for successful real estate development in Harris County.",
  keywords: "houston development regulations, houston no zoning, houston building permits, houston deed restrictions, houston development ordinances, houston setback requirements, houston platting requirements, houston development approval process, harris county development regulations, houston land development code",
  authors: [{ name: "Houston Development Intelligence" }],
  openGraph: {
    title: "Complete Guide to Houston Development Regulations 2024",
    description: "Everything developers need to know about Houston's unique no-zoning approach and development regulations for successful projects.",
    url: "https://houstonlandguy.com/blog/complete-guide-houston-development-regulations/",
    siteName: "Houston Development Intelligence",
    type: "article",
    publishedTime: "2024-01-10T00:00:00.000Z",
    modifiedTime: "2024-01-10T00:00:00.000Z",
    authors: ["Houston Development Intelligence"],
    locale: "en_US",
    images: [
      {
        url: "/houston-development-regulations-guide.jpg",
        width: 1200,
        height: 630,
        alt: "Complete Guide to Houston Development Regulations showing permits and ordinances",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete Guide to Houston Development Regulations 2024",
    description: "Master Houston's unique no-zoning development regulations. Your complete guide to permits, ordinances, and approvals.",
    images: ["/houston-development-regulations-guide.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/blog/complete-guide-houston-development-regulations/",
  },
};

export default function RegulationsGuideLayout({
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
            "@id": "https://houstonlandguy.com/blog/complete-guide-houston-development-regulations/#article",
            headline: "Complete Guide to Houston Development Regulations 2024",
            description: "Comprehensive guide to Houston's unique no-zoning development regulations, permits, and approval processes",
            datePublished: "2024-01-10T00:00:00.000Z",
            dateModified: "2024-01-10T00:00:00.000Z",
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
              url: "https://houstonlandguy.com/houston-development-regulations-guide.jpg",
              width: 1200,
              height: 630
            },
            articleSection: "Guides",
            keywords: ["houston development", "regulations", "no zoning", "permits", "deed restrictions"],
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://houstonlandguy.com/blog/complete-guide-houston-development-regulations/"
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", "h2", ".key-takeaway"]
            }
          })
        }}
      />
      {children}
    </>
  );
}