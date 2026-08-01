import Link from "next/link";
import Image from "next/image";
import type { PublishedTutorial } from "@/lib/data";
import { excerpt } from "@/lib/format";
import { SITE_OWNER } from "@/lib/site";

/** Editorial feed row: thumbnail, title, byline, excerpt. Used on category
 * pages and the homepage "latest" feed. */
export function TutorialListItem({
  tutorial,
  showCategory = false,
}: {
  tutorial: PublishedTutorial;
  showCategory?: boolean;
}) {
  const { video, article } = tutorial;
  // Deep articles get their first real in-app screenshot as the card image —
  // it reads as genuine tutorial content rather than a video thumbnail.
  // Everything else falls back to the YouTube thumbnail. medium (320x180) is
  // 16:9 like the container and ~10KB; images are served unoptimised, so
  // pick a source close to the display size rather than maxres.
  const deepImage = article.deep ? article.steps.find((s) => s.image)?.image : undefined;
  const thumb = video.thumbnails.medium ?? video.thumbnails.maxres ?? video.thumbnails.high;
  const imageSrc = deepImage?.file ?? thumb?.url;
  const href = `/tutorials/${video.category}/${video.slug}`;

  return (
    <article className="group flex flex-col gap-4 border-b border-line py-6 first:pt-0 sm:flex-row sm:items-center sm:gap-6">
      <Link
        href={href}
        // sm:self-start stops the flex row stretching this to the text column's
        // height — that stretch beats aspect-video and made object-cover crop
        // the thumbnail's left and right edges.
        className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-panel-2 sm:w-48 sm:self-center"
        tabIndex={-1}
        aria-hidden="true"
      >
        {imageSrc && (
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(min-width: 640px) 192px, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <h2 className="text-[16.5px] font-semibold leading-snug text-foreground">
          <Link href={href} className="group-hover:text-accent-strong">
            {article.seoTitle}
          </Link>
        </h2>

        <p className="mt-2 text-xs text-muted">
          By {SITE_OWNER}
          {showCategory && (
            <>
              <span aria-hidden="true"> · </span>
              <Link href={`/tutorials/${video.category}`} className="text-accent-strong hover:underline">
                {video.categoryLabel}
              </Link>
            </>
          )}
        </p>

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">{excerpt(article.intro)}</p>
      </div>
    </article>
  );
}
