import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Development Resources | Tools, Guides & Industry Links",
  description: "Essential resources for Houston real estate developers. Access development tools, regulatory guides, market data sources, and industry connections for successful projects in Harris County.",
  keywords: "houston development resources, houston real estate tools, houston development guides, harris county developer resources, houston building resources, houston land development tools",
  openGraph: {
    title: "Houston Development Resources | Essential Tools & Guides",
    description: "Comprehensive resource directory for Houston real estate developers. Tools, guides, and industry connections.",
    url: "https://houstonlandguy.com/resources/",
    siteName: "Houston Development Intelligence",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Development Resources | Essential Tools & Guides",
    description: "Comprehensive resource directory for Houston real estate developers.",
  },
  alternates: {
    canonical: "https://houstonlandguy.com/resources/",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}