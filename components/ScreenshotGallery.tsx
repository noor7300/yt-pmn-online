import Image from "next/image";
import type { Screenshot } from "@/lib/data";

function timecode(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Captioned stills pulled from the walkthrough. Where the source video had
 * chapter markers the caption is that chapter's own title; otherwise the frame
 * is identified by its timecode rather than given an invented description. */
export function ScreenshotGallery({
  shots,
  videoId,
  title,
}: {
  shots: Screenshot[];
  videoId: string;
  title: string;
}) {
  if (!shots.length) return null;

  return (
    <section aria-labelledby="screenshots-heading" className="mt-12">
      <h2 id="screenshots-heading" className="text-xl font-semibold text-foreground">
        Screenshots from the walkthrough
      </h2>
      <p className="mt-2 text-sm text-muted">
        Stills captured at each stage of the video, in order.
      </p>

      <ol className="mt-5 flex flex-col gap-6">
        {shots.map((shot, i) => (
          <li key={shot.file}>
            <figure className="overflow-hidden rounded-md border border-line bg-panel">
              <div className="relative aspect-video w-full bg-background">
                <Image
                  src={shot.file}
                  alt={
                    shot.label
                      ? `${shot.label} — ${title}`
                      : `Step ${i + 1} of ${title}, at ${timecode(shot.atSeconds)}`
                  }
                  fill
                  sizes="(min-width: 768px) 720px, 100vw"
                  className="object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
              <figcaption className="flex items-baseline gap-3 border-t border-line px-4 py-2.5">
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}&t=${shot.atSeconds}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-mono text-xs text-accent hover:underline"
                >
                  {timecode(shot.atSeconds)}
                </a>
                <span className="text-sm text-muted">
                  {shot.label ?? <span className="italic">Step {i + 1}</span>}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </section>
  );
}
