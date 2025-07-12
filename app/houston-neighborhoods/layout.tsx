import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s | Houston Neighborhoods',
    default: 'Houston Neighborhoods Development Guide',
  },
  description: "Explore development opportunities across Houston's neighborhoods with real-time market data, demographics, and investment insights.",
  keywords: "houston neighborhoods, houston real estate, houston development, neighborhood analysis",
};

export default function HoustonNeighborhoodsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}