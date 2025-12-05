// BackgroundVideo.tsx - FINAL FIXED VERSION
"use client";

import { useRef, useEffect } from "react";

interface BackgroundVideoProps {
  videoPath?: string;
  opacity?: number;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoPath = "/videos/background.mp4",
  opacity = 0.5,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch((error) => {
      console.error("Video autoplay failed:", error);
    });
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" 
      style={{ zIndex: 0 }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        style={{ opacity }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoPath} type="video/mp4" />
      </video>
      
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
  );
};

export default BackgroundVideo;