'use client';
import HeroPage from "@/components/Hero";
import BackgroundVideo from "@/components/animations/BackgroundVideo/BackgroundVideo";

export default function Home() {
  return (
    <main className="relative font-sans min-h-screen">
      <div className="relative z-10">
        <HeroPage />
      </div>
    </main>
  );
}