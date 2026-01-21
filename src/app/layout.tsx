import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fyrebot.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FyreBot - AI Chatbot Trained on Your Data | Deploy in Minutes",
    template: "%s | FyreBot"
  },
  description: "Deploy intelligent AI chatbots trained exclusively on your data. No hallucinations, complete control via npm package and API. Privacy-first, enterprise-grade security. Start free today.",
  keywords: [
    "AI chatbot",
    "custom chatbot",
    "RAG chatbot",
    "embed chatbot",
    "chatbot widget",
    "customer support AI",
    "knowledge base chatbot",
    "AI assistant",
    "chatbot builder",
    "conversational AI",
    "private AI chatbot",
    "enterprise chatbot",
    "chatbot SDK",
    "chatbot API",
    "intelligent chatbot",
    "no-code chatbot",
    "embed AI chat",
    "website chatbot",
    "business chatbot",
    "AI support bot"
  ],
  authors: [{ name: "FyreBot" }],
  creator: "FyreBot",
  publisher: "FyreBot",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "FyreBot - AI Chatbot Trained on Your Data",
    description: "Deploy intelligent AI chatbots trained exclusively on your data. No hallucinations, complete control. Privacy-first, enterprise-grade security.",
    siteName: "FyreBot",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "FyreBot - AI Chatbot Platform",
        type: "image/png",
      },
    ],
    videos: [
      {
        url: "https://www.youtube.com/watch?v=NohtjPWUdxQ",
        width: 1280,
        height: 720,
        type: "video/mp4",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FyreBot - AI Chatbot Trained on Your Data",
    description: "Deploy intelligent AI chatbots in minutes. Privacy-first, no hallucinations, complete control.",
    creator: "@fyrebot",
    site: "@fyrebot",
    images: [`${siteUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'technology',
  classification: 'AI Chatbot Platform',
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  other: {
    'msapplication-TileColor': '#0ea5e9',
    'theme-color': '#ffffff',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FyreBot" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
