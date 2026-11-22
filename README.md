# rdxz2.github.io

Personal site of Richard Dharmawan: a platform map, a journey timeline, and every percentage metric with how it was measured.

Static site: Astro 7 + Tailwind 4, no client framework. Hosted on GitHub Pages.

## Run

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + build to dist/
npm run preview   # serve dist/
```

## Where things live

| What | File |
|---|---|
| Every number shown on the site, with method and "as of" | `src/data/metrics.json` |
| The journey timeline | `src/data/timeline.ts` |
| Case studies (one page each at `/work/<slug>/`, linked from their journey entry) | `src/data/cases.ts`, `src/pages/work/[slug].astro` |
| CV (source HTML; PDF in `public/`) | `cv/richard-dharmawan-cv.html` |
| Charts (unit charts, career strip, skills matrix) | `src/components/MetricViz.astro`, `OverviewStrip.astro`, `SkillsMatrix.astro` |
| Chart shapes per metric | `src/data/metrics.json → viz` |
| Platform map on the home page | `src/components/PlatformMap.astro` |
| Page shell, header, footer, theme toggle | `src/layouts/Base.astro` |
| Linkable section headings (hover `#`, link in the URL bar) | `src/components/SectionHeading.astro` |
| Linkable text (section headings, number labels): underline + `#` on hover, click only sets the URL | `src/components/AnchorLink.astro` |
| Colours and typography | `src/styles/global.css` |

Numbers are never typed into pages. Pages read them from `metrics.json` through `MetricChip` or directly. The footer's "Last updated" date is the latest `as_of` across all metrics.

## Deploy (GitHub Pages)

Every push to `main` runs `.github/workflows/deploy.yml`: `npm ci`, `npm run build`, then publishes `dist/` to https://rdxz2.github.io.

1. One-time: repo Settings → Pages → Source: **GitHub Actions**.
2. Push to `main`. Runs show under the Actions tab.
3. If a custom domain is bought later: add it under Settings → Pages → Custom domain, add `public/CNAME` with the domain, and set `site` in `astro.config.mjs`.
