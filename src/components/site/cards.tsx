import { FileText, Paperclip } from "lucide-react";
import type { Notice, Resource, SchoolEvent } from "@/data/school";
import { DemoTag, VerifiedTag } from "./primitives";

export function NoticeList({ items }: { items: Notice[] }) {
  return (
    <ul className="divide-y divide-rule">
      {items.map((n) => (
        <li key={n.id} className="-mx-2 rounded-sm px-2 py-3 transition-colors hover:bg-surface">
          <div className="flex justify-between gap-3">
            <p className="text-sm font-medium">{n.title}</p>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{n.dateLabel}</span>
          </div>
          <p className="mt-1 text-[13px] text-muted-foreground">{n.summary}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="label">{n.category}</span>
            {n.verified ? <VerifiedTag /> : <DemoTag />}
            {n.file ? (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <Paperclip className="size-3" aria-hidden="true" />
                {n.file}
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function EventList({ items }: { items: SchoolEvent[] }) {
  return (
    <ul className="divide-y divide-rule">
      {items.map((e) => (
        <li key={e.id} className="-mx-2 flex items-center gap-4 rounded-sm px-2 py-3 transition-colors hover:bg-surface">
          <div className="w-12 shrink-0 rounded-sm py-1 text-center ring-1 ring-rule">
            <p className="font-display text-lg leading-none">{e.day}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{e.month}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">{e.title}</p>
            <p className="text-[13px] text-muted-foreground">
              {e.where} · {e.time} · {e.category}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ResourceCard({ item }: { item: Resource }) {
  return (
    <article className="flex h-full flex-col rounded-md bg-surface p-4 ring-1 ring-rule transition hover:ring-stamp/40">
      <div className="flex items-center gap-2">
        <FileText className="size-4 text-stamp" aria-hidden="true" />
        <span className="label">{item.kind}</span>
        <span className="label ml-auto">{item.group}</span>
      </div>
      <h3 className="mt-3 font-display text-lg leading-snug">{item.title}</h3>
      <p className="mt-1 flex-1 text-[13px] text-muted-foreground">{item.note}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        {item.verified ? <VerifiedTag /> : <DemoTag />}
        <span className="font-mono text-[11px] text-muted-foreground">Awaiting file upload</span>
      </div>
    </article>
  );
}
