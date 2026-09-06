import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Widget } from "@/components/portal/PortalLayout";
import { adminDelete, adminList, adminSave } from "@/lib/admin-cms.functions";
import type { Json } from "@/integrations/supabase/types";
import type { CmsConfig, FieldConfig } from "./cms-config";
import { MediaField } from "./MediaField";

const field =
  "mt-1 w-full rounded-sm border border-background/20 bg-background/[0.06] px-3 py-2.5 text-sm text-background outline-none transition focus:border-background/50";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-background/50";
const chip =
  "min-h-9 rounded-sm px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors disabled:opacity-50";

type Row = Record<string, Json>;

function blankValues(fields: FieldConfig[]): Record<string, Json> {
  const values: Record<string, Json> = {};
  for (const f of fields) {
    if (f.type === "boolean") values[f.name] = false;
    else if (f.type === "number") values[f.name] = 0;
    else if (f.type === "tags") values[f.name] = [];
    else values[f.name] = "";
  }
  return values;
}

function toFormValue(f: FieldConfig, row: Row): string {
  const v = row[f.name];
  if (f.type === "tags") return Array.isArray(v) ? v.join(", ") : "";
  if (v === null || v === undefined) return "";
  return String(v);
}

function displayValue(row: Row, column: string): string {
  const v = row[column];
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

/** Generic list + create/edit/delete console for one CMS-config-driven table. */
export function RecordManager({ config }: { config: CmsConfig }) {
  const queryClient = useQueryClient();
  const listFn = useServerFn(adminList);
  const saveFn = useServerFn(adminSave);
  const deleteFn = useServerFn(adminDelete);

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [creating, setCreating] = useState(false);
  const [values, setValues] = useState<Record<string, Json>>(() => blankValues(config.fields));

  const queryKey = ["cms-records", config.table];

  const query = useQuery({
    queryKey,
    queryFn: () =>
      listFn({ data: { table: config.table, orderBy: config.defaultSort, ascending: config.ascending ?? true } }),
  });

  const rows = (query.data ?? []) as Row[];

  const refresh = () => void queryClient.invalidateQueries({ queryKey });

  const saveMutation = useMutation({
    mutationFn: (vars: { id?: string | number; values: Record<string, Json> }) =>
      saveFn({ data: { table: config.table, ...(vars.id !== undefined ? { id: vars.id } : {}), values: vars.values } }),
    onSuccess: () => {
      toast.success(editingId ? "Record updated" : "Record created");
      setCreating(false);
      setEditingId(null);
      setValues(blankValues(config.fields));
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteFn({ data: { table: config.table, id } }),
    onSuccess: () => {
      toast.success("Record deleted");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function startEdit(row: Row) {
    const next: Record<string, Json> = {};
    for (const f of config.fields) next[f.name] = (row[f.name] ?? (f.type === "tags" ? [] : "")) as Json;
    setValues(next);
    setEditingId(row["id"] as string | number);
    setCreating(false);
  }

  function startCreate() {
    setValues(blankValues(config.fields));
    setEditingId(null);
    setCreating(true);
  }

  function cancelForm() {
    setEditingId(null);
    setCreating(false);
    setValues(blankValues(config.fields));
  }

  function set(name: string, value: Json) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveMutation.mutate({ ...(editingId !== null ? { id: editingId } : {}), values });
  }

  function handleDelete(row: Row) {
    const id = row["id"] as string | number;
    const title = String(row["title"] ?? row["name"] ?? row["label"] ?? id);
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  }

  const showForm = creating || editingId !== null;

  return (
    <div className="space-y-4">
      <Widget
        label={config.label}
        action={
          !showForm ? (
            <button
              type="button"
              onClick={startCreate}
              className="min-h-9 rounded-sm bg-background px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground"
            >
              Add new
            </button>
          ) : undefined
        }
      >
        {config.description ? <p className="mb-3 text-sm text-background/60">{config.description}</p> : null}

        {showForm ? (
          <form onSubmit={handleSubmit} className="mb-4 grid gap-3 rounded-sm bg-background/[0.05] p-3 sm:grid-cols-2">
            {config.fields.map((f) => {
              const inputId = `${config.table}-${f.name}`;
              return (
                <div key={f.name} className={f.type === "textarea" || f.type === "image" || f.type === "file" ? "sm:col-span-2" : ""}>
                  <label className={label} htmlFor={inputId}>
                    {f.label}
                    {f.required ? " *" : ""}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      id={inputId}
                      required={f.required}
                      rows={3}
                      value={String(values[f.name] ?? "")}
                      onChange={(e) => set(f.name, e.target.value)}
                      className={field}
                    />
                  ) : f.type === "boolean" ? (
                    <div className="mt-1">
                      <label className="inline-flex min-h-11 items-center gap-2 text-sm text-background/80">
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={Boolean(values[f.name])}
                          onChange={(e) => set(f.name, e.target.checked)}
                          className="h-5 w-5 rounded-sm border-background/30"
                        />
                        Yes
                      </label>
                    </div>
                  ) : f.type === "select" ? (
                    <select
                      id={inputId}
                      required={f.required}
                      value={String(values[f.name] ?? "")}
                      onChange={(e) => set(f.name, e.target.value)}
                      className={field}
                    >
                      <option value="" className="text-foreground">
                        Select…
                      </option>
                      {(f.options ?? []).map((o) => (
                        <option key={o} value={o} className="text-foreground">
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "number" ? (
                    <input
                      id={inputId}
                      type="number"
                      required={f.required}
                      value={String(values[f.name] ?? "")}
                      onChange={(e) => set(f.name, e.target.value === "" ? "" : Number(e.target.value))}
                      className={field}
                    />
                  ) : f.type === "date" ? (
                    <input
                      id={inputId}
                      type="date"
                      required={f.required}
                      value={String(values[f.name] ?? "")}
                      onChange={(e) => set(f.name, e.target.value)}
                      className={field}
                    />
                  ) : f.type === "tags" ? (
                    <input
                      id={inputId}
                      value={toFormValue(f, values as Row)}
                      onChange={(e) =>
                        set(
                          f.name,
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                      placeholder="Comma separated"
                      className={field}
                    />
                  ) : f.type === "image" || f.type === "file" ? (
                    <MediaField
                      id={inputId}
                      value={String(values[f.name] ?? "")}
                      onChange={(url) => set(f.name, url)}
                      kind={f.type}
                      bucket={f.type === "file" ? "documents" : "media"}
                    />
                  ) : (
                    <input
                      id={inputId}
                      required={f.required}
                      value={String(values[f.name] ?? "")}
                      onChange={(e) => set(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      className={field}
                    />
                  )}
                </div>
              );
            })}
            <div className="flex gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="min-h-11 rounded-sm bg-background px-5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground disabled:opacity-60"
              >
                {saveMutation.isPending ? "Saving…" : editingId ? "Save changes" : "Create record"}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="min-h-11 rounded-sm px-4 font-mono text-[11px] uppercase tracking-[0.15em] text-background/60 ring-1 ring-background/20"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {query.isLoading ? (
          <p className="py-6 text-center font-mono text-[11px] text-background/50">Loading records…</p>
        ) : rows.length === 0 ? (
          <p className="py-6 text-center font-mono text-[11px] text-background/50">
            No records yet. Use "Add new" to create the first one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <ul className="divide-y divide-background/10">
              {rows.map((row) => (
                <li key={String(row["id"])} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-background">
                      {config.listColumns.map((col, i) => (
                        <span key={col} className={i === 0 ? "truncate" : "font-mono text-[11px] text-background/50"}>
                          {displayValue(row, col)}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      className={`${chip} text-background/60 ring-1 ring-background/20 hover:bg-background/10`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      disabled={deleteMutation.isPending}
                      className={`${chip} text-background/60 ring-1 ring-background/20 hover:bg-background/10`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Widget>
    </div>
  );
}
