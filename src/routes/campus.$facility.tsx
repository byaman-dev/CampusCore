import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { DemoTag, IndexList, PageHeader, Prose } from "@/components/site/primitives";
import { facilities } from "@/data/school";
import { facilityImage } from "@/data/gallery";

export const Route = createFileRoute("/campus/$facility")({
  loader: ({ params }) => {
    const facility = facilities.find((f) => f.slug === params.facility);
    if (!facility) throw notFound();
    return { facility };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable — Mangalam Vidya Vihar" }, { name: "robots", content: "noindex" }] };
    }
    const { facility } = loaderData;
    return {
      meta: [
        { title: `${facility.name} — Campus, Mangalam Vidya Vihar` },
        { name: "description", content: facility.blurb },
        { property: "og:title", content: `${facility.name} — Mangalam Vidya Vihar` },
        { property: "og:description", content: facility.blurb },
      ],
    };
  },
  notFoundComponent: FacilityNotFound,
  component: FacilityPage,
});

function FacilityNotFound() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="Campus" title="Facility not found" lead="This campus page does not exist.">
        <Link to="/campus" className="font-mono text-[11px] uppercase tracking-[0.15em] text-stamp hover:text-seal">
          Back to campus →
        </Link>
      </PageHeader>
    </PublicLayout>
  );
}

function FacilityPage() {
  const { facility } = Route.useLoaderData();
  const image = facilityImage(facility.slug);

  return (
    <PublicLayout>
      <PageHeader eyebrow={`Campus · ${facility.index}`} title={facility.name} lead={facility.blurb}>
        <DemoTag>Placeholder photograph & details</DemoTag>
      </PageHeader>
      <div className="grid gap-8 py-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <img
            src={image.src}
            alt={`${facility.name} — placeholder photograph`}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="aspect-[4/3] w-full rounded-md object-cover ring-1 ring-rule"
          />
          <div className="mt-6">
            <Prose paragraphs={facility.detail} />
          </div>
        </div>
        <aside>
          <IndexList
            items={facilities
              .filter((f) => f.slug !== facility.slug)
              .map((f) => ({ to: "/campus/$facility", params: { facility: f.slug }, label: f.name, index: f.index }))}
          />
        </aside>
      </div>
    </PublicLayout>
  );
}
