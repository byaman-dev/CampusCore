import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/site/PublicLayout";
import { EventList } from "@/components/site/cards";
import { DemoTag, PageHeader, Panel, SectionHeading } from "@/components/site/primitives";
import { events as staticEvents } from "@/data/school";
import { eventsOptions, mapEvent } from "@/lib/site-queries";

const groups = ["Academic", "Sports", "Cultural", "Parents"] as const;

export const Route = createFileRoute("/events")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsOptions()),
  head: () => ({
    meta: [
      { title: "School Events & Calendar — Mangalam Vidya Vihar, Morak" },
      {
        name: "description",
        content:
          "Academic, sports and cultural calendar for Mangalam Vidya Vihar, Morak — exhibitions, athletics, recitals and parent days.",
      },
      { property: "og:title", content: "Events & Calendar — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Academic, sports and cultural events through the session." },
    ],
  }),
  errorComponent: EventsError,
  notFoundComponent: EventsNotFound,
  component: Events,
});

function EventsError() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="Events" title="This page didn't load" lead="Please try again in a moment.">
        <Link to="/" className="font-mono text-[11px] uppercase tracking-[0.15em] text-stamp hover:text-seal">
          Back home →
        </Link>
      </PageHeader>
    </PublicLayout>
  );
}

function EventsNotFound() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="Events" title="Page not found" lead="This page does not exist." />
    </PublicLayout>
  );
}

function Events() {
  const { data } = useSuspenseQuery(eventsOptions());
  const events = data.length ? data.map(mapEvent) : staticEvents;

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Events"
        title="Calendar of events"
        lead="A working calendar for the session. Dates are indicative placeholders until the school issues the approved almanac dates."
      >
        <DemoTag>Indicative dates</DemoTag>
      </PageHeader>

      <div className="grid gap-10 py-12 lg:grid-cols-[1fr_18rem]">
        <section>
          <SectionHeading title="Upcoming" aside={`${events.length} entries`} />
          <EventList items={events} />
        </section>
        <aside className="space-y-4">
          <Panel>
            <h2 className="font-display text-lg">By category</h2>
            <ul className="mt-3 space-y-2">
              {groups.map((g) => (
                <li key={g} className="flex items-baseline justify-between gap-3 border-b border-rule pb-2 last:border-0">
                  <span className="text-sm">{g}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {events.filter((e) => e.category === g).length}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <h2 className="font-display text-lg">Almanac</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">
              The Almanac 2025-26 (Nursery to Class XII) is listed under Resources and carries the school's own dated
              schedule.
            </p>
          </Panel>
        </aside>
      </div>
    </PublicLayout>
  );
}
