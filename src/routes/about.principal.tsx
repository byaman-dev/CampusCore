import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { DemoTag, PageHeader, Panel, Prose } from "@/components/site/primitives";

export const Route = createFileRoute("/about/principal")({
  head: () => ({
    meta: [
      { title: "Principal's Message — Mangalam Vidya Vihar" },
      {
        name: "description",
        content: "A message from the Principal of Mangalam Vidya Vihar, Morak, Kota. Awaiting school-approved text.",
      },
      { property: "og:title", content: "Principal's Message — Mangalam Vidya Vihar" },
      { property: "og:description", content: "A message from the Principal of Mangalam Vidya Vihar, Morak." },
    ],
  }),
  component: Principal,
});

function Principal() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="About" title="Principal's message" lead="To be supplied and approved by the school.">
        <DemoTag>Placeholder message</DemoTag>
      </PageHeader>
      <div className="grid gap-8 py-12 lg:grid-cols-[1fr_20rem]">
        <div>
          <blockquote className="max-w-[60ch] border-l-2 border-seal pl-5 font-display text-2xl leading-snug">
            “Our aim is steady progress — in the classroom, on the field and in character.”
          </blockquote>
          <div className="mt-6">
            <Prose
              paragraphs={[
                "Placeholder body text. The principal's full message, name and photograph will appear here once provided by the school.",
                "Until then no name, qualification or photograph is published, so nothing on this page can be mistaken for an official statement.",
              ]}
            />
          </div>
        </div>
        <Panel>
          <p className="label">Principal</p>
          <p className="mt-2 font-display text-lg">To be published</p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Name, qualification and photograph pending school confirmation.
          </p>
        </Panel>
      </div>
    </PublicLayout>
  );
}
