"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { CategorySummary } from "@/lib/data";

/** A top-nav group ("Accounting & Finance") that opens a dropdown listing
 * the individual tools in it ("QuickBooks", "TurboTax"). Click-to-toggle
 * rather than hover, so it works the same on touch and desktop.
 *
 * The panel renders through a portal at a fixed position computed from the
 * button's rect, rather than as an absolutely-positioned child — the nav bar
 * scrolls horizontally (many groups don't fit on one line), and `overflow-x`
 * on an ancestor clips `overflow-y` too, which would cut the dropdown off. */
export function NavCategoryDropdown({ label, categories }: { label: string; categories: CategorySummary[] }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function openMenu() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.bottom + 8, left: rect.left });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
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
        onClick={() => (open ? setOpen(false) : openMenu())}
        aria-expanded={open}
        className="flex shrink-0 items-center gap-1 whitespace-nowrap hover:text-accent"
      >
        {label}
        <span aria-hidden="true" className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: "fixed", top: pos.top, left: pos.left }}
            className="z-50 min-w-44 rounded-md border border-line bg-panel py-1.5 normal-case shadow-lg"
          >
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/tutorials/${c.slug}`}
                onClick={() => setOpen(false)}
                className="block px-3 py-1.5 font-mono text-xs text-muted hover:bg-background hover:text-accent"
              >
                {c.label}
              </Link>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
