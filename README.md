# deep-podder-portfolio

Personal portfolio for Deep Podder — backend / AI engineer. One static page, no database, no server state.

## Stack

- Next.js 15 (App Router) + TypeScript, no UI framework
- Plain CSS with design tokens (`app/globals.css`), self-hosted fonts
- Content as data: `content/site.json`, typed by `lib/content.ts`

## Editing content

```bash
npm install
npm run studio     # http://localhost:3000/admin — editor, dev only
npm run publish    # builds, then commits content + images
```

The admin writes `content/site.json` and puts uploaded images in `public/uploads/`. It only exists in development — every `/admin` route 404s in a production build, so a deployed container has no writable surface.

You can also edit `content/site.json` by hand; it is plain JSON and the build type-checks it.

## Themes

Both dark and light are supported. Each project carries a dark and a light screenshot; the page swaps them with CSS (`[data-theme="light"]`), so only the active theme's image is ever downloaded.

## Deploy

Stateless container, no environment variables, no database:

```bash
docker build -t portfolio .
gcloud run deploy portfolio --source . --region asia-south1
```

`min-instances=0` is fine — there is nothing to lose on a cold start.
