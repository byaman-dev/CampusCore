import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Widget } from "@/components/portal/PortalLayout";
import { adminList, adminSave } from "@/lib/admin-cms.functions";
import type { Json } from "@/integrations/supabase/types";
import { MediaField } from "./MediaField";

const field =
  "mt-1 w-full rounded-sm border border-background/20 bg-background/[0.06] px-3 py-2.5 text-sm text-background outline-none transition focus:border-background/50";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-background/50";

type SettingsForm = {
  school_name: string;
  short_name: string;
  tagline: string;
  address: string;
  phones: string;
  email: string;
  office_hours: string;
  map_url: string;
  logo_url: string;
  academic_session: string;
  footer_text: string;
  seo_title: string;
  seo_description: string;
  seo_image_url: string;
};

const blank: SettingsForm = {
  school_name: "",
  short_name: "",
  tagline: "",
  address: "",
  phones: "",
  email: "",
  office_hours: "",
  map_url: "",
  logo_url: "",
  academic_session: "",
  footer_text: "",
  seo_title: "",
  seo_description: "",
  seo_image_url: "",
};

/** Edits the single site_settings row (id = "default"). */
export function SiteSettingsForm() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(adminList);
  const saveFn = useServerFn(adminSave);
  const [form, setForm] = useState<SettingsForm>(blank);
  const [hydrated, setHydrated] = useState(false);

  const query = useQuery({
    queryKey: ["cms-records", "site_settings"],
    queryFn: () => listFn({ data: { table: "site_settings" } }),
  });

  useEffect(() => {
    if (hydrated) return;
    const row = query.data?.[0];
    if (!row) return;
    setForm({
      school_name: String(row["school_name"] ?? ""),
      short_name: String(row["short_name"] ?? ""),
      tagline: String(row["tagline"] ?? ""),
      address: String(row["address"] ?? ""),
      phones: Array.isArray(row["phones"]) ? (row["phones"] as string[]).join(", ") : "",
      email: String(row["email"] ?? ""),
      office_hours: String(row["office_hours"] ?? ""),
      map_url: String(row["map_url"] ?? ""),
      logo_url: String(row["logo_url"] ?? ""),
      academic_session: String(row["academic_session"] ?? ""),
      footer_text: String(row["footer_text"] ?? ""),
      seo_title: String(row["seo_title"] ?? ""),
      seo_description: String(row["seo_description"] ?? ""),
      seo_image_url: String(row["seo_image_url"] ?? ""),
    });
    setHydrated(true);
  }, [query.data, hydrated]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const values: Record<string, Json> = {
        school_name: form.school_name,
        short_name: form.short_name,
        tagline: form.tagline,
        address: form.address,
        phones: form.phones
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        email: form.email,
        office_hours: form.office_hours,
        map_url: form.map_url,
        logo_url: form.logo_url,
        academic_session: form.academic_session,
        footer_text: form.footer_text,
        seo_title: form.seo_title,
        seo_description: form.seo_description,
        seo_image_url: form.seo_image_url,
      };
      return saveFn({ data: { table: "site_settings", id: "default", values } });
    },
    onSuccess: () => {
      toast.success("Site settings saved");
      void queryClient.invalidateQueries({ queryKey: ["cms-records", "site_settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = (key: keyof SettingsForm) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  if (query.isLoading) {
    return <p className="py-6 text-center font-mono text-[11px] text-background/50">Loading site settings…</p>;
  }

  return (
    <Widget label="Site settings" className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <div>
          <label className={label} htmlFor="ss-name">
            School name
          </label>
          <input id="ss-name" required className={field} value={form.school_name} onChange={(e) => set("school_name")(e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="ss-short">
            Short name
          </label>
          <input id="ss-short" className={field} value={form.short_name} onChange={(e) => set("short_name")(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="ss-tagline">
            Tagline
          </label>
          <input id="ss-tagline" className={field} value={form.tagline} onChange={(e) => set("tagline")(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="ss-address">
            Address
          </label>
          <textarea id="ss-address" rows={2} className={field} value={form.address} onChange={(e) => set("address")(e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="ss-phones">
            Phone numbers (comma separated)
          </label>
          <input id="ss-phones" className={field} value={form.phones} onChange={(e) => set("phones")(e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="ss-email">
            Email
          </label>
          <input id="ss-email" type="email" className={field} value={form.email} onChange={(e) => set("email")(e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="ss-hours">
            Office hours
          </label>
          <input id="ss-hours" className={field} value={form.office_hours} onChange={(e) => set("office_hours")(e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="ss-map">
            Map URL
          </label>
          <input id="ss-map" className={field} value={form.map_url} onChange={(e) => set("map_url")(e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor="ss-session">
            Academic session
          </label>
          <input
            id="ss-session"
            className={field}
            value={form.academic_session}
            onChange={(e) => set("academic_session")(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <span className={label}>Logo</span>
          <MediaField id="ss-logo" value={form.logo_url} onChange={set("logo_url")} kind="image" />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="ss-footer">
            Footer text
          </label>
          <textarea id="ss-footer" rows={2} className={field} value={form.footer_text} onChange={(e) => set("footer_text")(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="ss-seo-title">
            SEO title
          </label>
          <input id="ss-seo-title" className={field} value={form.seo_title} onChange={(e) => set("seo_title")(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="ss-seo-desc">
            SEO description
          </label>
          <textarea
            id="ss-seo-desc"
            rows={2}
            className={field}
            value={form.seo_description}
            onChange={(e) => set("seo_description")(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <span className={label}>SEO share image</span>
          <MediaField id="ss-seo-image" value={form.seo_image_url} onChange={set("seo_image_url")} kind="image" />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="min-h-11 rounded-sm bg-background px-5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground disabled:opacity-60"
          >
            {saveMutation.isPending ? "Saving…" : "Save site settings"}
          </button>
        </div>
      </form>
    </Widget>
  );
}
