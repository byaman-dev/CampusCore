/**
 * Minimal client-side error reporting hook.
 *
 * By default it only logs to the console. Wire up your own monitoring service
 * (Sentry, Highlight, PostHog, a custom endpoint, ...) inside this function and
 * the whole app benefits — the root error boundary already calls it.
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);

  const details = {
    ...context,
    ...(typeof window !== "undefined" ? { route: window.location.pathname } : {}),
    ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
  };

  console.error(`[app] ${message}`, details);
}
