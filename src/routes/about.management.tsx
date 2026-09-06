import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { DataTable, DemoTag, PageHeader, Prose, SectionHeading } from "@/components/site/primitives";
import { school } from "@/data/school";

export const Route = createFileRoute("/about/management")({
  head: () => ({
    meta: [
      { title: "Management — Mangalam Vidya Vihar" },
      {
        name: "description",
        content: `Management and trust information for ${school.name}, run by ${school.foundation}, Morak, Kota.`,
      },
      { property: "og:title", content: "Management — Mangalam Vidya Vihar" },
      { property: "og:description", content: `Management and trust information for ${school.name}.` },
    ],
  }),
  component: Management,
});

function Management() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="About" title="Management" lead={`The school is run by ${school.foundation}.`}>
        <DemoTag>Committee names pending</DemoTag>
      </PageHeader>
      <div className="grid gap-10 py-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <SectionHeading title="Management committee" aside="Structure" />
          <DataTable
            head={["Position", "Name"]}
            rows={[
              ["Chairperson", "To be published"],
              ["Manager", "To be published"],
              ["Principal", "To be published"],
              ["Parent representatives", "To be published"],
              ["Teacher representatives", "To be published"],
            ]}
            caption="Composition as required for disclosure"
          />
        </div>
        <div>
          <SectionHeading title="Trust" aside="Foundation" />
          <Prose
            paragraphs={[
              `${school.foundation} is named on the school's existing public website as the body running the school.`,
              "Registration details and committee membership will be published once the school shares approved records.",
            ]}
          />
        </div>
      </div>
    </PublicLayout>
  );
}
