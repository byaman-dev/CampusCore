import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/site/PublicLayout";
import { EventList, NoticeList } from "@/components/site/cards";
import { DemoTag, SectionHeading, StatBlock, VerifiedTag } from "@/components/site/primitives";
import { achievements as staticAchievements, facilities as staticFacilities, school } from "@/data/school";
import { facilityImage, galleryItems, heroImage } from "@/data/gallery";
import {
  achievementsOptions,
  contentBlocksOptions,
  eventsOptions,
  facilitiesOptions,
  galleryOptions,
  mapAchievement,
  mapEvent,
  mapFacility,
  mapGalleryPhoto,
  mapNotice,
  noticesOptions,
} from "@/lib/site-queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mangalam Vidya Vihar — School in Morak, Kota, Rajasthan" },
      {
        name: "description",
        content:
          "Official information for Mangalam Vidya Vihar, Morak, Kota — academics, admissions, campus facilities, notices, events and the school portal.",
      },
      { property: "og:title", content: "Mangalam Vidya Vihar — Morak, Kota" },
      {
        property: "og:description",
        content: "Academics, admissions, campus, notices and events for Mangalam Vidya Vihar, Morak, Kota, Rajasthan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(contentBlocksOptions("home")),
      context.queryClient.ensureQueryData(noticesOptions()),
      context.queryClient.ensureQueryData(eventsOptions()),
      context.queryClient.ensureQueryData(achievementsOptions()),
      context.queryClient.ensureQueryData(facilitiesOptions()),
      context.queryClient.ensureQueryData(galleryOptions()),
    ]);
  },
  component: Home,
});

const quickActions = [
  { index: "01", label: "Admissions", to: "/admissions" },
  { index: "02", label: "Notices", to: "/notices" },
  { index: "03", label: "Academic calendar", to: "/events" },
  { index: "04", label: "Contact", to: "/contact" },
];

