import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHeader } from "@/components/site/primitives";
import { facilities } from "@/data/school";
import { facilityImage } from "@/data/gallery";

export const Route = createFileRoute("/campus/")({
  head: () => ({
    meta: [
      { title: "Campus & Facilities — Mangalam Vidya Vihar, Morak" },
      {
        name: "description",
        content:
          "Library, computer lab, physics, chemistry and biology laboratories and indoor games at Mangalam Vidya Vihar, Morak.",
      },
      { property: "og:title", content: "Campus & Facilities — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Library, laboratories and indoor games facilities on campus." },
    ],
  }),
  component: CampusIndex,
});

function CampusIndex() {
  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Campus"
        title="Campus & facilities"
        lead="The facilities listed on the school's existing website, presented as an indexed campus guide."
      />
      <ul className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.map((f) => (
          <li key={f.slug}>
            <Link
              to="/campus/$facility"
              params={{ facility: f.slug }}
              className="group block h-full overflow-hidden rounded-md ring-1 ring-rule transition hover:ring-stamp/40"
            >
              <img
                src={facilityImage(f.slug).src}
                alt={`${f.name} — placeholder photograph`}
                width={768}
                height={768}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 640px) 100vw, 33vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <span className="block p-4">
                <span className="font-mono text-[10px] text-seal">{f.index}</span>
                <span className="mt-1 block font-display text-lg group-hover:underline">{f.name}</span>
                <span className="mt-1 block text-[13px] text-muted-foreground">{f.blurb}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PublicLayout>
  );
}
