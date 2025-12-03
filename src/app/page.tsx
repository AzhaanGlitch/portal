'use client';
import HeroPage from "@/components/Hero";
import BackgroundVideo from "@/components/animations/BackgroundVideo/BackgroundVideo";

export default function Home() {
  return (
    <main className="relative font-sans min-h-screen">
      <BackgroundVideo 
        videoPath="/videos/Background.mp4"
        opacity={0.7}
      />
      
      <div className="relative z-10">
        <HeroPage />
      </div>
    </main>
  );
}