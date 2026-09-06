import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { roleLabels } from "@/data/portal";
import { portalRoles, type PortalRole } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { createAccount, resetAccountPassword, setAccountActive } from "@/lib/accounts.functions";
import { Widget } from "./PortalLayout";

type Account = {
  id: string;
  full_name: string;
  login_id: string | null;
  email: string | null;
  active: boolean;
  class_id: string | null;
  section: string | null;
  roll_number: string | null;
  student_id: string | null;
  employee_id: string | null;
  parent_id: string | null;
  admin_id: string | null;
  subjects: string[];
  roles: PortalRole[];
};

const field =
  "mt-1 w-full rounded-sm border border-background/20 bg-background/[0.06] px-3 py-2 text-sm text-background outline-none transition focus:border-background/50";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-background/50";
const chip =
  "min-h-9 rounded-sm px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors disabled:opacity-50";

const blank = {
  login_id: "",
  full_name: "",
  role: "student" as PortalRole,
  password: "",
  email: "",
  phone: "",
  student_id: "",
  class_id: "",
  section: "",
  roll_number: "",
  admission_number: "",
  employee_id: "",
  subjects: "",
  parent_id: "",
  admin_id: "",
  admin_level: "",
};

/** Administrator console for creating and managing school portal accounts. */
export function AccountManager() {
  const queryClient = useQueryClient();
  const create = useServerFn(createAccount);
  const resetPassword = useServerFn(resetAccountPassword);
  const setActive = useServerFn(setAccountActive);

  const [query, setQuery] = useState("");
  const [form, setForm] = useState(blank);
  const [children, setChildren] = useState<string[]>([]);

  const classesQuery = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("classes").select("id, name, section").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const accounts = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<Account[]> => {
      const [{ data: profiles, error: pErr }, { data: roleRows, error: rErr }] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id, full_name, login_id, email, active, class_id, section, roll_number, student_id, employee_id, parent_id, admin_id, subjects",
          )
          .order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (pErr) throw pErr;
      if (rErr) throw rErr;
      return (profiles ?? []).map((p) => ({
        ...p,
        subjects: p.subjects ?? [],
        roles: (roleRows ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as PortalRole),
      }));
    },
  });

  const list = accounts.data ?? [];
  const students = useMemo(() => list.filter((a) => a.roles.includes("student")), [list]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((a) =>
      [a.full_name, a.login_id, a.email, a.student_id, a.employee_id, a.parent_id, a.admin_id]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [list, query]);

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["accounts"] });

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        login_id: form.login_id.trim(),
        full_name: form.full_name.trim(),
        role: form.role,
        password: form.password,
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
        ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
        ...(form.role === "student"
          ? {
              student_id: form.student_id.trim() || form.login_id.trim(),
              ...(form.class_id ? { class_id: form.class_id } : {}),
              section: form.section.trim(),
              roll_number: form.roll_number.trim(),
              admission_number: form.admission_number.trim(),
            }
          : {}),
        ...(form.role === "teacher"
          ? {
              employee_id: form.employee_id.trim() || form.login_id.trim(),
              subjects: form.subjects
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            }
          : {}),
        ...(form.role === "parent"
          ? { parent_id: form.parent_id.trim() || form.login_id.trim(), child_user_ids: children }
          : {}),
        ...(form.role === "admin"
          ? { admin_id: form.admin_id.trim() || form.login_id.trim(), admin_level: form.admin_level.trim() }
          : {}),
      };
      return create({ data: payload });
    },
    onSuccess: (res) => {
      toast.success(`Account created — Login ID ${res.login_id}`);
      setForm(blank);
      setChildren([]);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activeMutation = useMutation({
    mutationFn: (vars: { user_id: string; active: boolean }) => setActive({ data: vars }),
    onSuccess: () => {
      toast.success("Account updated");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const passwordMutation = useMutation({
    mutationFn: (vars: { user_id: string; password: string }) =>
      resetPassword({ data: { ...vars, temporary: true } }),
    onSuccess: () => toast.success("Temporary password set. Share it with the account holder."),
    onError: (e: Error) => toast.error(e.message),
  });

  function handleReset(account: Account) {
    const next = window.prompt(
      `Temporary password for ${account.full_name || account.login_id} (minimum 8 characters). The existing password can never be viewed.`,
    );
    if (!next) return;
    if (next.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    passwordMutation.mutate({ user_id: account.id, password: next });
  }

  const set = (key: keyof typeof blank) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-4">
      <Widget label="Create an account">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label className={label} htmlFor="ac-role">
              Role
            </label>
            <select
              id="ac-role"
              className={field}
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as PortalRole }))}
            >
              {portalRoles.map((r) => (
                <option key={r} value={r} className="text-foreground">
                  {roleLabels[r]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="ac-login">
              Login ID
            </label>
            <input
              id="ac-login"
              className={field}
              value={form.login_id}
              onChange={(e) => set("login_id")(e.target.value)}
              required
              placeholder="MVV2026001"
              spellCheck={false}
            />
          </div>
          <div>
            <label className={label} htmlFor="ac-name">
              Full name
            </label>
            <input
              id="ac-name"
              className={field}
              value={form.full_name}
              onChange={(e) => set("full_name")(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={label} htmlFor="ac-password">
              Temporary password
            </label>
            <input
              id="ac-password"
              className={field}
              value={form.password}
              onChange={(e) => set("password")(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className={label} htmlFor="ac-email">
              Contact email (optional)
            </label>
            <input
              id="ac-email"
              type="email"
              className={field}
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
            />
          </div>
          <div>
            <label className={label} htmlFor="ac-phone">
              Phone (optional)
            </label>
            <input id="ac-phone" className={field} value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
          </div>

          {form.role === "student" ? (
            <>
              <div>
                <label className={label} htmlFor="ac-class">
                  Class
                </label>
                <select
                  id="ac-class"
                  className={field}
                  value={form.class_id}
                  onChange={(e) => set("class_id")(e.target.value)}
                >
                  <option value="" className="text-foreground">
                    Not assigned
                  </option>
                  {(classesQuery.data ?? []).map((c) => (
                    <option key={c.id} value={c.id} className="text-foreground">
                      {c.name}
                      {c.section ? ` · ${c.section}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="ac-section">
                  Section
                </label>
                <input
                  id="ac-section"
                  className={field}
                  value={form.section}
                  onChange={(e) => set("section")(e.target.value)}
                />
              </div>
              <div>
                <label className={label} htmlFor="ac-roll">
                  Roll number
                </label>
                <input
                  id="ac-roll"
                  className={field}
                  value={form.roll_number}
                  onChange={(e) => set("roll_number")(e.target.value)}
                />
              </div>
              <div>
                <label className={label} htmlFor="ac-adm">
                  Admission number
                </label>
                <input
                  id="ac-adm"
                  className={field}
                  value={form.admission_number}
                  onChange={(e) => set("admission_number")(e.target.value)}
                />
              </div>
            </>
          ) : null}

          {form.role === "teacher" ? (
            <>
              <div>
                <label className={label} htmlFor="ac-emp">
                  Employee ID
                </label>
                <input
                  id="ac-emp"
                  className={field}
                  value={form.employee_id}
                  onChange={(e) => set("employee_id")(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="ac-subjects">
                  Subjects (comma separated)
                </label>
                <input
                  id="ac-subjects"
                  className={field}
                  value={form.subjects}
                  onChange={(e) => set("subjects")(e.target.value)}
                  placeholder="Physics, Chemistry"
                />
              </div>
            </>
          ) : null}

          {form.role === "parent" ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <span className={label}>Link to children</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {students.length === 0 ? (
                  <p className="font-mono text-[11px] text-background/50">
                    Create student accounts first, then link them here.
                  </p>
                ) : (
                  students.map((s) => {
                    const picked = children.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() =>
                          setChildren((c) => (picked ? c.filter((id) => id !== s.id) : [...c, s.id]))
                        }
                        aria-pressed={picked}
                        className={`${chip} ${
                          picked
                            ? "bg-background text-foreground"
                            : "text-background/60 ring-1 ring-background/20 hover:bg-background/10"
                        }`}
                      >
                        {s.full_name || s.login_id}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : null}

          {form.role === "admin" ? (
            <div>
              <label className={label} htmlFor="ac-level">
                Admin level (optional)
              </label>
              <input
                id="ac-level"
                className={field}
                value={form.admin_level}
                onChange={(e) => set("admin_level")(e.target.value)}
                placeholder="Office / Principal"
              />
            </div>
          ) : null}

          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="min-h-11 rounded-sm bg-background px-5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground disabled:opacity-60"
            >
              {createMutation.isPending ? "Creating…" : "Create account"}
            </button>
            <p className="mt-2 font-mono text-[10px] text-background/40">
              The account is active immediately with the role assigned here. The holder is asked to change the
              temporary password after first sign-in. Passwords are stored only by the authentication service and can
              never be viewed.
            </p>
          </div>
        </form>
      </Widget>

      <Widget
        label="Accounts"
        action={
          <input
            aria-label="Search accounts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or ID"
            className="w-40 rounded-sm border border-background/20 bg-background/[0.06] px-2 py-1 font-mono text-[11px] text-background outline-none focus:border-background/50 sm:w-56"
          />
        }
      >
        {accounts.isLoading ? (
          <p className="py-6 text-center font-mono text-[11px] text-background/50">Loading accounts…</p>
        ) : filtered.length === 0 ? (
          <p className="py-6 text-center font-mono text-[11px] text-background/50">No accounts match.</p>
        ) : (
          <ul className="divide-y divide-background/10">
            {filtered.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-background">
                    {a.full_name || "Unnamed account"}
                    {!a.active ? (
                      <span className="ml-2 rounded-sm bg-background/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-background/60">
                        Deactivated
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate font-mono text-[11px] text-background/50">
                    {a.login_id ?? "no login id"}
                    {a.roles.length ? ` · ${a.roles.map((r) => roleLabels[r]).join(", ")}` : " · no role"}
                    {a.section ? ` · ${a.section}` : ""}
                    {a.roll_number ? ` · Roll ${a.roll_number}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleReset(a)}
                    disabled={passwordMutation.isPending}
                    className={`${chip} text-background/60 ring-1 ring-background/20 hover:bg-background/10`}
                  >
                    Reset password
                  </button>
                  <button
                    type="button"
                    onClick={() => activeMutation.mutate({ user_id: a.id, active: !a.active })}
                    disabled={activeMutation.isPending}
                    className={`${chip} ${
                      a.active
                        ? "text-background/60 ring-1 ring-background/20 hover:bg-background/10"
                        : "bg-background text-foreground"
                    }`}
                  >
                    {a.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 font-mono text-[10px] text-background/40">
          Roles are enforced by the database, not the browser — a signed-in account can only open the workspace granted
          here.
        </p>
      </Widget>
    </div>
  );
}
