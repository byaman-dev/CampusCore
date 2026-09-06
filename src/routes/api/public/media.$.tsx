import { createFileRoute } from "@tanstack/react-router";

/**
 * Public delivery for administrator-uploaded files.
 *
 * The storage buckets are private, so the website streams files through this
 * route instead of a direct storage URL. Only the media bucket and documents
 * that the administrator marked public are served.
 */
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = (params as Record<string, string>)["_splat"] ?? "";
        const [bucket, ...rest] = splat.split("/");
        const path = rest.join("/");
        if (!bucket || !path || (bucket !== "media" && bucket !== "documents")) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (bucket === "documents") {
          const { data } = await supabaseAdmin
            .from("documents")
            .select("id")
            .eq("file_path", path)
            .eq("is_public", true)
            .eq("archived", false)
            .maybeSingle();
          if (!data) return new Response("Not found", { status: 404 });
        }

        const file = await supabaseAdmin.storage.from(bucket).download(path);
        if (file.error || !file.data) return new Response("Not found", { status: 404 });

        const buffer = await file.data.arrayBuffer();
        return new Response(buffer, {
          headers: {
            "Content-Type": file.data.type || "application/octet-stream",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
