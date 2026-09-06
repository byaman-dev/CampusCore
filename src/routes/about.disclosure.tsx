import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { DataTable, PageHeader, Panel, SectionHeading } from "@/components/site/primitives";
import { disclosureRows } from "@/data/school";

export const Route = createFileRoute("/about/disclosure")({
  head: () => ({
    meta: [
      { title: "Mandatory Public Disclosure — Mangalam Vidya Vihar" },
      {
        name: "description",
        content:
          "Mandatory public disclosure information for Mangalam Vidya Vihar, Morak, Kota — school particulars and affiliation documents.",
      },
      { property: "og:title", content: "Mandatory Public Disclosure — Mangalam Vidya Vihar" },
      { property: "og:description", content: "School particulars, affiliation and compliance documents." },
    ],
  }),
  component: Disclosure,
});

function Disclosure() {
  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Compliance"
        title="Mandatory public disclosure"
        lead="School particulars and documents required to be published. Fields marked 'to be published' await confirmed records from the school."
      />
      <div className="grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHeading title="General information" aside="Particulars" />
          <DataTable head={["Field", "Details"]} rows={disclosureRows.map((r) => [r.label, r.value])} />
        </div>
        <div className="grid gap-4">
          <Panel>
            <p className="label">Documents</p>
            <p className="mt-2 text-sm">Affiliation 2023-28 and the annual almanac are listed in Resources.</p>
            <Link
              to="/resources"
              className="mt-3 inline-flex font-mono text-[11px] uppercase tracking-[0.15em] text-stamp hover:text-seal"
            >
              Open resources →
            </Link>
          </Panel>
          <Panel>
            <p className="label">Note</p>
            <p className="mt-2 text-[13px] text-muted-foreground">
              No student personal information is published on this website. Student records live only inside the
              authenticated portal.
            </p>
          </Panel>
        </div>
      </div>
    </PublicLayout>
  );
}
