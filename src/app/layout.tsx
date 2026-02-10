import type { Metadata } from "next";
import { Inter, Jersey_20 } from "next/font/google"; // Import Inter and Jersey_20
import "./globals.css";
import { cn } from "@/lib/utils"; // Import cn utility
import BackToTopButton from "@/components/BackToTopButton"; // Import the new component

// Configure Inter font for body text
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // Use standard --font-sans variable
});

// Configure Jersey 20 font for headings
const fontHeading = Jersey_20({
  subsets: ["latin"],
  weight: "400", // Jersey 20 only has weight 400
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lifeofaguru.com"),
  title: "Arvind Guruprasad | Founding AI Engineer | Healthcare AI",
  description:
    "Founding AI Engineer building agentic healthcare systems. Currently at Arkus AI. Previously drove $15M+ in healthcare AI deals at Quantiphi. MSc in Biostatistics & Data Science at Karolinska/KTH.",
  keywords: [
    "Founding AI Engineer",
    "Healthcare AI",
    "Multi-Agent Systems",
    "LLM",
    "RAG",
    "Agentic AI",
    "Clinical Workflows",
    "FHIR",
    "Stockholm",
    "EU"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Arvind Guruprasad | Founding AI Engineer | Healthcare AI",
    description:
      "Founding AI Engineer building agentic healthcare systems. Currently at Arkus AI. Previously drove $15M+ in healthcare AI deals at Quantiphi. MSc at Karolinska/KTH.",
  },
  twitter: {
    card: "summary",
    title: "Arvind Guruprasad | Founding AI Engineer | Healthcare AI",
    description:
      "Founding AI Engineer building agentic healthcare systems. Currently at Arkus AI. Previously $15M+ healthcare AI deals at Quantiphi. MSc at Karolinska/KTH.",
  },
  icons: {
    icon: '/images/8bit-favicon.png', // Path relative to the 'public' directory
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning><body className={cn(
          "min-h-screen bg-background font-sans antialiased", // Apply base font-sans
          fontSans.variable, // Add Inter variable
          fontHeading.variable // Add Jersey 20 variable
        )}
      >
        {children}
        <BackToTopButton /> {/* Add the button here */}
      </body>
    </html>
  );
}
