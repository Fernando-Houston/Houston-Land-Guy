import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sugar Land Development Sites | Premium Commercial Opportunities",
  description: "Discover exclusive Sugar Land development opportunities in Houston's most affluent suburb. Premium commercial real estate, corporate campus sites, and medical office development in Fort Bend County's premier business location.",
  keywords: "sugar land development opportunities, sugar land commercial real estate, sugar land investment properties, sugar land commercial development, sugar land development sites, fort bend county commercial real estate, sugar land medical office development, sugar land corporate real estate",
  openGraph: {
    title: "Sugar Land Development Sites | Premium Commercial Opportunities", 
    description: "Exclusive Sugar Land commercial development opportunities in Houston's most affluent suburb. Corporate and medical office sites with exceptional returns.",
    url: "https://houstonlandguy.com/sugar-land-development-sites/",
    siteName: "Houston Development Intelligence",
    type: "website", 
    locale: "en_US",
    images: [
      {
        url: "/sugar-land-commercial-development.jpg",
        width: 1200,
        height: 630,
        alt: "Sugar Land commercial development sites with corporate and medical opportunities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sugar Land Development Sites | Premium Commercial Opportunities",
    description: "Exclusive Sugar Land commercial development opportunities in Houston's most affluent suburb.",
    images: ["/sugar-land-commercial-development.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/sugar-land-development-sites/",
  },
};

export default function SugarLandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}