import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { GalleryItem } from "@/data/school";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? null : (i + delta + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 xl:columns-4 [&>li]:mb-3">
        {items.map((item, i) => (
          <li key={item.id} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group block w-full overflow-hidden rounded-md ring-1 ring-rule transition hover:ring-stamp/40"
            >
              <img
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 50vw, 25vw"
                className="w-full transition-transform duration-500 ease-almanac group-hover:scale-[1.02]"
              />
              <span className="flex items-center justify-between gap-2 px-3 py-2 text-left">
                <span className="text-[13px] font-medium">{item.title}</span>
                <span className="label shrink-0">{item.category}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-50 flex flex-col bg-foreground/95 p-4"
        >
          <div className="flex items-center justify-between text-background">
            <p className="font-display text-lg">{active.title}</p>
            <button
              type="button"
              onClick={close}
              aria-label="Close image viewer"
              className="grid size-11 place-items-center rounded-sm ring-1 ring-background/30 hover:bg-background/10"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="grid size-11 shrink-0 place-items-center rounded-sm text-background ring-1 ring-background/30 hover:bg-background/10"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <img
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              className="mx-auto max-h-full min-h-0 w-auto max-w-full rounded-md object-contain"
            />
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="grid size-11 shrink-0 place-items-center rounded-sm text-background ring-1 ring-background/30 hover:bg-background/10"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
          <p className="pt-3 text-center font-mono text-[11px] text-background/60">
            {(openIndex ?? 0) + 1} / {items.length} · placeholder photography
          </p>
        </div>
      ) : null}
    </>
  );
}
