# deep-podder-portfolio

Personal portfolio for **Deep Podder** — backend / AI engineer.

A single, statically rendered page. No database, no authentication, no writable
storage, no environment variables. The deployed container holds nothing worth
losing, which is why `min-instances=0` is safe.

## Architecture

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript strict |
| Styling | Hand-written CSS with design tokens (`app/globals.css`), no UI framework |
| Content | `content/site.json`, typed by `lib/content.ts`, read at build time |
| Theme | Dark and light, dark-first, `data-theme` on `<html>`, set before paint |
| Images | Committed under `public/uploads/`, dark and light variant per project |
| Runtime deps | `next`, `react`, `react-dom`, `zod` — nothing else |
| Hosting | GitHub Pages, static export, deployed by GitHub Actions |

The page prerenders to static HTML at build time (`○ /` in the build output), so
a request never touches a database.

## Content workflow

Content is data, not a database.

```bash
npm install
npm run studio     # http://localhost:3000/admin — editor, development only
npm run publish    # builds, then commits content + any new images
```

- The editor writes `content/site.json` and puts uploaded images in
  `public/uploads/`.
- `/admin` and `/api/upload` return **404 in a production build**; the editor
  cannot be reached on a deployed instance.
- `content/site.json` is plain JSON and can be edited by hand. The build
  type-checks it, so a broken file fails the build instead of the site.
- `published: false` on a project hides it from the page without deleting it.

### Project images

Each project carries two screenshots so the page matches whichever theme the
visitor is using:

```json
{
  "coverImage": "/uploads/career-sync-dark.png",
  "coverImageLight": "/uploads/career-sync-light.png"
}
```

They swap with CSS (`[data-theme="light"] .proj__shot`), not JavaScript, so only
the active theme's image is ever downloaded and there is no flash on toggle. If
`coverImageLight` is empty, the dark image is used for both.

## Security posture

- No secrets in the repository and none required at runtime; `.env*` is ignored.
- No server-side input surface in production: no forms, no auth, no upload
  endpoint. The only route is `/api/health`, which returns `{"ok":true}`.
- Security headers are set for every response in `next.config.mjs`: CSP (self
  only, no third-party origins), `nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`,
  `Cross-Origin-Opener-Policy`, and HSTS.
- The container runs as an unprivileged user (`nextjs`, uid 1001) on
  `node:22-alpine` and writes nothing to disk.
- `npm audit --omit=dev` reports 0 vulnerabilities.

Known trade-off: the CSP allows `'unsafe-inline'` for scripts because of the
single inline theme bootstrap that runs before paint. Nothing else is inline and
no external origin is permitted.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
```

## Deploy

Pushing to `main` triggers `.github/workflows/pages.yml`, which runs
`next build` with `PAGES_BUILD=1` (static export), deletes the dev-only routes
from the runner checkout, and publishes `out/` to GitHub Pages.

```bash
npm run publish     # commits content changes and pushes; CI deploys
```

Live at **https://unknown-spec10.github.io**.

Two behaviours worth knowing:

- GitHub Pages cannot send custom headers, so the CSP/HSTS set in
  `next.config.mjs` applies only where those headers are supported. On Pages the
  build warns that custom routes are ignored.
- Branch deployments need a `.nojekyll` file at the published root, otherwise
  Jekyll drops the `_next` folder and every stylesheet and script 404s. The
  workflow uploads the artifact (no Jekyll), and `npm run publish` writes one
  into `out/` anyway.

## Repository layout

```
app/
  page.tsx            the whole site, rendered from content
  components/         client-only behaviour: theme toggle, reveal, clock
  admin/              development-only editor (404 in production)
  api/health/         liveness probe
  api/upload/         development-only image upload (404 in production)
content/site.json     all copy, projects and capability groups
lib/content.ts        content types + typed export
lib/content-server.ts read/write helpers for the editor
public/               fonts, favicon, resume PDF, project images
Dockerfile            multi-stage build, standalone output
```
