import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ mode, command }) => {
  // Expose VITE_* variables from .env to the client bundle.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const define = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  );

  return {
    define,
    server: {
      host: "::",
      port: 8080,
    },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query"],
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        // Keep server-only modules out of the browser bundle.
        importProtection: {
          behavior: "error",
          client: { files: ["**/server/**"], specifiers: ["server-only"] },
        },
        // src/server.ts wraps the SSR handler to render a friendly error page.
        server: { entry: "server" },
      }),
      // Builds a deployable server bundle into dist/. Set NITRO_PRESET to
      // target another host, e.g. node-server, vercel, netlify.
      // See https://nitro.build/deploy
      ...(command === "build"
        ? [
            nitro({
              preset: process.env["NITRO_PRESET"] || "cloudflare_module",
              output: { dir: "dist" },
            }),
          ]
        : []),
      react(),
    ],
  };
});
