"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { CategorySummary } from "@/lib/data";

interface Group {
  slug: string;
  label: string;
  categories: CategorySummary[];
}

/** The nav's overflow bucket: every category group that didn't make the top
 * bar. Opens a dropdown of group names, each of which expands in place
 * (accordion-style) to a nested list of that group's tools — a "sub
 * dropdown" that doesn't need its own flyout positioning. */
export function NavMoreDropdown({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function openMenu() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.bottom + 8, left: rect.left });
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setExpandedGroup(null);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? close() : openMenu())}
        aria-expanded={open}
        className="flex shrink-0 items-center gap-1 whitespace-nowrap hover:text-foreground"
      >
        More
        <span aria-hidden="true" className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: "fixed", top: pos.top, left: pos.left }}
            className="z-50 max-h-[70vh] w-60 overflow-y-auto rounded-xl border border-line bg-panel py-1.5 shadow-lg shadow-black/5"
          >
            {groups.map((group) => {
              const isExpanded = expandedGroup === group.slug;
              return (
                <div key={group.slug}>
                  <button
                    type="button"
                    onClick={() => setExpandedGroup(isExpanded ? null : group.slug)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm text-muted hover:bg-panel-2 hover:text-accent-strong"
                  >
                    {group.label}
                    <span
                      aria-hidden="true"
                      className={`text-[10px] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="border-y border-line/60 bg-panel-2/60 py-1">
                      {group.categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/tutorials/${c.slug}`}
                          onClick={close}
                          className="block px-6 py-1.5 text-sm text-muted hover:text-accent-strong"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}
