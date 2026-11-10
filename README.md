# বাজার দর · Bazar Dor

An educational Bangladeshi daily essentials price-tracking website. Built from the **B14-A7-Bazar Dor assignment** with Next.js App Router, TypeScript, Tailwind CSS, and Better Auth. The frontend follows the uploaded Figma layout and accompanying design measurements.

## Start quickly (Windows)

On Windows you can double-click **`START_BAZARDOR.cmd`**. Alternatively open `START_HERE_WINDOWS.md`. A **fresh** installation uses:

```powershell
powershell -ExecutionPolicy Bypass -File .\SETUP_WINDOWS.ps1
npm run dev
```

Then browse to http://localhost:3000. **No files from any earlier project are needed.**

## Features

- Two-row category navbar, Bangla date, scrolling price ticker, responsive Figma-based layout.
- Hero, top risers/fallers, searchable/sortable product cards using the official assignment API.
- Category pages with skeletons, sorting, error states, and friendly 404s.
- Protected dynamic product detail pages with price summary and market-level comparison.
- Better Auth email/password registration, login, logout, session cookies, and protected routes.
- Optional Google and GitHub social login (works after you provide provider credentials).
- User profile, name update, and toast notifications.

## Technologies

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Better Auth, SQLite for local testing, PostgreSQL for production.

## Documentation

- `START_HERE_WINDOWS.md` — first-time setup.
- `OAUTH_SETUP.md` — Google and GitHub credential setup.
- `DEPLOYMENT.md` — persistent database, Vercel, URLs, and final testing.
- `AUTH_WALKTHROUGH_BN.md` — Bengali authentication explanation for your own learning.
- `FIGMA_IMPLEMENTATION_NOTES.md` — actual extracted dimensions, palettes, and comparison limitations.
- `TEST_CHECKLIST.md` — detailed functional checklist.
- `REQUIREMENT_CROSSCHECK.md` — assignment requirements mapped to code and remaining tests.
- `design-reference/` — supplied original Figma/Penpot resources and original assignment brief.

## Important limitations

This ZIP supplies **complete source and first-time setup**, not a pre-deployed website. OAuth credentials, a managed production database, GitHub commits, and Vercel deployment are personal external actions and cannot be supplied as working shared secrets. Visual pixel parity cannot be guaranteed without rendering against the actual design at the same viewport.

Your instructor has specifically requested individually understood authentication work. Review the comments and Bengali explanation, test each flow yourself, and do not present unreviewed generated code as work you independently wrote.
