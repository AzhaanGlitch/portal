// BackgroundVideo.tsx
"use client";

import { useRef, useEffect } from "react";

interface BackgroundVideoProps {
  videoPath?: string;
  opacity?: number;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoPath = "/videos/background.mp4",
  opacity = 0.5, // Adjusted opacity for better text contrast
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
    // FIX: Changed from 'fixed' to 'absolute inset-0 w-full h-full' to cover the parent section.
    // Removed fixed top/height styles.
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ 
        zIndex: 0
      }}
    >
      <video
        ref={videoRef}
        // object-cover ensures the video scales correctly to cover the full container, fixing the "too zoomed" issue.
        className="w-full h-full object-cover" 
        style={{ 
          opacity,
          // Removed original border radius styles to allow full coverage
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoPath} type="video/mp4" />
      </video>
      
      {/* Optional: Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
};

export default BackgroundVideo;