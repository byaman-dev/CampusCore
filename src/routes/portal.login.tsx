import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHeader, Panel } from "@/components/site/primitives";
import { school } from "@/data/school";
import { homeFor, useProfile, useRoles, useSession } from "@/hooks/use-auth";

export const Route = createFileRoute("/portal/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {},
  head: () => ({
    meta: [
      { title: "Portal Login — Mangalam Vidya Vihar" },
      {
        name: "description",
        content:
          "Sign in to the Mangalam Vidya Vihar school portal with the Login ID issued by the school office. Accounts are created by the administrator.",
      },
      { property: "og:title", content: "Portal Login — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Sign in with your school-issued Login ID." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

const field =
  "mt-1 w-full rounded-sm border border-rule bg-background px-3 py-2.5 text-sm outline-none transition focus:border-stamp";
const labelCls = "font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground";

/** Login IDs are turned into a stable internal address; email sign-in also works. */
function toAuthEmail(identifier: string) {
  const id = identifier.trim();
  if (id.includes("@")) return id.toLowerCase();
  return `${id.toLowerCase()}@login.mangalamvidyavihar.local`;
}

/** Only same-origin relative paths may be used as a post-login destination. */
function safePath(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value, "http://local");
    return url.pathname.startsWith("/") && !url.pathname.startsWith("//") ? url.pathname + url.search : null;
  } catch {
    return null;
  }
}

function LoginPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const { roles, loading: rolesLoading } = useRoles(user);
  const { data: profile, isLoading: profileLoading } = useProfile(user);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const next = safePath(redirect);

  useEffect(() => {
    if (!user || rolesLoading || profileLoading) return;
    if (profile && profile.active === false) {
      void supabase.auth.signOut();
      toast.error("This account has been deactivated. Please contact the school office.");
      return;
    }
    const first = roles[0];
    void navigate({ to: next ?? (first ? homeFor[first] : "/portal"), replace: true });
  }, [user, roles, rolesLoading, profile, profileLoading, next, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: toAuthEmail(identifier),
        password,
      });
      if (error) throw new Error("Login ID or password is incorrect.");
      toast.success("Signed in.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="School portal"
        title="Sign in to the portal"
        lead="Use the Login ID issued by the school office. Accounts are created by the administrator — the portal has no public registration."
      />

      <div className="grid gap-8 py-12 lg:grid-cols-[1fr_0.8fr]">
        <section>
          <form onSubmit={handleSubmit} className="max-w-md space-y-4 rounded-md bg-surface p-5 ring-1 ring-rule">
            <div>
              <label className={labelCls} htmlFor="login-id">
                Login ID
              </label>
              <input
                id="login-id"
                className={field}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
                placeholder="e.g. MVV2026001"
                spellCheck={false}
              />
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Student ID, Parent ID, Employee ID or Admin ID.
              </p>
            </div>
            <div>
              <label className={labelCls} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={field}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={busy || sessionLoading}
              className="min-h-11 w-full rounded-sm bg-foreground px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-background disabled:opacity-60"
            >
              Sign in
            </button>

            <p className="text-[13px] text-muted-foreground">
              Forgot your password? The school office can issue a new one — no password can be recovered or viewed by
              staff.
            </p>
          </form>
        </section>

        <aside className="space-y-4">
          <Panel>
            <h2 className="font-display text-lg">Forgot your password?</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Contact the school office. An administrator will issue a temporary password, which you change after
              signing in.
            </p>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">{school.email}</p>
            <Link to="/contact" className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-seal">
              Contact the office →
            </Link>
          </Panel>
          <Panel>
            <h2 className="font-display text-lg">No public sign-up</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Every student, parent, teacher and administrator account is created by the school office with its role
              already assigned. Nobody chooses their own role.
            </p>
          </Panel>
          <Panel>
            <h2 className="font-display text-lg">Public information</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Notices, events, documents and admissions details stay available without an account.
            </p>
            <Link to="/notices" className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-seal">
              View notices →
            </Link>
          </Panel>
        </aside>
      </div>
    </PublicLayout>
  );
}
