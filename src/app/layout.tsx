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

export const metadata: Metadata = {
  title: "FyreBot - Deploy AI Chatbot Trained on Your Data in Minutes",
  description: "Embed an intelligent AI chatbot that answers questions using only your knowledge. No hallucinations. Complete control via npm package and API. Watch our intro video to get started.",
  keywords: "AI chatbot, custom chatbot, RAG chatbot, embed chatbot, chatbot widget, customer support AI, knowledge base chatbot",
  openGraph: {
    title: "FyreBot - AI Chatbot Trained on Your Data",
    description: "Deploy a custom AI chatbot in minutes. Watch our intro video and get started today.",
    type: "website",
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
    card: "player",
    title: "FyreBot - AI Chatbot Platform",
    description: "Deploy an AI chatbot trained on your data in minutes",
    players: [
      {
        playerUrl: "https://www.youtube.com/embed/NohtjPWUdxQ",
        streamUrl: "https://www.youtube.com/watch?v=NohtjPWUdxQ",
        width: 1280,
        height: 720,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
