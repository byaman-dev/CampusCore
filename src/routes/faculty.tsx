import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { DataTable, DemoTag, PageHeader, Panel, SectionHeading } from "@/components/site/primitives";
import { staffGroups } from "@/data/school";

export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [
      { title: "Faculty & Staff — Mangalam Vidya Vihar, Morak" },
      {
        name: "description",
        content:
          "Administrative, teaching and non-teaching staff structure at Mangalam Vidya Vihar, Morak. Names are published only after school approval.",
      },
      { property: "og:title", content: "Faculty & Staff — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Administrative, teaching and non-teaching staff structure of the school." },
    ],
  }),
  component: Faculty,
});

function Faculty() {
  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Faculty"
        title="Faculty & staff"
        lead="The staff structure is shown as an indexed register. Individual names and qualifications will appear once the school supplies its approved list."
      >
        <DemoTag>Names pending school approval</DemoTag>
      </PageHeader>

      <div className="space-y-12 py-12">
        {staffGroups.map((group) => (
          <section key={group.slug} id={group.slug}>
            <SectionHeading title={group.title} aside={`${group.rows.length} entries`} />
            <DataTable
              head={["Role / subject", "Qualification", "Name"]}
              rows={group.rows.map((r) => [r.role, r.qualification, r.name])}
              caption={group.note}
            />
          </section>
        ))}
        <Panel>
          <p className="text-[13px] text-muted-foreground">
            Staff photographs, teaching experience and subject allotment can be maintained from the administrator portal once
            the school data is loaded.
          </p>
        </Panel>
      </div>
    </PublicLayout>
  );
}
