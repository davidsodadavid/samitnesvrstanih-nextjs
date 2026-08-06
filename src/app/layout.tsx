import type { Metadata } from "next";
import { Geist, Geist_Mono, Mozilla_Headline, Mozilla_Text } from "next/font/google";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  title: "Samit",
  description: "Samit — posts, films, exhibitions, galleries and events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${kharkivTone.variable} ${mozillaText.variable} ${mozillaHeadline.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
