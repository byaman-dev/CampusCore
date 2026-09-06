import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { IndexList, PageHeader, Prose, SectionHeading } from "@/components/site/primitives";
import { aboutPages, school } from "@/data/school";

export const Route = createFileRoute("/about/")({
  head: () => ({
    meta: [
      { title: "About the School — Mangalam Vidya Vihar, Morak" },
      {
        name: "description",
        content:
          "About Mangalam Vidya Vihar, Morak, Kota — the school, its foundation, vision, management and mandatory public disclosure.",
      },
      { property: "og:title", content: "About Mangalam Vidya Vihar" },
      { property: "og:description", content: "The school, its foundation, vision, management and public disclosure." },
    ],
  }),
  component: AboutIndex,
});

function AboutIndex() {
  return (
    <PublicLayout>
      <PageHeader
        eyebrow="About"
        title="About the school"
        lead={`${school.name} is run by ${school.foundation} at ${school.location}.`}
      />
      <div className="grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <SectionHeading title="The school" aside="Overview" />
          <Prose
            paragraphs={[
              `${school.name} serves students from Morak and the surrounding area of District Kota, Rajasthan. Its academic year, examinations and activities are set out in the school almanac.`,
              "The school's affiliation document (2023-28) is available as a download in Resources.",
              "History, founding year, enrolment strength and staff numbers are intentionally left blank here: they will be published once the school supplies confirmed figures.",
            ]}
          />
        </div>
        <aside>
          <SectionHeading title="In this section" aside="Pages" as="h2" />
          <IndexList
            items={aboutPages.slice(1).map((p, i) => ({
              to: p.to,
              label: p.label,
              index: String(i + 1).padStart(2, "0"),
            }))}
          />
        </aside>
      </div>
    </PublicLayout>
  );
}
