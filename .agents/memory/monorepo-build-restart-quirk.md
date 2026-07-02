---
name: api-server requires workflow restart after adding new routes
description: In this pnpm monorepo, the api-server workflow runs a build+start script (esbuild bundle), not a file watcher — new/changed backend route files won't be picked up until the workflow is restarted.
---

The `artifacts/api-server` workflow command is `pnpm run dev`, which internally does `build` (esbuild via `build.mjs`) then `start` (runs the bundled `dist/index.mjs`). It is not a watch-mode dev server.

**Why:** Adding new Express route files (e.g. new resource routers registered in `routes/index.ts`) silently 404 until the server is rebuilt and restarted, even though the source files are saved and look correct.

**How to apply:** After adding/editing backend route files in `artifacts/api-server`, explicitly restart the `artifacts/api-server: API Server` workflow before testing endpoints via curl — don't assume hot-reload picked up the change. Also, `tsc --noEmit`/`tsc -b` on this package may show unrelated pre-existing type errors (e.g. drizzle-zod/zod version mismatch in `lib/db`) that don't block the esbuild-based dev server; verify actual behavior via functional curl tests against the running server rather than trusting tsc alone.
