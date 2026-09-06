import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/site/PublicLayout";
import { DemoTag, PageHeader, Panel, SectionHeading, VerifiedTag } from "@/components/site/primitives";
import { submitAdmissionEnquiry } from "@/lib/cms.functions";
import { school } from "@/data/school";


export const Route = createFileRoute("/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions — Mangalam Vidya Vihar, Morak" },
      {
        name: "description",
        content:
          "Admission eligibility, mode of selection and enquiry information for Mangalam Vidya Vihar, Morak, District Kota.",
      },
      { property: "og:title", content: "Admissions — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Eligibility, selection process and how to enquire about admission." },
    ],
  }),
  component: Admissions,
});

const steps = [
  { index: "01", label: "Enquire at the school office", note: "Confirm the current admission cycle and available seats." },
  { index: "02", label: "Collect and submit the form", note: "Along with previous report card and documents." },
  { index: "03", label: "Interaction or assessment", note: "Interaction for pre-primary; written assessment for higher classes." },
  { index: "04", label: "Confirmation and enrolment", note: "Admission confirmed by the school office." },
];

function Admissions() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const sendEnquiry = useServerFn(submitAdmissionEnquiry);


  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Admissions"
        title="Admissions"
        lead="The school's admission notification is published on the notice board. Please confirm the current cycle with the office before applying."
      >
        <div className="flex flex-wrap gap-2">
          <VerifiedTag />
          <DemoTag>Process steps are indicative</DemoTag>
        </div>
      </PageHeader>

      <div className="grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-10">
          <section>
            <SectionHeading title="How admission works" aside="Process" />
            <ol className="divide-y divide-rule border-y border-rule">
              {steps.map((s) => (
                <li key={s.index} className="flex gap-4 py-4">
                  <span className="font-mono text-[11px] text-seal">{s.index}</span>
                  <span>
                    <span className="block text-[15px] font-medium">{s.label}</span>
                    <span className="mt-0.5 block text-[13px] text-muted-foreground">{s.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <SectionHeading title="Related pages" aside="Academics" />
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Admission eligibility", topic: "admission-eligibility" },
                { label: "Mode of selection", topic: "mode-of-selection" },
                { label: "Fee structure", topic: "fee-structure" },
                { label: "School hours", topic: "school-hours" },
              ].map((l) => (
                <li key={l.topic}>
                  <Link
                    to="/academics/$topic"
                    params={{ topic: l.topic }}
                    className="flex min-h-11 items-center justify-between rounded-md bg-surface px-4 ring-1 ring-rule transition hover:ring-stamp/40"
                  >
                    <span className="text-sm font-medium">{l.label}</span>
                    <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <Panel>
            <p className="label">Enquiry</p>
            <h2 className="mt-2 font-display text-xl">Ask the school office</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Enquiries are sent straight to the school office and appear in the administrator portal.
            </p>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                const parent_name = String(fd.get("parent_name") ?? "").trim();
                const phone = String(fd.get("phone") ?? "").trim();
                const class_applied = String(fd.get("class_applied") ?? "").trim();
                const student_name = String(fd.get("student_name") ?? "").trim();
                setBusy(true);
                try {
                  await sendEnquiry({
                    data: {
                      student_name: student_name || parent_name,
                      parent_name,
                      phone,
                      ...(class_applied ? { class_applied } : {}),
                    },
                  });
                  setSent(true);
                  form.reset();
                  toast.success("Enquiry sent to the school office");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Could not send the enquiry");
                } finally {
                  setBusy(false);
                }
              }}
            >
              <div>
                <label htmlFor="enq-student" className="label">
                  Student name
                </label>
                <input
                  id="enq-student"
                  name="student_name"
                  required
                  className="mt-1 h-11 w-full rounded-sm bg-background px-3 text-sm ring-1 ring-rule placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-seal"
                  placeholder="Full name of the child"
                />
              </div>
              <div>
                <label htmlFor="enq-name" className="label">
                  Parent / guardian name
                </label>
                <input
                  id="enq-name"
                  name="parent_name"
                  required
                  className="mt-1 h-11 w-full rounded-sm bg-background px-3 text-sm ring-1 ring-rule placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-seal"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label htmlFor="enq-phone" className="label">
                  Contact number
                </label>
                <input
                  id="enq-phone"
                  name="phone"
                  required
                  inputMode="tel"
                  className="mt-1 h-11 w-full rounded-sm bg-background px-3 text-sm ring-1 ring-rule placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-seal"
                  placeholder="10-digit number"
                />
              </div>
              <div>
                <label htmlFor="enq-class" className="label">
                  Class sought
                </label>
                <input
                  id="enq-class"
                  name="class_applied"
                  className="mt-1 h-11 w-full rounded-sm bg-background px-3 text-sm ring-1 ring-rule placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-seal"
                  placeholder="e.g. Class VI"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="min-h-11 w-full rounded-sm bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-stamp disabled:opacity-60"
              >
                {busy ? "Sending…" : "Submit enquiry"}
              </button>
              {sent ? (
                <p className="font-mono text-[11px] text-pine">Received. The office will contact you.</p>
              ) : null}
            </form>

          </Panel>
          <Panel>
            <p className="label">Office</p>
            <p className="mt-2 text-sm">{school.address}</p>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              {school.email}
              <br />
              {school.phones.join(" · ")}
            </p>
          </Panel>
        </aside>
      </div>
    </PublicLayout>
  );
}
