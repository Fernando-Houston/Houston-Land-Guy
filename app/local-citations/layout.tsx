import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Development Intelligence - Local Business Listings & Citations",
  description: "Official business listings for Houston Development Intelligence. Find us on Google Business, Bing Places, and major local directories for Houston real estate development services.",
  keywords: "houston development intelligence business listing, houston land guy local citations, houston real estate developer directory, houston development company listings",
  openGraph: {
    title: "Houston Development Intelligence - Local Business Listings",
    description: "Official business directory listings for Houston's premier development intelligence platform.",
    url: "https://houstonlandguy.com/local-citations/",
    siteName: "Houston Development Intelligence",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Houston Development Intelligence - Local Business Listings",
    description: "Find Houston Development Intelligence on major business directories and local citations.",
  },
  alternates: {
    canonical: "https://houstonlandguy.com/local-citations/",
  },
};

export default function LocalCitationsLayout({
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
            "@type": "ItemList",
            name: "Houston Development Intelligence Business Listings",
            description: "Official business directory listings and local citations for Houston Development Intelligence",
            url: "https://houstonlandguy.com/local-citations/",
            numberOfItems: 15,
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Google Business Profile",
                url: "https://www.google.com/business/"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Bing Places for Business",
                url: "https://www.bingplaces.com/"
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Apple Maps Connect",
                url: "https://mapsconnect.apple.com/"
              },
              {
                "@type": "ListItem",
                position: 4,
                name: "Yelp Business",
                url: "https://biz.yelp.com/"
              },
              {
                "@type": "ListItem",
                position: 5,
                name: "Facebook Business",
                url: "https://www.facebook.com/business/"
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}