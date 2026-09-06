import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Lock, LogOut, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { roleLabels, type Role } from "@/data/portal";
import { homeFor, portalRoles, useProfile, useRoles, useSession, type PortalRole } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PasswordChangePrompt } from "./PasswordChangePrompt";

const roleNav: Record<Role, { label: string; to: string }[]> = {
  student: [
    { label: "Dashboard", to: "/portal/student" },
    { label: "Notices", to: "/notices" },
    { label: "Resources", to: "/resources" },
  ],
  teacher: [
    { label: "Dashboard", to: "/portal/teacher" },
    { label: "Notices", to: "/notices" },
    { label: "Academics", to: "/academics" },
  ],
  admin: [
    { label: "Overview", to: "/portal/admin" },
    { label: "Public website", to: "/" },
  ],
  parent: [
    { label: "Dashboard", to: "/portal/parent" },
    { label: "Notices", to: "/notices" },
    { label: "Resources", to: "/resources" },
  ],
};

export function PortalLayout({
  role,
  title,
  subtitle,
  children,
}: {
  role: PortalRole;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { roles, loading } = useRoles(user);
  const { data: profile } = useProfile(user);

  const isAdmin = roles.includes("admin");
  const allowed = roles.includes(role) || isAdmin;
  const displayName = profile?.full_name?.trim() || user?.email || "Signed in";

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/portal/login", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-foreground text-background">
      <header className="border-b border-background/10 bg-black/20">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-5 py-3 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-sm bg-background/10 font-display text-[11px] font-semibold text-background ring-1 ring-background/20"
            >
              MVV
            </span>
            <span className="font-mono text-xs text-background/70">School portal</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-background/70">
            <ShieldCheck className="size-3" aria-hidden="true" />
            {roleLabels[role]}
          </span>
          {allowed ? (
            <nav aria-label="Portal" className="hidden items-center gap-4 text-sm text-background/60 md:flex">
              {roleNav[role].map((l) => (
                <Link key={l.label} to={l.to} className="transition-colors hover:text-background">
                  {l.label}
                </Link>
              ))}
            </nav>
          ) : null}
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-mono text-[11px] text-background/60 sm:inline">{displayName}</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm px-3 font-mono text-[11px] uppercase tracking-[0.15em] ring-1 ring-background/25 transition-colors hover:bg-background/10"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-8 sm:px-8">
        {loading ? (
          <p className="py-20 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-background/50">
            Checking access…
          </p>
        ) : profile?.must_change_password ? (
          <PasswordChangePrompt />
        ) : !allowed ? (
          <NoAccess roles={roles} requested={role} />
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-background/10 pb-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-background/50">
                  {roleLabels[role]} workspace
                </p>
                <h1 className="mt-2 font-display text-3xl tracking-tight text-background sm:text-4xl">{title}</h1>
                <p className="mt-2 max-w-[60ch] text-sm text-background/60">{subtitle}</p>
              </div>
              {isAdmin ? (
                <nav aria-label="Portal workspaces" className="flex flex-wrap gap-2">
                  {portalRoles.map((r) => (
                    <Link
                      key={r}
                      to={homeFor[r]}
                      className={`min-h-11 rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                        r === role
                          ? "bg-background text-foreground"
                          : "text-background/60 ring-1 ring-background/20 hover:bg-background/10"
                      }`}
                    >
                      {roleLabels[r]}
                    </Link>
                  ))}
                </nav>
              ) : null}
            </div>

            <div className="pt-6">{children}</div>
          </>
        )}

        <p className="mt-10 rounded-md border border-dashed border-background/20 px-4 py-3 font-mono text-[11px] text-background/50">
          Student information shown here never appears on the public website. Sections still marked as demo await the
          school's own records.
        </p>
      </main>
    </div>
  );
}

function NoAccess({ roles, requested }: { roles: PortalRole[]; requested: PortalRole }) {
  const mine = roles[0];
  return (
    <div className="mx-auto max-w-xl rounded-md border border-dashed border-background/25 px-6 py-12 text-center">
      <Lock className="mx-auto size-6 text-background/50" aria-hidden="true" />
      <h1 className="mt-4 font-display text-2xl text-background">
        {roles.length === 0 ? "No workspace assigned" : "This workspace isn't yours"}
      </h1>
      <p className="mx-auto mt-3 max-w-[46ch] text-sm text-background/60">
        {roles.length === 0
          ? "This account has no role assigned. Please contact the school office so an administrator can complete the setup."
          : `Your account has ${roleLabels[mine!]} access, so the ${roleLabels[requested]} workspace stays closed.`}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {mine ? (
          <Link
            to={homeFor[mine]}
            className="min-h-11 rounded-sm bg-background px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground"
          >
            Go to my workspace
          </Link>
        ) : null}
        <Link
          to="/"
          className="min-h-11 rounded-sm px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] ring-1 ring-background/25"
        >
          Public website
        </Link>
      </div>
    </div>
  );
}

export function Widget({
  label,
  action,
  children,
  className = "",
}: {
  label: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-md bg-background/[0.04] p-4 ring-1 ring-background/10 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.15em] text-background/50">{label}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
