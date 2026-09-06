import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/site/PublicLayout";
import { DemoTag, PageHeader, Panel, SectionHeading, VerifiedTag } from "@/components/site/primitives";
import { submitContactMessage } from "@/lib/cms.functions";
import { school } from "@/data/school";


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mangalam Vidya Vihar, Morak, Kota" },
      {
        name: "description",
        content:
          "Contact Mangalam Vidya Vihar: Basant Vihar, Aditya Nager, Morak, District Kota, Rajasthan 326520. Email mvvmorak@gmail.com.",
      },
      { property: "og:title", content: "Contact — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Address, phone numbers and email for the school office in Morak, Kota." },
    ],
  }),
  component: Contact,
});

const field =
  "mt-1 w-full rounded-sm border border-rule bg-background px-3 py-2.5 text-sm outline-none transition focus:border-stamp focus:ring-2 focus:ring-stamp/20";

function Contact() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const sendMessage = useServerFn(submitContactMessage);


  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Contact"
        title="Reach the school office"
        lead="Address, telephone numbers and email as published by the school. The office is the correct route for all official queries."
      >
        <VerifiedTag />
      </PageHeader>

      <div className="grid gap-10 py-12 lg:grid-cols-[1fr_1fr]">
        <section>
          <SectionHeading title="School office" aside="From school records" />
          <dl className="divide-y divide-rule border-y border-rule">
            <div className="flex gap-4 py-4">
              <MapPin className="mt-0.5 size-4 shrink-0 text-seal" aria-hidden="true" />
              <div>
                <dt className="label">Address</dt>
                <dd className="mt-1 text-[15px]">{school.address}</dd>
              </div>
            </div>
            <div className="flex gap-4 py-4">
              <Phone className="mt-0.5 size-4 shrink-0 text-seal" aria-hidden="true" />
              <div>
                <dt className="label">Telephone</dt>
                <dd className="mt-1 space-x-3 text-[15px]">
                  {school.phones.map((p) => (
                    <a key={p} href={`tel:${p}`} className="underline decoration-rule underline-offset-4 hover:decoration-seal">
                      {p}
                    </a>
                  ))}
                </dd>
              </div>
            </div>
            <div className="flex gap-4 py-4">
              <Mail className="mt-0.5 size-4 shrink-0 text-seal" aria-hidden="true" />
              <div>
                <dt className="label">Email</dt>
                <dd className="mt-1 text-[15px]">
                  <a
                    href={`mailto:${school.email}`}
                    className="underline decoration-rule underline-offset-4 hover:decoration-seal"
                  >
                    {school.email}
                  </a>
                </dd>
              </div>
            </div>
          </dl>
          <Panel className="mt-6">
            <h2 className="font-display text-lg">Office hours</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">{school.officeHours}</p>
            <div className="mt-3">
              <DemoTag>Timings to be confirmed</DemoTag>
            </div>
          </Panel>
        </section>

        <section>
          <SectionHeading title="Send an enquiry" aside="Goes to the office" />
          {sent ? (
            <Panel>
              <p className="font-display text-lg">Your message has reached the office</p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                It is now listed in the administrator portal. The office will respond using the contact details you gave.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 min-h-11 rounded-sm px-4 font-mono text-[11px] uppercase tracking-[0.14em] ring-1 ring-rule hover:bg-surface"
              >
                Write another
              </button>
            </Panel>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                const contact = String(fd.get("contact") ?? "").trim();
                setBusy(true);
                try {
                  await sendMessage({
                    data: {
                      name: String(fd.get("name") ?? "").trim(),
                      message: String(fd.get("message") ?? "").trim(),
                      subject: String(fd.get("subject") ?? "").trim(),
                      ...(contact.includes("@") ? { email: contact } : { phone: contact }),
                    },
                  });
                  form.reset();
                  setSent(true);
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Could not send the message");
                } finally {
                  setBusy(false);
                }
              }}
              className="space-y-4 rounded-md bg-surface p-5 ring-1 ring-rule"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="label">Name</span>
                  <input required name="name" className={field} autoComplete="name" />
                </label>
                <label className="block text-sm">
                  <span className="label">Phone or email</span>
                  <input required name="contact" className={field} autoComplete="tel" />
                </label>
              </div>
              <label className="block text-sm">
                <span className="label">Subject</span>
                <select name="subject" className={field} defaultValue="Admission enquiry">
                  <option>Admission enquiry</option>
                  <option>Fee and documents</option>
                  <option>Transport</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="label">Message</span>
                <textarea required name="message" rows={5} className={field} />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="min-h-11 w-full rounded-sm bg-foreground px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-background transition-colors hover:bg-stamp disabled:opacity-60"
              >
                {busy ? "Sending…" : "Submit enquiry"}
              </button>
              <p className="font-mono text-[11px] text-muted-foreground">
                The school office receives this message in the administrator portal.
              </p>
            </form>

          )}
        </section>
      </div>
    </PublicLayout>
  );
}
