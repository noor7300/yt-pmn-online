import Link from "next/link";
import Image from "next/image";
import type { PublishedTutorial } from "@/lib/data";

export function TutorialCard({ tutorial }: { tutorial: PublishedTutorial }) {
  const { video, article } = tutorial;
  const deepImage = article.deep ? article.steps.find((s) => s.image)?.image : undefined;
  const thumb = video.thumbnails.medium ?? video.thumbnails.maxres ?? video.thumbnails.high;
  const imageSrc = deepImage?.file ?? thumb?.url;
  const href = `/tutorials/${video.category}/${video.slug}`;

  return (
    <Link href={href} className="group flex flex-col">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-panel-2">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={video.title}
            fill
            sizes="(min-width: 1024px) 320px, 50vw"
            className="object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        )}
      </div>
      <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent-strong">
        {video.categoryLabel}
      </span>
      <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-foreground group-hover:text-accent-strong">
        {article.seoTitle}
      </h3>
    </Link>
  );
}
