import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s | Market Intelligence Hub',
    default: 'Houston Market Intelligence Hub',
  },
  description: "Real-time Houston development market data, analytics, and investment insights powered by Core Agent AI.",
  keywords: "houston market intelligence, houston real estate data, houston development analytics",
};

export default function MarketIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}