import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Houston Development Intelligence | Data-Driven Real Estate Development",
  description: "Empowering small-to-medium builders with market intelligence, ROI calculators, and development insights for Houston's real estate market.",
  keywords: "Houston real estate development, ROI calculator, market intelligence, zoning analysis, development opportunities",
  openGraph: {
    title: "Houston Development Intelligence",
    description: "Data-driven tools and insights for Houston real estate developers",
    url: "https://houstonlandguy.com",
    siteName: "Houston Development Intelligence",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#059669',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#DC2626',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
