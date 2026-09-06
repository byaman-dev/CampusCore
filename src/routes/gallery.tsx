import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { DemoTag, PageHeader } from "@/components/site/primitives";
import { galleryItems } from "@/data/gallery";

const filters = ["All", "Academic", "Campus", "Sports", "Cultural"] as const;

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Photo Gallery — Mangalam Vidya Vihar, Morak" },
      {
        name: "description",
        content:
          "Photographs of classrooms, assemblies, laboratories, sports and cultural events at Mangalam Vidya Vihar, Morak.",
      },
      { property: "og:title", content: "Photo Gallery — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Classrooms, laboratories, assemblies, sports and cultural events on campus." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const items = useMemo(
    () => (active === "All" ? galleryItems : galleryItems.filter((g) => g.category === active)),
    [active],
  );

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Gallery"
        title="Photo gallery"
        lead="An album view of campus life. These are placeholder photographs and will be replaced by the school's own photo set."
      >
        <DemoTag>Placeholder photography</DemoTag>
      </PageHeader>

      <div className="py-12">
        <div className="mb-5 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={`min-h-11 rounded-sm px-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                active === f ? "bg-foreground text-background" : "text-muted-foreground ring-1 ring-rule hover:bg-surface"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <GalleryGrid items={items} />
      </div>
    </PublicLayout>
  );
}
