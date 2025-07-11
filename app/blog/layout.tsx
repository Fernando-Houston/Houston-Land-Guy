import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Development Blog | Market Intelligence & Industry Insights",
  description: "Expert insights on Houston real estate development, market analysis, regulations, and investment opportunities. Stay informed with the latest trends in Harris County development.",
  keywords: "houston development blog, houston real estate insights, houston market analysis, harris county development news, houston development trends, houston real estate market reports, houston development regulations guide",
  openGraph: {
    title: "Houston Development Blog | Market Intelligence & Industry Insights",
    description: "Expert insights on Houston real estate development, market analysis, and investment opportunities.",
    url: "https://houstonlandguy.com/blog/",
    siteName: "Houston Development Intelligence",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Development Blog | Market Intelligence & Industry Insights",
    description: "Expert insights on Houston real estate development and investment opportunities.",
  },
  alternates: {
    canonical: "https://houstonlandguy.com/blog/",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}