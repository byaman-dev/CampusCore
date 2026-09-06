import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { IndexList, PageHeader, Panel, SectionHeading } from "@/components/site/primitives";
import { academicTopics } from "@/data/school";

export const Route = createFileRoute("/academics/")({
  head: () => ({
    meta: [
      { title: "Academics — Mangalam Vidya Vihar, Morak" },
      {
        name: "description",
        content:
          "School hours, rules and regulations, examination schedule, fee structure and parent information for Mangalam Vidya Vihar, Morak.",
      },
      { property: "og:title", content: "Academics — Mangalam Vidya Vihar" },
      { property: "og:description", content: "School hours, rules, examinations, fees and parent information." },
    ],
  }),
  component: AcademicsIndex,
});

function AcademicsIndex() {
  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Academics"
        title="Academic information"
        lead="The pages the school's existing website groups under academics, reorganised so parents can find each one quickly."
      />
      <div className="grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHeading title="Pages" aside="Index" />
          <IndexList
            items={academicTopics.map((t, i) => ({
              to: "/academics/$topic",
              params: { topic: t.slug },
              label: t.title,
              note: t.intro,
              index: String(i + 1).padStart(2, "0"),
            }))}
          />
        </div>
        <div className="grid gap-4">
          <Panel>
            <p className="label">Almanac</p>
            <p className="mt-2 text-sm">
              The school almanac (Nursery to Class XII) is the primary calendar document and is listed in Resources.
            </p>
          </Panel>
          <Panel>
            <p className="label">Dates</p>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Legacy examination schedules from the old website are treated as historical until the school issues the
              current session's datesheet.
            </p>
          </Panel>
        </div>
      </div>
    </PublicLayout>
  );
}
