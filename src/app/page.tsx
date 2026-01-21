"use client"

import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { VideoSection } from "@/components/landing/VideoSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { DeveloperSection } from "@/components/landing/DeveloperSection";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <VideoSection />
        <HowItWorks />
        <Features />
        <DeveloperSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;