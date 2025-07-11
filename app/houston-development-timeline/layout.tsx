import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Development Timeline | Step-by-Step Project Guide 2024",
  description: "Visual timeline of the Houston real estate development process. From land acquisition to project completion, understand each phase, timeline, and requirements for successful development in Harris County.",
  keywords: "houston development timeline, houston development process, houston real estate timeline, houston project phases, houston development steps, harris county development timeline",
  openGraph: {
    title: "Houston Development Timeline | Complete Project Process Guide",
    description: "Step-by-step visual guide to Houston's development process from land acquisition to completion.",
    url: "https://houstonlandguy.com/houston-development-timeline/",
    siteName: "Houston Development Intelligence",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/houston-development-timeline-infographic.jpg",
        width: 1200,
        height: 630,
        alt: "Houston Development Timeline Infographic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Development Timeline Guide",
    description: "Visual timeline showing every step of the Houston development process.",
    images: ["/houston-development-timeline-infographic.jpg"],
  },
  alternates: {
    canonical: "https://houstonlandguy.com/houston-development-timeline/",
  },
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}