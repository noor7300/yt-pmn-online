"use client";

import { useState } from "react";
import Image from "next/image";

export function VideoEmbed({ videoId, title, thumbnailUrl }: { videoId: string; title: string; thumbnailUrl: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-black"
      aria-label={`Play video: ${title}`}
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        sizes="(min-width: 1024px) 768px, 100vw"
        className="object-cover opacity-90 transition group-hover:opacity-100"
        priority
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-105">
          <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-red-600">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
