// BackgroundVideo.tsx
"use client";

import { useRef, useEffect } from "react";

interface BackgroundVideoProps {
  videoPath?: string;
  opacity?: number;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoPath = "/videos/background.mp4",
  opacity = 0.8,
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
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
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
    </div>
  );
};

export default BackgroundVideo;