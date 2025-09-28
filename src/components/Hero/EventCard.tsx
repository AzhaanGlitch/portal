"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface EventCardProps {
  name: string;
  date: string;
  duration: string;
  description: string;
  media?: string | null;
}

export default function EventCard({
  name,
  date,
  duration,
  description,
  media,
}: EventCardProps) {
  const isImage =
    media && (media.endsWith(".jpg") || media.endsWith(".jpeg") || media.endsWith(".png") || media.endsWith(".gif"));
  const isVideo = media && media.endsWith(".mp4");

  return (
    <Card className="w-full max-w-md shadow-lg rounded-2xl overflow-hidden">
      {isImage && (
        <div className="relative w-full h-56">
          <Image src={media} alt={name} fill className="object-cover" priority />
        </div>
      )}
      {isVideo && (
        <video controls className="w-full h-56 object-cover">
          <source src={media} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <CardHeader>
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          {new Date(date).toLocaleString()} – {new Date(duration).toLocaleString()}
        </p>
        <p className="mt-2 text-gray-700">{description}</p>
      </CardContent>
    </Card>
  );
}
