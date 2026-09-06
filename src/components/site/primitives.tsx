import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DemoTag({ children = "Demo content" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-seal/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-seal ring-1 ring-seal/20">
      {children}
    </span>
  );
}

export function VerifiedTag() {
  return (
    <span className="inline-flex items-center rounded-full bg-pine/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-pine ring-1 ring-pine/20">
      From school records
    </span>
  );
}

export function SectionHeading({
  title,
  aside,
  as: As = "h2",
}: {
  title: string;
  aside?: ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4 rule-heading">
      <As className="font-display text-2xl tracking-tight">{title}</As>
      {aside ? <span className="label shrink-0">{aside}</span> : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="animate-rise border-b border-rule py-10 lg:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-seal">{eyebrow}</p>
      <h1 className="mt-4 max-w-[24ch] text-balance font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
        {title}
      </h1>
      {lead ? <p className="mt-5 max-w-[62ch] text-pretty text-base text-muted-foreground sm:text-lg">{lead}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="max-w-[68ch] space-y-4 text-[15px] leading-relaxed text-muted-foreground">
      {paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

export function IndexList({
  items,
}: {
  items: { to: string; params?: Record<string, string>; label: string; note?: string; index?: string }[];
}) {
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            to={item.to}
            {...(item.params ? { params: item.params } : {})}
            className="group -mx-2 flex min-h-11 items-center gap-4 rounded-sm px-2 py-4 transition-colors hover:bg-surface"
          >
            {item.index ? <span className="font-mono text-[11px] text-seal">{item.index}</span> : null}
            <span className="min-w-0">
              <span className="block text-[15px] font-medium group-hover:underline">{item.label}</span>
              {item.note ? <span className="mt-0.5 block text-[13px] text-muted-foreground">{item.note}</span> : null}
            </span>
            <span aria-hidden="true" className="ml-auto font-mono text-xs text-muted-foreground transition-colors group-hover:text-seal">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function StatBlock({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="grid grid-cols-3 gap-4">
      {items.map((s) => (
        <div key={s.label}>
          <dd className="font-display text-2xl">{s.value}</dd>
          <dt className="label mt-0.5">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-md bg-surface p-5 ring-1 ring-rule", className)}>{children}</div>;
}

export function DataTable({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: (string | ReactNode)[][];
  caption?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        {caption ? <caption className="label pb-3 text-left">{caption}</caption> : null}
        <thead>
          <tr className="border-b-2 border-foreground">
            {head.map((h) => (
              <th key={h} scope="col" className="label py-2 pr-4 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          {rows.map((row, i) => (
            <tr key={i} className="transition-colors hover:bg-surface">
              {row.map((cell, j) => (
                <td key={j} className="py-3 pr-4 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-md border border-dashed border-rule px-5 py-10 text-center">
      <p className="font-display text-lg">{title}</p>
      <p className="mx-auto mt-2 max-w-[42ch] text-[13px] text-muted-foreground">{note}</p>
    </div>
  );
}
