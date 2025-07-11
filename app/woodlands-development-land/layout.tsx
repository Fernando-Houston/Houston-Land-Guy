import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Woodlands Development Land | Premium Investment Opportunities",
  description: "Discover exclusive Woodlands development opportunities in Houston's premier master-planned community. Premium commercial real estate, builder lots, and development sites with unmatched growth potential.",
  keywords: "the woodlands development land, woodlands real estate development, woodlands commercial land, woodlands development opportunities, woodlands builder lots, houston development, montgomery county development, woodlands investment properties",
  openGraph: {
    title: "The Woodlands Development Land | Premium Investment Opportunities",
    description: "Exclusive Woodlands development opportunities in Houston's premier master-planned community. Commercial real estate and builder lots with exceptional ROI potential.",
    url: "https://houstonlandguy.com/woodlands-development-land/",
    siteName: "Houston Development Intelligence",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/woodlands-development-aerial.jpg",
        width: 1200,
        height: 630,
        alt: "The Woodlands development sites with commercial and residential potential",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Woodlands Development Land | Premium Investment Opportunities",
    description: "Exclusive Woodlands development opportunities in Houston's premier master-planned community.",
    images: ["/woodlands-development-aerial.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/woodlands-development-land/",
  },
};

export default function WoodlandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}