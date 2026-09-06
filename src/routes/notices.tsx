import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { NoticeList } from "@/components/site/cards";
import { EmptyState, PageHeader, Panel, SectionHeading } from "@/components/site/primitives";
import { notices as staticNotices } from "@/data/school";
import { noticesOptions, mapNotice } from "@/lib/site-queries";
import { useSuspenseQuery } from "@tanstack/react-query";

const categories = ["All", "Circular", "Examination", "Admission", "PTM", "General"] as const;

export const Route = createFileRoute("/notices")({
  loader: ({ context }) => context.queryClient.ensureQueryData(noticesOptions()),
  head: () => ({
    meta: [
      { title: "Notices & Circulars — Mangalam Vidya Vihar, Morak" },
      {
        name: "description",
        content:
          "Notices, circulars, examination and admission announcements from Mangalam Vidya Vihar, Morak, Kota, Rajasthan.",
      },
      { property: "og:title", content: "Notices & Circulars — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Latest school notices, circulars and examination announcements." },
    ],
  }),
  errorComponent: NoticesError,
  notFoundComponent: NoticesNotFound,
  component: Notices,
});

function NoticesError() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="Notices" title="This page didn't load" lead="Please try again in a moment.">
        <Link to="/" className="font-mono text-[11px] uppercase tracking-[0.15em] text-stamp hover:text-seal">
          Back home →
        </Link>
      </PageHeader>
    </PublicLayout>
  );
}

function NoticesNotFound() {
  return (
    <PublicLayout>
      <PageHeader eyebrow="Notices" title="Page not found" lead="This page does not exist." />
    </PublicLayout>
  );
}

function Notices() {
  const { data } = useSuspenseQuery(noticesOptions());
  const notices = data.length ? data.map(mapNotice) : staticNotices;
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const filtered = useMemo(
    () => (active === "All" ? notices : notices.filter((n) => n.category === active)),
    [active, notices],
  );

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Notices"
        title="Notices & circulars"
        lead="The notice board, kept in date order. Items marked as school records come from the school's existing published notices."
      />

      <div className="grid gap-10 py-12 lg:grid-cols-[1fr_18rem]">
        <section>
          <SectionHeading title="Notice board" aside={`${filtered.length} items`} />
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                aria-pressed={active === c}
                className={`min-h-11 rounded-sm px-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  active === c ? "bg-foreground text-background" : "text-muted-foreground ring-1 ring-rule hover:bg-surface"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {filtered.length ? (
            <NoticeList items={filtered} />
          ) : (
            <EmptyState title="Nothing under this heading" note="No notices are filed in this category at present." />
          )}
        </section>

        <aside className="space-y-4">
          <Panel>
            <h2 className="font-display text-lg">Attachments</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Circular PDFs will be attached to each notice once the school uploads its document set. Until then, filenames
              are shown for reference.
            </p>
          </Panel>
          <Panel>
            <h2 className="font-display text-lg">Publishing</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Notices are published from the administrator portal and can be targeted at students, parents or the whole
              school.
            </p>
          </Panel>
        </aside>
      </div>
    </PublicLayout>
  );
}
