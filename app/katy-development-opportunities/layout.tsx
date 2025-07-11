import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katy Texas Land Development | Prime Development Opportunities",
  description: "Discover exclusive Katy development opportunities in one of America's fastest-growing suburbs. Premium commercial real estate, residential developments, and land investment in Fort Bend County's top location.",
  keywords: "katy texas land development, katy development opportunities, katy commercial real estate, katy development sites, katy land investment, katy residential development, fort bend county development, katy real estate investment",
  openGraph: {
    title: "Katy Texas Land Development | Prime Development Opportunities", 
    description: "Exclusive Katy development opportunities in Houston's fastest-growing suburb. Commercial and residential development sites with exceptional growth potential.",
    url: "https://houstonlandguy.com/katy-development-opportunities/",
    siteName: "Houston Development Intelligence",
    type: "website", 
    locale: "en_US",
    images: [
      {
        url: "/katy-development-growth.jpg",
        width: 1200,
        height: 630,
        alt: "Katy Texas development sites showing commercial and residential potential",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Katy Texas Land Development | Prime Development Opportunities",
    description: "Exclusive Katy development opportunities in Houston's fastest-growing suburb.",
    images: ["/katy-development-growth.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/katy-development-opportunities/",
  },
};

export default function KatyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}