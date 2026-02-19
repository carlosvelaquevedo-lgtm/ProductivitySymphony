# Productivity Symphony — Production Deployment Guide

## Table of Contents

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Build the Application](#2-build-the-application)
3. [Deploy to Vercel](#3-deploy-to-vercel-recommended)
4. [Deploy to GitHub Pages (CI/CD)](#4-deploy-to-github-pages-cicd)
5. [Environment Variables](#5-environment-variables)
6. [Post-Deployment Verification](#6-post-deployment-verification)
7. [Known Issues to Address Before Go-Live](#7-known-issues-to-address-before-go-live)
8. [Additional Enhancements Needed](#8-additional-enhancements-needed)

---

## 1. Pre-Deployment Checklist

Run through each item before deploying:

```bash
# 1. Ensure Node.js 20+ is installed
node --version   # should be v20.x or higher

# 2. Install all dependencies cleanly
rm -rf node_modules
npm install

# 3. Run the linter — fix any errors before building
npm run lint

# 4. Run the test suite
npm test -- --run   # exits after a single run (no watch mode)

# 5. Verify the production build succeeds
npm run build

# 6. Preview the production build locally before deploying
npm run preview
```

Open the preview URL (usually http://localhost:4173) and manually verify:
- [ ] Dashboard loads with sample data
- [ ] Projects Kanban board renders correctly
- [ ] Ideas pipeline scores and filters work
- [ ] Benefits charts display without errors
- [ ] Reports / cascade chart renders
- [ ] AI Assistant (Embracy) responds to queries
- [ ] CSV / JSON export downloads work
- [ ] Settings → Reset to Defaults functions correctly
- [ ] No console errors in the browser DevTools

---

## 2. Build the Application

```bash
npm run build
```

This outputs a fully static bundle into the `dist/` folder. The bundle is a
standard SPA — all routing is client-side, so every hosting platform must
redirect 404s back to `index.html`.

**Typical output sizes (gzipped):**

| Asset | Size |
|---|---|
| `index.html` | ~1 KB |
| `assets/index-[hash].js` | ~305 KB |
| `assets/index-[hash].css` | ~8 KB |

> Note: Code splitting is not yet implemented, so the entire JavaScript bundle
> is delivered as a single chunk. See [Enhancement #1](#1-code-splitting--lazy-loading)
> for how to reduce this.

---

## 3. Deploy to Vercel (Recommended)

Vercel is the primary deployment target. A `vercel.json` is already configured
at the project root, including the SPA rewrite rule required for client-side
routing.

### Option A — Vercel CLI (manual deployment)

```bash
# Install the Vercel CLI globally (one-time)
npm install -g vercel

# Authenticate (one-time)
vercel login

# Preview deployment (staging)
vercel

# Promote to production
vercel --prod
```

### Option B — Vercel Dashboard (Git-connected, recommended for teams)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect **Vite** as the framework
4. Confirm these settings (they are read from `vercel.json`):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Add environment variables under **Settings → Environment Variables**
   (see [Section 5](#5-environment-variables))
6. Click **Deploy**

Every push to `main` will trigger an automatic production deployment.
Every pull request gets a unique preview URL automatically.

### `vercel.json` (already present — no changes needed)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The `rewrites` rule is critical — without it, refreshing any page other than `/`
will return a 404.

---

## 4. Deploy to GitHub Pages (CI/CD)

A GitHub Actions workflow is already configured at
`.github/workflows/deploy.yml`. It triggers automatically on every push to
`main`.

### Steps to enable GitHub Pages

1. Push the repository to GitHub (if not already done)
2. In the repository, go to **Settings → Pages**
3. Under **Build and deployment**, select **Source: GitHub Actions**
4. Push a commit to `main` — the workflow will run automatically

### What the workflow does

```yaml
Trigger: push to main  OR  manual workflow_dispatch
Runner:  ubuntu-latest, Node 20
Steps:
  1. Checkout repository
  2. npm install --no-audit --prefer-offline
  3. npm run build
  4. Upload dist/ as a GitHub Pages artifact
  5. Deploy to GitHub Pages
```

The live site will be at:
```
https://<your-github-username>.github.io/<repo-name>/
```

> **Important:** If you deploy to GitHub Pages under a sub-path (e.g.
> `/repo-name/`), you must set `base` in `vite.config.js`:
>
> ```js
> export default defineConfig({
>   base: '/repo-name/',
>   plugins: [react()],
> })
> ```
>
> Without this, all asset URLs will be relative to `/` and will 404.

---

## 5. Environment Variables

Copy `.env.example` to `.env.production` and fill in the values:

```bash
cp .env.example .env.production
```

```env
# .env.production
VITE_APP_NAME=ProductivitySymphony
VITE_API_URL=https://your-api-domain.com/api   # leave empty if no backend yet
VITE_API_TIMEOUT=10000
VITE_ENABLE_AI=true
VITE_ENABLE_ANALYTICS=false
VITE_ENV=production
```

All variables must be prefixed with `VITE_` — Vite will embed them into the
bundle at build time. They are **not secret** and will be visible in the
browser.

**For Vercel:** Add variables in Dashboard → Settings → Environment Variables,
selecting the "Production" environment.

**For GitHub Pages:** Add variables as repository secrets and reference them in
the workflow:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_APP_NAME: ${{ secrets.VITE_APP_NAME }}
    VITE_ENV: production
```

---

## 6. Post-Deployment Verification

After deploying, run this checklist against the live URL:

| Check | How to verify |
|---|---|
| Site loads at root `/` | Open the URL in a browser |
| Deep links work on refresh | Navigate to `/projects`, reload the page |
| No 404 on assets | Open DevTools → Network, look for red entries |
| `localStorage` persists across sessions | Create a project, close/reopen tab |
| Charts render | Open Dashboard and Benefits views |
| CSV export downloads | Data view → Export Projects |
| No console errors | DevTools → Console |
| HTTPS is enforced | Verify the URL uses `https://` |
| Performance | Run Lighthouse in Chrome DevTools |

---

## 7. Known Issues to Address Before Go-Live

These are existing discrepancies discovered in the codebase that should be
resolved before a real production launch.

### 7a. localStorage Key Version Mismatch

The README documents `_v2` storage keys, but the source code in
`src/utils/constants.js` uses `_v3` keys:

```js
// constants.js (actual)
productivity_symphony_projects_v3
productivity_symphony_ideas_v3
```

Any user data stored under `_v2` keys (from a previous version) will be
silently ignored. A migration function should be added to
`src/utils/storage.js` to detect and migrate old keys on app start.

### 7b. No Base Path for GitHub Pages Sub-Path Deployments

If the GitHub Pages URL is `https://user.github.io/repo-name/`, assets will
404 without a matching `base` in `vite.config.js` (see
[Section 4](#4-deploy-to-github-pages-cicd)).

### 7c. Zero Test Coverage

The testing infrastructure (Vitest, Testing Library) is set up but no tests
exist. The CI/CD pipeline does not currently run tests — it goes straight to
build. Adding a `npm test -- --run` step before build is strongly recommended
to catch regressions before deployment.

### 7d. Planned Component Files Missing

`ENHANCEMENTS.md` describes a `src/components/` directory with modular
components, but those files were never created. All code remains in the
2,330-line `App.jsx`. The README's project structure is therefore inaccurate.

---

## 8. Additional Enhancements Needed

The following enhancements are recommended in priority order for a robust
production system.

---

### 1. Code Splitting & Lazy Loading

**Priority: High — affects every user's initial load**

Currently the entire application ships as a single 305 KB (gzipped) JS bundle.
Use `React.lazy` and `Suspense` to split views into separate chunks, so users
only download the code for the page they are on.

```js
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        charts: ['recharts'],
        icons: ['lucide-react'],
      },
    },
  },
},
```

Expected benefit: 30–40% reduction in initial bundle size.

---

### 2. Write Actual Tests

**Priority: High — prevents regressions in CI**

The test infrastructure exists but 0% of the codebase is covered. Start with:

1. **Utils** — `formatters.js`, `calculations.js`, `validation.js` are pure
   functions and trivial to test
2. **Storage helpers** — `storage.js` (already mocked in `src/test/setup.js`)
3. **Component smoke tests** — verify the app renders without crashing
4. **Critical flows** — create project, delete project, convert idea to project

Target: 60% coverage before v2.1 release. Add `npm test -- --run` to the
CI/CD workflow so a failing test blocks deployment.

---

### 3. Backend API + Database

**Priority: High if multi-user or cross-device access is needed**

Currently all data lives in the browser's `localStorage`, which means:
- Data is device-specific (not shared across devices or users)
- Data is lost if the user clears their browser
- No collaboration is possible

A minimal backend would include:
- REST or GraphQL API (Node.js/Express or a BaaS like Supabase)
- PostgreSQL or MongoDB for persistent storage
- Migrations for schema changes

The `VITE_API_URL` environment variable is already wired into `.env.example`
for this purpose.

---

### 4. User Authentication

**Priority: High if the backend is added**

Without auth, all users share the same data. Recommended approach:
- **Supabase Auth** or **Auth0** for managed identity (OAuth, email/password)
- JWT tokens stored in `httpOnly` cookies (not `localStorage`) to prevent XSS
- Role-based access: viewer, contributor, admin

---

### 5. Real AI Integration for Embracy

**Priority: Medium**

The current "AI" assistant is a pattern-matching function — it matches keywords
in the user's message against a set of hardcoded responses. It is not an actual
LLM.

To make Embracy genuinely useful:
- Integrate the **Anthropic Claude API** (or OpenAI) via a server-side proxy
- Send the user's query plus a JSON summary of the current portfolio data as
  context
- Stream the response back to the UI for a responsive feel
- **Never expose API keys in the frontend** — the call must go through a
  backend endpoint

---

### 6. Component Modularization

**Priority: Medium — developer experience and maintainability**

`App.jsx` is a 2,330-line file. `ENHANCEMENTS.md` already documents the target
structure. Follow through on the planned refactor:

```
src/components/
├── common/
│   ├── HealthDot.jsx
│   ├── StatusPill.jsx
│   ├── StatCard.jsx
│   ├── NavItem.jsx
│   └── Toast.jsx
└── modals/
    ├── CreateProjectModal.jsx
    ├── EditProjectModal.jsx
    ├── CreateIdeaModal.jsx
    ├── EditIdeaModal.jsx
    └── ConfirmDeleteModal.jsx
```

Each component under 300 lines becomes individually testable and reusable.

---

### 7. Performance Optimizations

**Priority: Medium**

- **`React.memo`** on pure display components (`HealthDot`, `StatusPill`,
  `StatCard`) to prevent unnecessary re-renders
- **`useMemo`** for expensive derived values (portfolio totals, priority scores)
  that are recalculated on every render
- **Virtual scrolling** (e.g., `react-window`) for the Projects and Ideas lists
  when the data set grows large
- **Debounced search** inputs to avoid filtering on every keystroke

---

### 8. Dark Mode Implementation

**Priority: Medium — UI is prepared but not functional**

The README and UI both reference dark mode readiness, but no theme switching
logic is implemented. Steps to complete it:
1. Add a `theme` key to `localStorage` (`'light'` | `'dark'`)
2. Toggle `class="dark"` on `<html>` based on the stored preference
3. Enable Tailwind's `darkMode: 'class'` strategy in `tailwind.config.js`
4. Add `dark:` variants to all components
5. Respect the user's OS preference via `prefers-color-scheme` media query on
   first load

---

### 9. Progressive Web App (PWA)

**Priority: Low-Medium**

Since the app is already offline-first (localStorage), adding a Service Worker
would make it installable as a native-like app on mobile and desktop:

```bash
npm install vite-plugin-pwa
```

Benefits: offline caching of the static bundle, install prompt, app icon on
home screen.

---

### 10. Error Tracking & Monitoring

**Priority: Low — essential once real users are involved**

- **Sentry** (or equivalent) for client-side error tracking — catches unhandled
  exceptions and reports them with stack traces
- **Web Vitals** reporting for Core Web Vitals (LCP, FID, CLS)
- **Uptime monitoring** (e.g., Better Uptime) to alert on deployment failures

Add Sentry with one command:
```bash
npm install @sentry/react
```

---

### 11. SEO & Social Sharing

**Priority: Low for an internal tool, higher for a public-facing product**

- Add `<meta>` description and Open Graph tags to `index.html`
- Add a `robots.txt` if the tool is internal (to prevent indexing)
- Generate a `sitemap.xml` if the tool is public-facing

---

## Quick Reference — Commands

```bash
# Development
npm run dev            # start local dev server

# Quality checks
npm run lint           # ESLint
npm test -- --run      # run tests once (no watch)
npm run test:coverage  # coverage report in coverage/

# Production build
npm run build          # outputs to dist/
npm run preview        # serve dist/ locally at http://localhost:4173

# Deploy
vercel --prod          # deploy to Vercel production
# OR push to main → GitHub Actions deploys to GitHub Pages automatically
```
