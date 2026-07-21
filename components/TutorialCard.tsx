import Link from "next/link";
import Image from "next/image";
import type { PublishedTutorial } from "@/lib/data";

export function TutorialCard({ tutorial }: { tutorial: PublishedTutorial }) {
  const { video, article } = tutorial;
  const thumb = video.thumbnails.high ?? video.thumbnails.medium ?? video.thumbnails.default;
  const href = `/tutorials/${video.category}/${video.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
        {thumb && (
          <Image
            src={thumb.url}
            alt={video.title}
            fill
            sizes="(min-width: 1024px) 320px, 50vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        )}
        <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
          {video.categoryLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-indigo-600">
          {article.seoTitle}
        </h3>
        <p className="line-clamp-2 text-xs text-zinc-500">{article.metaDescription}</p>
      </div>
    </Link>
  );
}
