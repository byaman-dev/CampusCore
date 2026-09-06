import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { DemoTag, IndexList, PageHeader, Prose, SectionHeading } from "@/components/site/primitives";
import { academicTopics } from "@/data/school";

export const Route = createFileRoute("/academics/$topic")({
  loader: ({ params }) => {
    const topic = academicTopics.find((t) => t.slug === params.topic);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable — Mangalam Vidya Vihar" }, { name: "robots", content: "noindex" }] };
    }
    const { topic } = loaderData;
    return {
      meta: [
        { title: `${topic.title} — Academics, Mangalam Vidya Vihar` },
        { name: "description", content: topic.intro },
        { property: "og:title", content: `${topic.title} — Mangalam Vidya Vihar` },
        { property: "og:description", content: topic.intro },
      ],
    };
  },
  notFoundComponent: TopicNotFound,
  component: Topic,
});

function TopicNotFound() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="Academics" title="Page not found" lead="This academic page does not exist.">
        <Link to="/academics" className="font-mono text-[11px] uppercase tracking-[0.15em] text-stamp hover:text-seal">
          Back to academics →
        </Link>
      </PageHeader>
    </PublicLayout>
  );
}

function Topic() {
  const { topic } = Route.useLoaderData();

  return (
    <PublicLayout>
      <PageHeader eyebrow="Academics" title={topic.title} lead={topic.intro}>
        <DemoTag>Awaiting school-approved text</DemoTag>
      </PageHeader>
      <div className="grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          {topic.sections.map((s) => (
            <section key={s.heading}>
              <SectionHeading title={s.heading} />
              <Prose paragraphs={s.body} />
            </section>
          ))}
        </div>
        <aside>
          <SectionHeading title="Other academic pages" as="h2" />
          <IndexList
            items={academicTopics
              .filter((t) => t.slug !== topic.slug)
              .map((t) => ({ to: "/academics/$topic", params: { topic: t.slug }, label: t.title }))}
          />
        </aside>
      </div>
    </PublicLayout>
  );
}
