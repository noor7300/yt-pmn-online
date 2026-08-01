import { Breadcrumbs } from "./Breadcrumbs";

export function ProsePage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title, href: "#" }]} />

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
      {updated && <p className="mt-2 text-xs text-muted">Last updated: {updated}</p>}
      {intro && <p className="mt-5 text-lg leading-relaxed text-foreground/90">{intro}</p>}

      <div className="mt-8 space-y-10 text-muted [&_a]:text-accent-strong [&_a:hover]:underline [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_li]:leading-relaxed [&_p]:leading-relaxed [&_section>*+*]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
