import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ESCP Finance +",
  description: "Master Finance Interviews with Confidence. Practice mental math, probability puzzles, trading intuition, Greeks, behavioral questions, and ML concepts.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "ESCP Finance + | Finance Interview Prep",
    description: "Master Finance Interviews with Confidence. Practice mental math, probability puzzles, trading intuition, Greeks, behavioral questions, and ML concepts.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ESCP Finance + | Finance Interview Prep",
    description: "Master Finance Interviews with Confidence. Practice mental math, probability puzzles, trading intuition, Greeks, behavioral questions, and ML concepts.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
