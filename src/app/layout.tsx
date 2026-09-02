import type { Metadata } from "next";
import { Geist, Geist_Mono, Mozilla_Headline, Mozilla_Text } from "next/font/google";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Homepage display font — sourced directly from the designer's own release
// (github.com/mozilla/mozilla-text-type has the Google-Fonts-hosted sibling;
// Kharkiv Tone has no formal license, see src/app/fonts/README.md).
const kharkivTone = localFont({
  src: "./fonts/KharkivTone-Regular.ttf",
  variable: "--font-kharkiv-tone",
  display: "swap",
});

const mozillaText = Mozilla_Text({
  variable: "--font-mozilla-text",
  // latin-ext covers the Serbian Latin diacritics (č, š, ž, đ) used in program content.
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const mozillaHeadline = Mozilla_Headline({
  variable: "--font-mozilla-headline",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Absolute URLs are required for social cards, and the festival has one domain.
const siteUrl = "https://samitnesvrstanih.com";

const description =
  "Samit Nesvrstanih is a DIY skate and arts festival in Belgrade, 10-13 September 2026. " +
  "Four days of skate sessions, live music, exhibitions, film screenings, workshops and talks - " +
  "all open to the public.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    // Section pages set their own title and get the festival name appended.
    default: "Samit Nesvrstanih - Belgrade, 10-13 September 2026",
    template: "%s - Samit Nesvrstanih",
  },
  description,
  applicationName: "Samit Nesvrstanih",
  keywords: [
    "Samit Nesvrstanih",
    "Summit of the Non-Aligned",
    "Belgrade",
    "Beograd",
    "skate festival",
    "DIY",
    "skateboarding",
    "exhibitions",
    "film screenings",
    "2026",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Samit Nesvrstanih",
    title: "Samit Nesvrstanih — Belgrade, 10-13 September 2026",
    description,
    url: "/",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Samit Nesvrstanih poster — Beograd, 10-13/9/2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samit Nesvrstanih — Belgrade, 10-13 September 2026",
    description,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // overflow-x-hidden guards against the full-bleed sections' w-screen breakout
      // (100vw doesn't subtract the scrollbar's width, so it overshoots by a few px)
      className={`overflow-x-hidden ${geistSans.variable} ${geistMono.variable} ${kharkivTone.variable} ${mozillaText.variable} ${mozillaHeadline.variable}`}
    >
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
