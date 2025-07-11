import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Development Cost Calculator | Construction Cost Estimator 2024",
  description: "Calculate accurate development costs for Houston real estate projects. Estimate construction costs for residential, commercial, and industrial developments in Harris County with our free calculator.",
  keywords: "houston development cost calculator, houston construction cost estimator, houston building cost calculator, harris county development costs, houston real estate development calculator, houston construction costs 2024",
  openGraph: {
    title: "Houston Development Cost Calculator | Free Construction Estimator",
    description: "Calculate accurate development costs for your Houston real estate project. Free tool with 2024 construction costs.",
    url: "https://houstonlandguy.com/development-cost-calculator/",
    siteName: "Houston Development Intelligence",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/houston-development-cost-calculator.jpg",
        width: 1200,
        height: 630,
        alt: "Houston Development Cost Calculator Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Development Cost Calculator",
    description: "Free tool to calculate development costs for Houston real estate projects. Get accurate 2024 estimates.",
    images: ["/houston-development-cost-calculator.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/development-cost-calculator/",
  },
};

export default function CostCalculatorLayout({
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
            "@type": "WebApplication",
            name: "Houston Development Cost Calculator",
            description: "Calculate development costs for Houston real estate projects including construction, permits, and soft costs",
            url: "https://houstonlandguy.com/development-cost-calculator/",
            applicationCategory: "FinanceApplication",
            operatingSystem: "All",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD"
            },
            provider: {
              "@type": "Organization",
              name: "Houston Development Intelligence",
              url: "https://houstonlandguy.com"
            }
          })
        }}
      />
      {children}
    </>
  );
}