import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedTutorials, getTutorialBySlug, getRelatedTutorials } from "@/lib/data";
import { VideoEmbed } from "@/components/VideoEmbed";
import { FaqBlock } from "@/components/FaqBlock";
import { RelatedTutorials } from "@/components/RelatedTutorials";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { videoObjectSchema, articleSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

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

  const thumb = tutorial.video.thumbnails.high ?? tutorial.video.thumbnails.medium ?? tutorial.video.thumbnails.default;

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
  const thumb = video.thumbnails.high ?? video.thumbnails.medium ?? video.thumbnails.default;
  const url = `${SITE_URL}/tutorials/${video.category}/${video.slug}`;
  const related = getRelatedTutorials(tutorial);
  const faq = faqSchema(tutorial);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={videoObjectSchema(tutorial)} />
      <JsonLd data={articleSchema(tutorial, url)} />
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

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">{video.title}</h1>

      <div className="mt-6">
        {thumb && <VideoEmbed videoId={video.id} title={video.title} thumbnailUrl={thumb.url} />}
      </div>

      <p className="mt-6 text-lg text-zinc-700">{article.intro}</p>

      <div className="mt-8 space-y-6">
        {article.steps.map((step) => (
          <section key={step.heading}>
            <h2 className="text-xl font-semibold text-zinc-900">{step.heading}</h2>
            <p className="mt-2 text-zinc-700">{step.body}</p>
          </section>
        ))}
      </div>

      <FaqBlock items={article.faq} />

      <RelatedTutorials tutorials={related} categoryLabel={video.categoryLabel} />
    </article>
  );
}
