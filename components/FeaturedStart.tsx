import Link from "next/link";
import Image from "next/image";
import type { PublishedTutorial } from "@/lib/data";
import { excerpt } from "@/lib/format";

function cardImage(t: PublishedTutorial) {
  const deepImage = t.article.deep ? t.article.steps.find((s) => s.image)?.image?.file : undefined;
  const thumb = t.video.thumbnails.medium ?? t.video.thumbnails.maxres ?? t.video.thumbnails.high;
  return deepImage ?? thumb?.url;
}

/** Homepage opener: the site's most-viewed deep-rewritten guide as one large
 * feature, with the next few as a compact side list — an asymmetric
 * editorial grid rather than another row of identical cards. */
export function FeaturedStart({ tutorials }: { tutorials: PublishedTutorial[] }) {
  if (tutorials.length === 0) return null;
  const [main, ...side] = tutorials;
  const mainHref = `/tutorials/${main.video.category}/${main.video.slug}`;
  const mainSrc = cardImage(main);

  return (
    <section className="border-b border-line py-14">
      <span className="text-xs font-semibold uppercase tracking-wide text-accent-strong">Featured</span>
      <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Start here</h2>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Link href={mainHref} className="group">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-panel-2">
            {mainSrc && (
              <Image
                src={mainSrc}
                alt=""
                fill
                sizes="(min-width: 1024px) 620px, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            )}
          </div>
          <span className="mt-4 block text-xs font-semibold uppercase tracking-wide text-accent-strong">
            {main.video.categoryLabel}
          </span>
          <h3 className="mt-1.5 text-2xl font-bold leading-snug text-foreground group-hover:text-accent-strong">
            {main.article.seoTitle}
          </h3>
          <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-muted">{excerpt(main.article.intro, 180)}</p>
        </Link>

        {side.length > 0 && (
          <div className="flex flex-col gap-6">
            {side.map((t) => {
              const href = `/tutorials/${t.video.category}/${t.video.slug}`;
              const src = cardImage(t);
              return (
                <Link key={t.video.id} href={href} className="group flex gap-4">
                  <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-panel-2">
                    {src && <Image src={src} alt="" fill sizes="112px" className="object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-accent-strong">
                      {t.video.categoryLabel}
                    </span>
                    <h4 className="mt-1 line-clamp-2 text-[14.5px] font-semibold leading-snug text-foreground group-hover:text-accent-strong">
                      {t.article.seoTitle}
                    </h4>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
