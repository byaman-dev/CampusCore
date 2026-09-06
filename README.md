# Mangalam Vidya Vihar — School Website & Portal

An open-source school website and digital school portal built for **Mangalam Vidya Vihar, Morak,
District Kota, Rajasthan (326520)** — and reusable by any school.

It includes a public website (about, academics, admissions, campus, activities, achievements,
faculty, notices, events, gallery, resources, contact) and a role-based portal for students,
parents, teachers and administrators, plus an admin console that lets school staff manage the
whole site and its records without touching code.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, SSR + server functions)
- Vite 7 / Nitro for builds and deployment
- Tailwind CSS v4
- Supabase (Postgres, Auth, Storage, Row Level Security)

## Getting started

```sh
git clone <your-repository-url>
cd mangalam-vidya-vihar
npm install
cp .env.example .env   # fill in your Supabase project values
npm run dev
```

The app runs at http://localhost:8080.

### Environment variables

| Variable                        | Used by | Description                                  |
| ------------------------------- | ------- | -------------------------------------------- |
| `VITE_SUPABASE_URL`             | browser | Supabase project URL                         |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | browser | Supabase publishable (anon) key              |
| `SUPABASE_URL`                  | server  | Same project URL, for server-side rendering   |
| `SUPABASE_PUBLISHABLE_KEY`      | server  | Same publishable key, for server-side rendering |
| `SUPABASE_SERVICE_ROLE_KEY`     | server  | Service-role key — admin operations only, never exposed to the browser |

## Database

SQL migrations live in `supabase/migrations`. Apply them to a new project with the
[Supabase CLI](https://supabase.com/docs/guides/local-development):

```sh
supabase link --project-ref <your-project-ref>
supabase db push
```

Create the first administrator account directly in your Supabase project (Auth → Users), then
insert a matching `profiles` row and an `admin` row in `user_roles`. After that, admins create all
other accounts from the portal; public self-registration is intentionally disabled.

## Build & deploy

```sh
npm run build     # outputs a deployable bundle in dist/
npm run preview
```

The build targets a Cloudflare Workers module by default. To deploy elsewhere
set a [Nitro preset](https://nitro.build/deploy):

```sh
NITRO_PRESET=node-server npm run build
NITRO_PRESET=vercel npm run build
NITRO_PRESET=netlify npm run build
```


## Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start the dev server           |
| `npm run build`  | Production build               |
| `npm run preview`| Preview the production build   |
| `npm run lint`   | ESLint                         |
| `npm run format` | Prettier                       |

## Project structure

```
src/routes         file-based routes (public pages, portal, api endpoints)
src/components     site, portal and admin CMS components
src/lib            server functions, queries, helpers
src/integrations   Supabase clients, auth middleware, generated types
supabase           SQL migrations and config
```

## Contributing

Issues and pull requests are welcome. Please run `npm run lint` and `npm run format` before
opening a pull request.

## License

[MIT](./LICENSE)
