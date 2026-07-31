import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedTutorials, getTutorialBySlug, getRelatedTutorials, isIndexable, getScreenshots } from "@/lib/data";
import { VideoEmbed } from "@/components/VideoEmbed";
import { FaqBlock } from "@/components/FaqBlock";
import { RelatedTutorials } from "@/components/RelatedTutorials";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { videoObjectSchema, articleSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE_URL, SITE_OWNER } from "@/lib/site";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return getPublishedTutorials().map((t) => ({ category: t.video.category, slug: t.video.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = getTutorialBySlug(slug);
  if (!tutorial) return {};

  const thumb = tutorial.video.thumbnails.maxres ?? tutorial.video.thumbnails.medium ?? tutorial.video.thumbnails.high;

  return {
    title: tutorial.article.seoTitle,
    description: tutorial.article.metaDescription,
    alternates: { canonical: `/tutorials/${tutorial.video.category}/${tutorial.video.slug}` },
    openGraph: {
      title: tutorial.article.seoTitle,
      description: tutorial.article.metaDescription,
      images: thumb ? [thumb.url] : [],
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
  const thumb = video.thumbnails.maxres ?? video.thumbnails.medium ?? video.thumbnails.high;
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
      <JsonLd data={videoObjectSchema(tutorial)} />
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

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">{video.title}</h1>

      <p className="mt-3 font-mono text-xs text-muted">
        By {SITE_OWNER}
        <span aria-hidden="true"> · </span>
        <time dateTime={video.publishedAt.slice(0, 10)}>{formatDate(video.publishedAt)}</time>
        <span aria-hidden="true"> · </span>
        <a href="#video-walkthrough" className="text-accent hover:underline">
          Prefer to watch? Jump to the video ↓
        </a>
      </p>

      <p className="mt-6 text-lg text-foreground/90">{article.intro}</p>

      <div className="mt-8 space-y-8">
        {article.steps.map((step) => (
          <section key={step.heading}>
            <h2 className="text-xl font-semibold text-foreground">{step.heading}</h2>
            <p className="mt-2 text-muted">{step.body}</p>
            {step.image && (
              <figure className="mt-4 overflow-hidden rounded-md border border-line bg-panel">
                <div className="relative aspect-video w-full bg-background">
                  <Image
                    src={step.image.file}
                    alt={step.image.caption}
                    fill
                    sizes="(min-width: 768px) 720px, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="border-t border-line px-4 py-2.5 text-sm text-muted">
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

      <section id="video-walkthrough" className="mt-12 scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">Watch the full walkthrough</h2>
        <p className="mt-2 text-sm text-muted">
          The same steps, demonstrated on screen from start to finish.
        </p>
        <div className="mt-4">
          {thumb && <VideoEmbed videoId={video.id} title={video.title} thumbnailUrl={thumb.url} />}
        </div>
      </section>

      <RelatedTutorials tutorials={related} categoryLabel={video.categoryLabel} />
    </article>
  );
}
