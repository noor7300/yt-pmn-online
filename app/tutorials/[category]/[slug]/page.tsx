import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getVisibleTutorials, getTutorialBySlug, getRelatedTutorials, isIndexable, getScreenshots } from "@/lib/data";
import { FaqBlock } from "@/components/FaqBlock";
import { RelatedTutorials } from "@/components/RelatedTutorials";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE_URL, SITE_OWNER } from "@/lib/site";
import { toParagraphs } from "@/lib/format";

export function generateStaticParams() {
  // Only visible tutorials get built; hidden (not-yet-deep) ones 404.
  return getVisibleTutorials().map((t) => ({ category: t.video.category, slug: t.video.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = getTutorialBySlug(slug);
  if (!tutorial) return {};

  // Prefer the first screenshot the page actually shows — a share preview
  // should look like the page behind it. The handful of articles where no
  // frame survived curation fall back to the video's thumbnail. Site-relative
  // paths are resolved against metadataBase in the root layout.
  const stepImage = tutorial.article.steps.find((s) => s.image)?.image?.file;
  const thumb = tutorial.video.thumbnails.maxres ?? tutorial.video.thumbnails.medium ?? tutorial.video.thumbnails.high;
  const ogImage = stepImage ?? thumb?.url;

  return {
    title: tutorial.article.seoTitle,
    description: tutorial.article.metaDescription,
    alternates: { canonical: `/tutorials/${tutorial.video.category}/${tutorial.video.slug}` },
    openGraph: {
      title: tutorial.article.seoTitle,
      description: tutorial.article.metaDescription,
      images: ogImage ? [ogImage] : [],
      type: "article",
    },
    robots: isIndexable(tutorial) ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const tutorial = getTutorialBySlug(slug);
  if (!tutorial || tutorial.video.category !== categorySlug) notFound();

  const { video, article } = tutorial;
  const url = `${SITE_URL}/tutorials/${video.category}/${video.slug}`;
  const related = getRelatedTutorials(tutorial);
  const shots = getScreenshots(video.id);
  const faq = faqSchema(tutorial);
  // Declare the images the page actually shows: curated inline images on a deep
  // page, otherwise the raw gallery frames.
  const schemaImages = article.deep
    ? article.steps.flatMap((s) => (s.image ? [s.image.file] : []))
    : shots.map((s) => s.file);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={articleSchema(tutorial, url, schemaImages)} />
      {faq && <JsonLd data={faq} />}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: video.categoryLabel, url: `${SITE_URL}/tutorials/${video.category}` },
          { name: article.seoTitle, url },
        ])}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: video.categoryLabel, href: `/tutorials/${video.category}` },
          { name: article.seoTitle, href: url },
        ]}
      />

      <span className="mt-5 block text-xs font-semibold uppercase tracking-wide text-accent-strong">
        {video.categoryLabel}
      </span>
      <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
        {video.title}
      </h1>

      <p className="mt-4 text-sm text-muted">By {SITE_OWNER}</p>

      <div className="mt-7 space-y-4 text-lg leading-relaxed text-foreground/90">
        {toParagraphs(article.intro).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {article.steps.map((step, i) => (
          <section key={step.heading}>
            <h2 className="flex items-baseline gap-3 text-xl font-bold tracking-tight text-foreground">
              <span className="gradient-text shrink-0 font-mono text-base font-semibold">
                {String(i + 1).padStart(2, "0")}
              </span>
              {step.heading}
            </h2>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">
              {toParagraphs(step.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {step.image && (
              <figure className="mt-5 overflow-hidden rounded-xl border border-line shadow-sm shadow-black/5">
                <div className="relative aspect-video w-full bg-panel-2">
                  <Image
                    src={step.image.file}
                    alt={step.image.caption}
                    fill
                    sizes="(min-width: 768px) 720px, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="border-t border-line bg-panel-2 px-4 py-2.5 text-sm text-muted">
                  {step.image.caption}
                </figcaption>
              </figure>
            )}
          </section>
        ))}
      </div>

      {/* Old bottom gallery only for pages not yet through the deep pass. Once
          a page has inline step images, the labelled gallery is redundant. */}
      {!article.deep && <ScreenshotGallery shots={shots} videoId={video.id} title={video.title} />}

      <FaqBlock items={article.faq} />

      <RelatedTutorials tutorials={related} categoryLabel={video.categoryLabel} />
    </article>
  );
}
