import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, Users } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHeader, Panel, SectionHeading } from "@/components/site/primitives";
import { homeFor, useRoles, useSession, type PortalRole } from "@/hooks/use-auth";

const workspaces: { role: PortalRole; icon: typeof Users; title: string; note: string }[] = [
  {
    role: "student",
    icon: GraduationCap,
    title: "Student & parent",
    note: "Timetable, homework, assignments, notices, class resources and results.",
  },
  {
    role: "teacher",
    icon: Users,
    title: "Teacher",
    note: "Mark attendance, post homework and assignments, upload notes, publish announcements.",
  },
  {
    role: "admin",
    icon: ShieldCheck,
    title: "Administrator",
    note: "Website content, students, teachers, classes, admissions and reports.",
  },
];

export const Route = createFileRoute("/portal/")({
  head: () => ({
    meta: [
      { title: "School Portal — Mangalam Vidya Vihar" },
      {
        name: "description",
        content:
          "The Mangalam Vidya Vihar portal has separate student, teacher and administrator workspaces. Sign in with an approved school account.",
      },
      { property: "og:title", content: "School Portal — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Student, teacher and administrator workspaces for the school." },
    ],
  }),
  component: PortalEntry,
});

function PortalEntry() {
  const { user, loading } = useSession();
  const { roles, loading: rolesLoading } = useRoles(user);

  const signedIn = Boolean(user);
  const checking = loading || (signedIn && rolesLoading);

  return (
    <PublicLayout>
      <PageHeader
        eyebrow="Portal"
        title="Digital school portal"
        lead="Three workspaces, one sign-in. Each account only opens the workspace the school office has approved for it."
      />

      <div className="grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <SectionHeading title="Workspaces" aside={signedIn ? "Your access" : "Sign-in required"} />
          <ul className="space-y-3">
            {workspaces.map(({ role, icon: Icon, title, note }) => {
              const granted = roles.includes(role);
              return (
                <li key={role}>
                  <Link
                    to={granted ? homeFor[role] : "/portal/login"}
                    className="group flex items-start gap-4 rounded-md bg-surface p-5 ring-1 ring-rule transition hover:ring-stamp/40"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-stamp text-stamp-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-lg group-hover:underline">{title}</span>
                      <span className="mt-1 block text-[13px] text-muted-foreground">{note}</span>
                      <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {checking
                          ? "Checking access…"
                          : granted
                            ? "Open workspace"
                            : signedIn
                              ? "Not assigned to your account"
                              : "Sign in to continue"}
                      </span>
                    </span>
                    <span aria-hidden="true" className="ml-auto font-mono text-xs text-muted-foreground group-hover:text-seal">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {!signedIn && !checking ? (
            <Link
              to="/auth"
              className="mt-6 inline-flex min-h-11 items-center rounded-sm bg-foreground px-5 font-mono text-[11px] uppercase tracking-[0.15em] text-background"
            >
              Sign in or register
            </Link>
          ) : null}
          {signedIn && !checking && roles.length === 0 ? (
            <p className="mt-6 rounded-md border border-dashed border-rule px-4 py-3 text-[13px] text-muted-foreground">
              Your account is registered and waiting for the school office to assign a role. No workspace opens until
              then.
            </p>
          ) : null}
        </section>

        <aside className="space-y-4">
          <Panel>
            <h2 className="font-display text-lg">Access is role-based</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Sign-in and role checks run in the school database, so a student account cannot reach teacher or office
              screens even by typing the address directly.
            </p>
          </Panel>
          <Panel>
            <h2 className="font-display text-lg">Data separation</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Anything entered in the portal stays inside the portal. Only notices, events and documents that an
              administrator explicitly publishes appear on the public website.
            </p>
          </Panel>
        </aside>
      </div>
    </PublicLayout>
  );
}
