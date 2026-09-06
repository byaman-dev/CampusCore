import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/site/PublicLayout";
import { DemoTag, PageHeader, SectionHeading, VerifiedTag } from "@/components/site/primitives";
import { activities as staticActivities, competitions as staticCompetitions, sports as staticSports } from "@/data/school";
import { activitiesOptions, mapActivity } from "@/lib/site-queries";

export const Route = createFileRoute("/activities")({
  loader: ({ context }) => context.queryClient.ensureQueryData(activitiesOptions()),
  head: () => ({
    meta: [
      { title: "Activities, Competitions & Sports — Mangalam Vidya Vihar" },
      {
        name: "description",
        content:
          "Cultural activities, competitions and sports at Mangalam Vidya Vihar, Morak — including the cricket academy and annual sports meet.",
      },
      { property: "og:title", content: "Activities — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Cultural activities, competitions and sports through the school year." },
    ],
  }),
  errorComponent: ActivitiesError,
  notFoundComponent: ActivitiesNotFound,
  component: Activities,
});

function ActivitiesError() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="Activities" title="This page didn't load" lead="Please try again in a moment.">
        <Link to="/" className="font-mono text-[11px] uppercase tracking-[0.15em] text-stamp hover:text-seal">
          Back home →
        </Link>
      </PageHeader>
    </PublicLayout>
  );
}

function ActivitiesNotFound() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="Activities" title="Page not found" lead="This page does not exist." />
    </PublicLayout>
  );
}

function Group({
  title,
  aside,
  items,
}: {
  title: string;
  aside: string;
  items: { id: string; title: string; note: string; verified?: boolean }[];
}) {
  return (
    <section>
      <SectionHeading title={title} aside={aside} />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <li key={a.id} className="flex h-full flex-col rounded-md bg-surface p-4 ring-1 ring-rule">
            <h3 className="font-display text-lg leading-snug">{a.title}</h3>
            <p className="mt-1 flex-1 text-[13px] text-muted-foreground">{a.note}</p>
            <span className="mt-3">{a.verified ? <VerifiedTag /> : <DemoTag />}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Activities() {
  const { data } = useSuspenseQuery(activitiesOptions());
  const mapped = data.map((row) => ({ ...mapActivity(row), group: row.group_name }));

  const activitiesItems = mapped.filter((a) => a.group?.toLowerCase() === "activities");
  const competitionItems = mapped.filter((a) => a.group?.toLowerCase() === "competitions");
  const sportsItems = mapped.filter((a) => a.group?.toLowerCase() === "sports");

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Activities"
        title="Activities, competitions & sports"
        lead="Activity names below are taken from the school's own event labels; descriptions are summaries pending school confirmation."
      />
      <div className="space-y-12 py-12">
        <Group title="Activities" aside="Through the year" items={activitiesItems.length ? activitiesItems : staticActivities} />
        <Group title="Competitions" aside="Inter-school & in-house" items={competitionItems.length ? competitionItems : staticCompetitions} />
        <Group title="Sports" aside="Games & meets" items={sportsItems.length ? sportsItems : staticSports} />
      </div>
    </PublicLayout>
  );
}
