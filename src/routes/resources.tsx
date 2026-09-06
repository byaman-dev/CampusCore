import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { ResourceCard } from "@/components/site/cards";
import { DemoTag, PageHeader, Panel, SectionHeading, VerifiedTag } from "@/components/site/primitives";
import { resources } from "@/data/school";

const groups = ["Academics", "Admissions", "Compliance", "Careers", "Student services"] as const;

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Downloads & Resources — Mangalam Vidya Vihar, Morak" },
      {
        name: "description",
        content:
          "Almanac, admission notification, affiliation document and forms available for download from Mangalam Vidya Vihar, Morak.",
      },
      { property: "og:title", content: "Downloads & Resources — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Almanac, admission notification, affiliation document and school forms." },
    ],
  }),
  component: Resources,
});

function Resources() {
  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Resources"
        title="Downloads & forms"
        lead="Documents listed on the school's existing website, grouped by purpose. Files will be attached once the school supplies them."
      >
        <div className="flex flex-wrap gap-2">
          <VerifiedTag />
          <DemoTag>Files awaiting upload</DemoTag>
        </div>
      </PageHeader>

      <div className="space-y-12 py-12">
        {groups.map((group) => {
          const items = resources.filter((r) => r.group === group);
          if (!items.length) return null;
          return (
            <section key={group}>
              <SectionHeading title={group} aside={`${items.length} documents`} />
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r) => (
                  <li key={r.id}>
                    <ResourceCard item={r} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        <Panel>
          <p className="text-[13px] text-muted-foreground">
            Class notes and worksheets shared by teachers are kept inside the portal so that they reach only the intended
            classes.
          </p>
        </Panel>
      </div>
    </PublicLayout>
  );
}
