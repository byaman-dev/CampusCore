import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/site/PublicLayout";
import { DataTable, DemoTag, PageHeader, Panel, SectionHeading, VerifiedTag } from "@/components/site/primitives";
import { achievements as staticAchievements, resultAnalysis } from "@/data/school";
import { achievementsOptions, mapAchievement } from "@/lib/site-queries";

export const Route = createFileRoute("/achievements")({
  loader: ({ context }) => context.queryClient.ensureQueryData(achievementsOptions()),
  head: () => ({
    meta: [
      { title: "Student Achievements & Results — Mangalam Vidya Vihar" },
      {
        name: "description",
        content:
          "Student achievements and result analysis for Mangalam Vidya Vihar, Morak — state and district level cricket, olympiads and cultural events.",
      },
      { property: "og:title", content: "Achievements — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Student achievements and result analysis for the school." },
    ],
  }),
  errorComponent: AchievementsError,
  notFoundComponent: AchievementsNotFound,
  component: Achievements,
});

function AchievementsError() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="Achievements" title="This page didn't load" lead="Please try again in a moment.">
        <Link to="/" className="font-mono text-[11px] uppercase tracking-[0.15em] text-stamp hover:text-seal">
          Back home →
        </Link>
      </PageHeader>
    </PublicLayout>
  );
}

function AchievementsNotFound() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="Achievements" title="Page not found" lead="This page does not exist." />
    </PublicLayout>
  );
}

function Achievements() {
  const { data } = useSuspenseQuery(achievementsOptions());
  const achievements = data.length ? data.map(mapAchievement) : staticAchievements;

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Achievements"
        title="Student achievements"
        lead="Achievements recorded on the school's existing website. Individual student names are not published here."
      >
        <div className="flex flex-wrap gap-2">
          <VerifiedTag />
          <DemoTag>Result figures pending</DemoTag>
        </div>
      </PageHeader>
      <div className="grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <SectionHeading title="Selected achievements" aside="Record" />
          <ul className="divide-y divide-rule border-y border-rule">
            {achievements.map((a) => (
              <li
                key={a.id}
                className="-mx-2 grid grid-cols-1 items-baseline gap-1 rounded-sm px-2 py-4 transition-colors hover:bg-surface sm:grid-cols-[1fr_auto] sm:gap-6"
              >
                <p className="text-base font-medium">{a.title}</p>
                <span className="font-mono text-xs text-muted-foreground">{a.year}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <SectionHeading title="Result analysis" aside="Board results" />
          <DataTable head={["Measure", "Value"]} rows={resultAnalysis.map((r) => [r.label, r.value])} />
          <Panel className="mt-4">
            <p className="text-[13px] text-muted-foreground">
              Board result figures will be published once the school shares its verified result analysis.
            </p>
          </Panel>
        </section>
      </div>
    </PublicLayout>
  );
}
