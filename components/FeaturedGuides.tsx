import Link from "next/link";
import Image from "next/image";
import type { PublishedTutorial } from "@/lib/data";
import { excerpt } from "@/lib/format";

/** Two large cards for the site's longest, most thorough deep-rewritten
 * guides — distinct from the "Start here" picks above the latest feed. */
export function FeaturedGuides({ tutorials }: { tutorials: PublishedTutorial[] }) {
  if (tutorials.length === 0) return null;

  return (
    <section className="border-b border-line py-14">
      <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">Featured guides</span>
      <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
        Deep dives worth your time
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {tutorials.map((t) => {
          const deepImage = t.article.deep ? t.article.steps.find((s) => s.image)?.image?.file : undefined;
          const thumb = t.video.thumbnails.maxres ?? t.video.thumbnails.medium ?? t.video.thumbnails.high;
          const src = deepImage ?? thumb?.url;
          const href = `/tutorials/${t.video.category}/${t.video.slug}`;

          return (
            <Link key={t.video.id} href={href} className="group">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-panel-2">
                {src && (
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 400px, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <span className="mt-4 block text-xs font-semibold uppercase tracking-wide text-accent-strong">
                {t.video.categoryLabel}
              </span>
              <h3 className="mt-1.5 text-[19px] font-bold leading-snug text-foreground group-hover:text-accent-strong">
                {t.article.seoTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{excerpt(t.article.intro, 150)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
