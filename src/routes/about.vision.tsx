import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { DemoTag, PageHeader, Panel, Prose, SectionHeading } from "@/components/site/primitives";

export const Route = createFileRoute("/about/vision")({
  head: () => ({
    meta: [
      { title: "Vision & Mission — Mangalam Vidya Vihar" },
      {
        name: "description",
        content: "The aim, vision and mission of Mangalam Vidya Vihar, Morak, Kota — pending school-approved wording.",
      },
      { property: "og:title", content: "Vision & Mission — Mangalam Vidya Vihar" },
      { property: "og:description", content: "The aim, vision and mission of the school." },
    ],
  }),
  component: Vision,
});

function Vision() {
  return (
    <PublicLayout>
      <PageHeader
        eyebrow="About"
        title="Vision & mission"
        lead="The existing website carries an 'Aim of the School' page. Its approved wording will be reproduced here."
      >
        <DemoTag>Placeholder wording</DemoTag>
      </PageHeader>
      <div className="grid gap-8 py-12 lg:grid-cols-2">
        <div>
          <SectionHeading title="Aim of the school" aside="Statement" />
          <Prose
            paragraphs={[
              "Placeholder: to provide a disciplined, welcoming environment in which every student can build academic strength and personal character.",
              "The school's own aim statement should replace this paragraph verbatim.",
            ]}
          />
        </div>
        <div className="grid gap-4">
          <Panel>
            <p className="label">Vision</p>
            <p className="mt-2 font-display text-xl leading-snug">Placeholder vision statement.</p>
          </Panel>
          <Panel>
            <p className="label">Mission</p>
            <p className="mt-2 font-display text-xl leading-snug">Placeholder mission statement.</p>
          </Panel>
        </div>
      </div>
    </PublicLayout>
  );
}
