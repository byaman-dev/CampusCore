import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PortalLayout, Widget } from "@/components/portal/PortalLayout";
import { AccountManager } from "@/components/portal/AccountManager";
import { RecordManager } from "@/components/cms/RecordManager";
import { SiteSettingsForm } from "@/components/cms/SiteSettingsForm";
import { cmsConfigs, cmsTableOrder, type TableName } from "@/components/cms/cms-config";
import { adminSections, adminStats, classes, rosterFor } from "@/data/portal";
import { notices, staffGroups } from "@/data/school";
import { portalActions, usePortalState } from "@/lib/portal-store";

export const Route = createFileRoute("/_authenticated/portal/admin")({
  head: () => ({
    meta: [
      { title: "Administrator Overview — Mangalam Vidya Vihar Portal" },
      {
        name: "description",
        content:
          "Administrator workspace prototype: manage website content, students, teachers, classes, admissions, notices and reports.",
      },
      { property: "og:title", content: "Administrator Overview — Mangalam Vidya Vihar" },
      { property: "og:description", content: "School office workspace for content, records, classes and admissions." },
    ],
  }),
  component: AdminPortal,
});

const field =
  "mt-1 w-full rounded-sm border border-background/20 bg-background/[0.06] px-3 py-2.5 text-sm text-background outline-none transition focus:border-background/50";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-background/50";

type WebsiteTab = "settings" | TableName;

const websiteTabs: { key: WebsiteTab; label: string }[] = [
  { key: "settings", label: "Site settings" },
  ...cmsTableOrder.map((table) => ({ key: table, label: cmsConfigs[table].label })),
];

const enquiries = [
  { id: "en-1", name: "Demo enquiry A", cls: "Class VI", via: "Phone", status: "New" },
  { id: "en-2", name: "Demo enquiry B", cls: "Class IX", via: "Website", status: "Contacted" },
  { id: "en-3", name: "Demo enquiry C", cls: "Nursery", via: "Walk-in", status: "Documents pending" },
];

