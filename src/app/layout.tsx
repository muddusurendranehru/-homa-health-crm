import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Homa Business Center - Influencer Management Platform",
  description: "Manage your influencer partnerships and marketing campaigns with ease",
  keywords: "influencer marketing, campaign management, business center",
  authors: [{ name: "Homa Business Center" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <div className="flex h-screen">
          {/* Sidebar Navigation */}
          <Navigation />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="min-h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
