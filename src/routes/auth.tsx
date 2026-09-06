import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The portal login now lives at /portal/login. This route stays only so existing
 * links and bookmarks keep working.
 */
export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {},
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/portal/login",
      search: search.redirect ? { redirect: search.redirect } : {},
      replace: true,
    });
  },
});
