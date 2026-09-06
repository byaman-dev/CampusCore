import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { primaryNav, school } from "@/data/school";

function Crest({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center rounded-sm bg-stamp font-display text-[13px] font-semibold text-stamp-foreground ${className}`}
    >
      MVV
    </span>
  );
}

function AnnouncementStrip() {
  return (
    <div className="bg-stamp text-stamp-foreground">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-5 py-2 sm:px-8">
        <span className="size-2 shrink-0 rounded-full bg-seal" />
        <p className="truncate font-mono text-[11px] tracking-wide sm:text-xs">
          Admission notification 2025-26 is on the notice board · new website preview
        </p>
        <span className="label ml-auto hidden shrink-0 text-stamp-foreground/70 sm:inline">Announcement</span>
      </div>
    </div>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>
      <AnnouncementStrip />

      <header className="sticky top-0 z-40 border-b border-rule bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="flex h-16 items-center gap-3">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <Crest className="size-10 animate-stamp ring-1 ring-stamp/40 ring-offset-2 ring-offset-background" />
              <span className="min-w-0 leading-tight">
                <span className="block truncate font-display text-[15px] font-semibold tracking-tight">{school.name}</span>
                <span className="label block">Morak · Rajasthan</span>
              </span>
            </Link>

            <nav aria-label="Primary" className="ml-auto hidden items-center gap-5 text-sm text-muted-foreground xl:flex">
              {primaryNav.slice(1, 8).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeProps={{ className: "text-foreground" }}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 xl:ml-4">
              <Link
                to="/portal"
                className="hidden rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] ring-1 ring-rule transition-colors hover:bg-surface sm:inline-flex"
              >
                Portal
              </Link>
              <Link
                to="/admissions"
                className="rounded-sm bg-seal px-4 py-2 text-sm font-medium text-seal-foreground transition hover:brightness-110"
              >
                Admissions
              </Link>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open navigation menu"
                className="grid size-11 place-items-center rounded-sm ring-1 ring-rule transition-colors hover:bg-surface xl:hidden"
              >
                <Menu className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <nav
            aria-label="Sections"
            className="hidden items-center gap-4 overflow-x-auto pb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground xl:flex"
          >
            {primaryNav.slice(8).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-foreground" }}
                className="whitespace-nowrap transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm animate-rise flex-col bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-rule px-5 py-4">
              <span className="font-display text-base font-semibold">Navigate</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="grid size-11 place-items-center rounded-sm ring-1 ring-rule"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-3">
              <ul>
                {primaryNav.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      activeProps={{ className: "bg-surface text-foreground" }}
                      className="flex min-h-11 items-center justify-between rounded-sm px-3 text-[15px] text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="grid grid-cols-2 gap-2 border-t border-rule p-3">
              <Link
                to="/portal"
                onClick={() => setOpen(false)}
                className="grid min-h-11 place-items-center rounded-sm font-mono text-[11px] uppercase tracking-[0.15em] ring-1 ring-rule"
              >
                Portal
              </Link>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="grid min-h-11 place-items-center rounded-sm bg-foreground font-mono text-[11px] uppercase tracking-[0.15em] text-background"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <main id="main" className="mx-auto w-full max-w-[1440px] flex-1 px-5 sm:px-8">
        {children}
      </main>

      <footer className="mt-8 bg-foreground text-background/80">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-4">
          <div>
            <Crest className="size-9 bg-background/10 ring-1 ring-background/20" />
            <p className="mt-3 font-display text-lg text-background">{school.name}</p>
            <p className="mt-1 font-mono text-[11px] text-background/50">{school.address}</p>
            <p className="mt-2 font-mono text-[11px] text-background/50">{school.foundation}</p>
          </div>
          <div>
            <p className="label mb-3 text-background/50">Explore</p>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About", to: "/about" },
                { label: "Academics", to: "/academics" },
                { label: "Campus", to: "/campus" },
                { label: "Gallery", to: "/gallery" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-background">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-3 text-background/50">Information</p>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Notices", to: "/notices" },
                { label: "Resources", to: "/resources" },
                { label: "Mandatory public disclosure", to: "/about/disclosure" },
                { label: "Contact", to: "/contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-background">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-3 text-background/50">Sign in</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/portal" className="transition-colors hover:text-background">
                  Student portal
                </Link>
              </li>
              <li>
                <Link to="/portal" className="transition-colors hover:text-background">
                  Teacher portal
                </Link>
              </li>
              <li>
                <Link to="/portal" className="transition-colors hover:text-background">
                  Administration
                </Link>
              </li>
            </ul>
            <p className="mt-4 font-mono text-[11px] text-background/50">
              {school.email}
              <br />
              {school.phones.join(" · ")}
            </p>
          </div>
        </div>
        <div className="border-t border-background/10">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-5 py-4 sm:px-8">
            <p className="font-mono text-[11px] text-background/40">© 2026 {school.name}</p>
            <p className="font-mono text-[11px] text-seal/90">Preview build · some content is demo placeholder</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
