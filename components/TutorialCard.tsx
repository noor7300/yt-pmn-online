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
      className="group flex flex-col overflow-hidden rounded-md border border-line bg-panel transition hover:border-accent"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-background">
        {thumb && (
          <Image
            src={thumb.url}
            alt={video.title}
            fill
            sizes="(min-width: 1024px) 320px, 50vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        )}
        <span className="absolute bottom-2 left-2 rounded bg-background/90 px-1.5 py-0.5 font-mono text-xs font-medium uppercase tracking-wide text-accent">
          {video.categoryLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-accent">
          {article.seoTitle}
        </h3>
        <p className="line-clamp-2 text-xs text-muted">{article.metaDescription}</p>
      </div>
    </Link>
  );
}