function AdminPortal() {
  const [section, setSection] = useState(adminSections[0]?.label ?? "Overview");
  const announcements = usePortalState((s) => s.announcements);
  const attendance = usePortalState((s) => s.attendance);
  const [notice, setNotice] = useState({ title: "", body: "", audience: "Whole school" });
  const [websiteTab, setWebsiteTab] = useState<WebsiteTab>("settings");

  return (
    <PortalLayout
      role="admin"
      title="School office overview"
      subtitle="One console for website content, records, classes and admissions. All counts marked — await the school's own data."
    >
      <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="Admin sections" className="rounded-md bg-background/[0.04] p-2 ring-1 ring-background/10">
          <ul className="space-y-0.5">
            {adminSections.map((s) => (
              <li key={s.label}>
                <button
                  type="button"
                  onClick={() => setSection(s.label)}
                  aria-current={section === s.label ? "true" : undefined}
                  className={`flex min-h-11 w-full items-center rounded-sm px-3 text-left text-sm transition-colors ${
                    section === s.label ? "bg-background text-foreground" : "text-background/70 hover:bg-background/[0.08]"
                  }`}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4">
          {section === "Website Content" ? (
            <WebsiteManagement websiteTab={websiteTab} onTabChange={setWebsiteTab} />
          ) : (
            <>
          <Widget label={`Section · ${section}`}>
            <p className="text-sm text-background/70">
              {adminSections.find((s) => s.label === section)?.note}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-background/40">
              Prototype view — connect school data to make this section live
            </p>
          </Widget>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {adminStats.map((s) => (
              <div key={s.label} className="rounded-md bg-background/[0.04] p-4 ring-1 ring-background/10">
                <p className="font-display text-3xl text-background">{s.value}</p>
                <p className="mt-1 text-sm text-background/70">{s.label}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-background/40">{s.note}</p>
              </div>
            ))}
          </div>

          <AccountManager />

          <div className="grid gap-4 xl:grid-cols-2">
            <Widget label="Publish a notice to the website">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  portalActions.addAnnouncement({ ...notice, postedAt: "Just now" });
                  toast.success("Notice queued for publishing", {
                    description: "In this prototype the notice is stored locally only.",
                  });
                  setNotice({ ...notice, title: "", body: "" });
                }}
                className="space-y-3"
              >
                <label className="block">
                  <span className={label}>Headline</span>
                  <input
                    required
                    value={notice.title}
                    onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                    className={field}
                  />
                </label>
                <label className="block">
                  <span className={label}>Body</span>
                  <textarea
                    required
                    rows={3}
                    value={notice.body}
                    onChange={(e) => setNotice({ ...notice, body: e.target.value })}
                    className={field}
                  />
                </label>
                <label className="block">
                  <span className={label}>Audience</span>
                  <select
                    value={notice.audience}
                    onChange={(e) => setNotice({ ...notice, audience: e.target.value })}
                    className={field}
                  >
                    <option>Whole school</option>
                    <option>All parents</option>
                    <option>Public website</option>
                    {classes.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  className="min-h-11 w-full rounded-sm bg-background px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-opacity hover:opacity-90"
                >
                  Publish notice
                </button>
              </form>
            </Widget>

            <div className="space-y-4">
              <Widget label="Admission enquiries">
                <ul className="divide-y divide-background/10">
                  {enquiries.map((e) => (
                    <li key={e.id} className="flex flex-wrap items-baseline gap-2 py-2.5 first:pt-0 last:pb-0">
                      <span className="text-sm">{e.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-background/45">
                        {e.cls} · {e.via}
                      </span>
                      <span className="ml-auto rounded-full bg-background/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-background/70">
                        {e.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </Widget>

              <Widget label="Attendance submitted today">
                <ul className="space-y-2">
                  {attendance.map((a) => (
                    <li key={a.id} className="flex items-baseline gap-3 rounded-sm px-3 py-2 ring-1 ring-background/10">
                      <span className="text-sm">{a.className}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-background/45">{a.date}</span>
                      <span className="ml-auto font-mono text-[11px] text-background/60">
                        {a.present}/{a.present + a.absent}
                      </span>
                    </li>
                  ))}
                </ul>
              </Widget>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Widget label="Classes & rolls">
              <ul className="space-y-2">
                {classes.map((c) => (
                  <li key={c} className="flex items-baseline gap-3 rounded-sm px-3 py-2 ring-1 ring-background/10">
                    <span className="text-sm">{c}</span>
                    <span className="ml-auto font-mono text-[11px] text-background/55">{rosterFor(c).length} students</span>
                  </li>
                ))}
              </ul>
            </Widget>

            <Widget label="Staff register">
              <ul className="space-y-2">
                {staffGroups.map((g) => (
                  <li key={g.slug} className="rounded-sm px-3 py-2 ring-1 ring-background/10">
                    <p className="text-sm">{g.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-background/45">
                      {g.rows.length} roles · names pending
                    </p>
                  </li>
                ))}
              </ul>
            </Widget>

            <Widget
              label="Website content"
              action={
                <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.14em] text-background/60 underline">
                  View site
                </Link>
              }
            >
              <ul className="space-y-2">
                {notices.slice(0, 3).map((n) => (
                  <li key={n.id} className="rounded-sm px-3 py-2 ring-1 ring-background/10">
                    <p className="truncate text-sm">{n.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-background/45">
                      Live · {n.category}
                    </p>
                  </li>
                ))}
                {announcements.slice(0, 2).map((a) => (
                  <li key={a.id} className="rounded-sm px-3 py-2 ring-1 ring-background/10">
                    <p className="truncate text-sm">{a.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-background/45">
                      Portal only · {a.audience}
                    </p>
                  </li>
                ))}
              </ul>
            </Widget>
          </div>
            </>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

function WebsiteManagement({
  websiteTab,
  onTabChange,
}: {
  websiteTab: WebsiteTab;
  onTabChange: (tab: WebsiteTab) => void;
}) {
  return (
    <div className="space-y-4">
      <nav aria-label="Website management sections" className="rounded-md bg-background/[0.04] p-2 ring-1 ring-background/10">
        <ul className="flex flex-wrap gap-1">
          {websiteTabs.map((t) => (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => onTabChange(t.key)}
                aria-current={websiteTab === t.key ? "true" : undefined}
                className={`flex min-h-11 items-center rounded-sm px-3 text-left text-sm transition-colors ${
                  websiteTab === t.key
                    ? "bg-background text-foreground"
                    : "text-background/70 hover:bg-background/[0.08]"
                }`}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {websiteTab === "settings" ? <SiteSettingsForm /> : <RecordManager config={cmsConfigs[websiteTab]} />}
    </div>
  );
}