function Home() {
  const blocks = useSuspenseQuery(contentBlocksOptions("home")).data;
  const noticeRows = useSuspenseQuery(noticesOptions()).data;
  const eventRows = useSuspenseQuery(eventsOptions()).data;
  const achievementRows = useSuspenseQuery(achievementsOptions()).data;
  const facilityRows = useSuspenseQuery(facilitiesOptions()).data;
  const gallery = useSuspenseQuery(galleryOptions()).data;

  const block = (key: string) => blocks.find((b) => b.key === key);
  const hero = block("home.hero");
  const about = block("home.about");
  const principal = block("home.principal");

  const notices = noticeRows.map(mapNotice);
  const events = eventRows.map(mapEvent);
  const achievements = achievementRows.length ? achievementRows.map(mapAchievement) : staticAchievements;
  const facilities = facilityRows.length ? facilityRows.map(mapFacility) : staticFacilities;
  const homePhotos = gallery.photos.filter((p) => p.show_on_home).map(mapGalleryPhoto);
  const photos = (homePhotos.length ? homePhotos : gallery.photos.map(mapGalleryPhoto)).slice(0, 4);
  const photoTiles = photos.length ? photos : galleryItems.slice(0, 4);


  return (
    <PublicLayout>
      {/* Hero */}
      <section className="grid gap-6 border-b border-rule py-10 lg:grid-cols-[1.6fr_1fr] lg:py-14">
        <div className="animate-rise">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-seal">
            {hero?.subheading || "Morak · Kota · Rajasthan"}
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            {hero?.heading || "A quiet discipline for a curious mind."}
          </h1>
          <p className="mt-5 max-w-[52ch] text-pretty text-base text-muted-foreground sm:text-lg">
            {hero?.body ||
              `${school.name} is a school run by ${school.foundation} in Morak, District Kota.`}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/admissions"
              className="rounded-sm bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-stamp"
            >
              Explore admissions
            </Link>
            <Link
              to="/about/principal"
              className="rounded-sm px-5 py-2.5 text-sm font-medium ring-1 ring-rule transition-colors hover:bg-surface"
            >
              Read the principal's message
            </Link>
          </div>
          <div className="mt-8 max-w-md">
            <StatBlock
              items={[
                { value: "NUR–XII", label: "Classes (almanac)" },
                { value: "6", label: "Labs & facilities" },
                { value: "2023-28", label: "Affiliation on file" },
              ]}
            />
          </div>
        </div>

        <div className="animate-rise [animation-delay:120ms]">
          <img
            src={hero?.image_url || heroImage.src}
            alt="School courtyard in early morning light with students walking to class"
            width={heroImage.width}
            height={heroImage.height}
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="aspect-[4/5] w-full rounded-md object-cover ring-1 ring-rule"
          />

          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            Placeholder photography — replace with school photographs
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {quickActions.map((a) => (
              <li key={a.label}>
                <Link
                  to={a.to}
                  className="group block min-h-11 rounded-sm px-3 py-3 ring-1 ring-rule transition-colors hover:bg-surface"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-seal">{a.index}</span>
                  <span className="mt-1 block text-sm font-medium group-hover:underline">{a.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Introduction + principal */}
      <section className="grid gap-8 border-b border-rule py-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <SectionHeading title={about?.heading || "About the school"} aside="Introduction" />
          <div className="max-w-[62ch] space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            {(about?.body ??
              `${school.name} serves students from Morak and the surrounding villages of District Kota.`)
              .split("\n")
              .map((p) => p.trim())
              .filter(Boolean)
              .map((p) => (
                <p key={p}>{p}</p>
              ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <VerifiedTag />
            <DemoTag>Some sections pending school confirmation</DemoTag>
          </div>
          <Link
            to="/about"
            className="mt-5 inline-flex font-mono text-[11px] uppercase tracking-[0.15em] text-stamp transition-colors hover:text-seal"
          >
            Read more about the school →
          </Link>
        </div>
        <aside className="rounded-md bg-surface p-6 ring-1 ring-rule">
          <p className="label">{principal?.heading || "Principal's message"}</p>
          <blockquote className="mt-3 font-display text-xl leading-snug">
            {principal?.body || "“Our aim is steady progress — in the classroom, on the field and in character.”"}
          </blockquote>
          <p className="mt-3 text-[13px] text-muted-foreground">
            {principal?.subheading || "Principal · To be published"}
          </p>

          <Link
            to="/about/principal"
            className="mt-4 inline-flex font-mono text-[11px] uppercase tracking-[0.15em] text-stamp transition-colors hover:text-seal"
          >
            Full message →
          </Link>
        </aside>
      </section>

      {/* Notices + events newsroom */}
      <section className="grid gap-6 border-b border-rule py-12 lg:grid-cols-2">
        <div>
          <SectionHeading title="Notices" aside="Section (a)" />
          <NoticeList items={notices.slice(0, 4)} />
          <Link
            to="/notices"
            className="mt-3 inline-flex font-mono text-[11px] uppercase tracking-[0.15em] text-stamp transition-colors hover:text-seal"
          >
            All notices →
          </Link>
        </div>
        <div>
          <SectionHeading title="Upcoming events" aside="Section (b)" />
          <EventList items={events.slice(0, 4)} />
          <Link
            to="/events"
            className="mt-3 inline-flex font-mono text-[11px] uppercase tracking-[0.15em] text-stamp transition-colors hover:text-seal"
          >
            Full calendar →
          </Link>
        </div>
      </section>

      {/* Academics highlights */}
      <section className="border-b border-rule py-12">
        <SectionHeading title="Academics" aside="Key pages" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "School hours", to: "/academics/$topic", params: { topic: "school-hours" } },
            { label: "Examination schedule", to: "/academics/$topic", params: { topic: "examination-schedule" } },
            { label: "Rules & regulations", to: "/academics/$topic", params: { topic: "rules-and-regulations" } },
            { label: "Fee structure", to: "/academics/$topic", params: { topic: "fee-structure" } },
          ].map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                params={item.params}
                className="group flex min-h-11 items-center justify-between rounded-md bg-surface px-4 py-4 ring-1 ring-rule transition hover:ring-stamp/40"
              >
                <span className="text-sm font-medium group-hover:underline">{item.label}</span>
                <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Campus */}
      <section className="border-b border-rule py-12">
        <SectionHeading title="Campus & laboratories" aside="Facilities" />
        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <ul className="flex min-w-max gap-3 sm:min-w-0 sm:flex-wrap">
            {facilities.map((f) => (
              <li key={f.slug} className="w-40 shrink-0">
                <Link
                  to="/campus/$facility"
                  params={{ facility: f.slug }}
                  className="block overflow-hidden rounded-md ring-1 ring-rule transition hover:ring-stamp/40"
                >
                  <img
                    src={facilityImage(f.slug).src}
                    alt={`${f.name} at ${school.name}`}
                    width={768}
                    height={768}
                    loading="lazy"
                    decoding="async"
                    sizes="160px"
                    className="aspect-square w-full object-cover"
                  />
                  <span className="block px-3 py-2">
                    <span className="font-mono text-[10px] text-seal">{f.index}</span>
                    <span className="block text-sm font-medium">{f.name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Portal preview */}
      <section className="border-b border-rule py-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-seal">The portal</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">A calm command surface</h2>
          </div>
          <span className="inline-flex items-center rounded-full bg-pine/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-pine ring-1 ring-pine/20">
            Authenticated · prototype
          </span>
        </div>
        <div className="overflow-hidden rounded-md bg-foreground text-background ring-1 ring-foreground/20">
          <div className="flex flex-wrap items-center gap-3 border-b border-background/10 bg-black/20 px-4 py-2.5">
            <span className="font-mono text-xs text-background/80">Student dashboard</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-background/50">Class IX · B</span>
            <span className="ml-auto font-mono text-[10px] text-background/50">Demo data</span>
          </div>
          <div className="grid divide-y divide-background/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-background/50">Today's timetable</p>
              <ul className="mt-3 space-y-2 text-sm">
                {["Mathematics 08:10", "Physics 09:00", "English 09:50", "Chemistry 10:55", "Hindi 11:45"].map((r) => (
                  <li key={r} className="flex justify-between text-background/80">
                    <span>{r.split(" ")[0]}</span>
                    <span className="font-mono text-[11px] text-background/50">{r.split(" ")[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-background/50">Attendance</p>
              <p className="mt-3 font-display text-4xl leading-none">92%</p>
              <p className="mt-2 text-xs text-background/60">Demo figure for this term</p>
              <Link
                to="/portal/teacher"
                className="mt-4 grid min-h-11 place-items-center rounded-sm bg-background font-mono text-[11px] uppercase tracking-[0.15em] text-foreground transition hover:bg-background/90"
              >
                Take attendance
              </Link>
            </div>
            <div className="p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-background/50">Homework</p>
              <div className="mt-3 rounded-sm bg-background/5 p-3 ring-1 ring-background/10">
                <p className="text-sm font-medium">Physics — Numericals set 4</p>
                <p className="mt-1 text-xs text-background/60">Chapter 5 · 8 questions</p>
              </div>
              <Link
                to="/portal"
                className="mt-3 inline-flex font-mono text-[11px] uppercase tracking-[0.15em] text-background/70 hover:text-background"
              >
                Open portal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="border-b border-rule py-12">
        <SectionHeading title="Achievements" aside="Selected" />
        <ul className="divide-y divide-rule border-y border-rule">
          {achievements.slice(0, 4).map((a) => (
            <li
              key={a.id}
              className="-mx-2 grid grid-cols-1 items-baseline gap-1 rounded-sm px-2 py-4 transition-colors hover:bg-surface sm:grid-cols-[1fr_auto] sm:gap-6"
            >
              <p className="text-base font-medium">{a.title}</p>
              <span className="font-mono text-xs text-muted-foreground">{a.year}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/achievements"
          className="mt-3 inline-flex font-mono text-[11px] uppercase tracking-[0.15em] text-stamp transition-colors hover:text-seal"
        >
          All achievements →
        </Link>
      </section>

      {/* Gallery preview */}
      <section className="border-b border-rule py-12">
        <SectionHeading title="Gallery" aside="Recent" />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {photoTiles.map((g) => (
            <li key={g.id}>
              <img
                src={g.src}
                alt={g.alt}
                width={g.width}
                height={g.height}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 50vw, 25vw"
                className="aspect-[4/5] w-full rounded-md object-cover ring-1 ring-rule"
              />
            </li>
          ))}
        </ul>
        <Link
          to="/gallery"
          className="mt-3 inline-flex font-mono text-[11px] uppercase tracking-[0.15em] text-stamp transition-colors hover:text-seal"
        >
          All photos →
        </Link>
      </section>

      {/* Admissions CTA + contact */}
      <section className="py-14">
        <div className="grid items-center gap-8 rounded-lg bg-stamp px-6 py-10 text-stamp-foreground sm:px-10 sm:py-14 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-seal">Admissions</p>
            <h2 className="mt-3 text-balance font-display text-3xl tracking-tight sm:text-4xl">
              Begin the academic year with us.
            </h2>
            <p className="mt-4 max-w-[46ch] text-pretty text-stamp-foreground/80">
              The school's admission notification is published on the notice board and in Resources. Contact the office to
              confirm the current cycle and required documents.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/admissions"
                className="rounded-sm bg-seal px-5 py-2.5 text-sm font-medium text-seal-foreground transition hover:brightness-110"
              >
                Admission information
              </Link>
              <Link
                to="/resources"
                className="rounded-sm px-5 py-2.5 text-sm font-medium ring-1 ring-stamp-foreground/30 transition hover:bg-stamp-foreground/10"
              >
                Downloads
              </Link>
            </div>
          </div>
          <address className="grid gap-3 not-italic">
            <div className="rounded-sm px-4 py-3 ring-1 ring-stamp-foreground/20">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-stamp-foreground/60">Visit</p>
              <p className="mt-1 text-sm">{school.address}</p>
            </div>
            <div className="rounded-sm px-4 py-3 ring-1 ring-stamp-foreground/20">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-stamp-foreground/60">Reach us</p>
              <p className="mt-1 text-sm">
                {school.email}
                <br />
                {school.phones.join(" · ")}
              </p>
            </div>
          </address>
        </div>
      </section>
    </PublicLayout>
  );
}
