import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Development FAQ | Common Questions About Land Development",
  description: "Get answers to frequently asked questions about Houston real estate development, land acquisition, permits, costs, and investment opportunities in Harris County.",
  keywords: "houston development faq, houston land development questions, houston real estate faq, houston development process, houston building questions, harris county development faq",
  openGraph: {
    title: "Houston Development FAQ | Your Questions Answered",
    description: "Expert answers to common questions about Houston real estate development, permits, costs, and opportunities.",
    url: "https://houstonlandguy.com/faq/",
    siteName: "Houston Development Intelligence",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Houston Development FAQ",
    description: "Expert answers to common questions about Houston real estate development.",
  },
  alternates: {
    canonical: "https://houstonlandguy.com/faq/",
  },
};

export default function FAQLayout({
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
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How does Houston's no-zoning policy affect development?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Houston's lack of traditional zoning provides developers with unprecedented flexibility in land use decisions. Instead of zoning, development is regulated through deed restrictions, city ordinances, and building codes. This allows for mixed-use developments, faster approvals, and market-driven land use, resulting in lower development costs and higher ROI compared to zoned cities."
                }
              },
              {
                "@type": "Question",
                name: "What are typical development costs in Houston?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Development costs in Houston vary by project type: Single-family residential runs $145-185/sq ft, multifamily $135-165/sq ft, office $180-220/sq ft, retail $130-160/sq ft, and industrial $65-85/sq ft. These costs are 15-25% lower than Austin and include hard costs, with soft costs typically adding 20-30% and financing costs 8-12% of total project cost."
                }
              },
              {
                "@type": "Question",
                name: "How long does the Houston development permit process take?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Houston's permit process typically takes 4-8 weeks for standard projects and 8-16 weeks for complex developments. This includes pre-application meetings (1-2 weeks), initial review (10-15 business days), corrections/resubmittal (5-10 business days), and permit issuance (1-2 business days). Houston's process is significantly faster than cities with traditional zoning."
                }
              },
              {
                "@type": "Question",
                name: "What are the best areas for development in Houston?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Top Houston development areas include The Woodlands (master-planned communities, medical), Katy (residential, retail along Grand Parkway), Sugar Land (commercial, corporate campuses), East Houston (industrial, logistics near port), and inner-loop neighborhoods (urban infill, mixed-use). Each area offers unique opportunities based on your development type and target market."
                }
              },
              {
                "@type": "Question",
                name: "What ROI can I expect on Houston development projects?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Houston development projects average 18.2% IRR across all property types. Specific returns: Master-planned residential 22.4%, industrial/logistics 19.8%, mixed-use 17.2%, multifamily 15.3%, and retail/commercial 13.9%. These returns are approximately 24% higher than Austin due to lower land costs, reduced regulations, and faster execution."
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}