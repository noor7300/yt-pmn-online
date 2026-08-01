import type { PublishedTutorial } from "@/lib/data";
import { TutorialCard } from "./TutorialCard";

export function RelatedTutorials({ tutorials, categoryLabel }: { tutorials: PublishedTutorial[]; categoryLabel: string }) {
  if (!tutorials.length) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-14 border-t border-line pt-10">
      <h2 id="related-heading" className="text-2xl font-bold tracking-tight text-foreground">
        More {categoryLabel} tutorials
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tutorials.map((t) => (
          <TutorialCard key={t.video.id} tutorial={t} />
        ))}
      </div>
    </section>
  );
}
