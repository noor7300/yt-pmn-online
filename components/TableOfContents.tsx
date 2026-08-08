"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

/** Sticky in-page navigation for a tutorial, shown in the left gutter on wide
 * screens only — below that there isn't room for it beside the article, and
 * the step headings are close enough together to scroll past directly. */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");
  // Effect depends on the ids themselves, not the array identity, which is
  // rebuilt on every render of the server component above.
  const ids = items.map((i) => i.id).join(",");

  useEffect(() => {
    const headings = ids
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!headings.length) return;

    // The current section is the last heading to have scrolled up past the
    // sticky header. Deriving it from position rather than intersection means
    // there's always a defined answer — including in a long stretch of body
    // copy where no heading is on screen at all. Above the first heading
    // nothing is marked, since the reader is still in the intro.
    let frame = 0;
    function update() {
      frame = 0;
      let current = "";
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > 120) break;
        current = heading.id;
      }
      setActive(current);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // A lazy image finishing above the viewport moves every heading below it
    // without firing a scroll event, which would otherwise leave the highlight
    // pointing at the wrong section until the reader next scrolls.
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(document.body);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  if (!items.length) return null;

  return (
    <aside className="hidden xl:block">
      <nav
        aria-label="On this page"
        className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-6"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">On this page</p>
        <ul className="mt-3 border-l border-line">
          {items.map((item) => {
            const current = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current ? "location" : undefined}
                  className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm leading-snug transition-colors ${
                    current
                      ? "border-accent font-medium text-accent-strong"
                      : "border-transparent text-muted hover:border-line-strong hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
