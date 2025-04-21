# Deployment & Future‑Update Guide

This document summarizes the steps used to deploy `portfolio-nextjs` to GitHub Pages with a custom domain, and outlines how to update content going forward.

---

## 1. Project Configuration

1. Open `next.config.ts` and add:
   ```ts
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: 'export',                 // static export mode
     eslint: { ignoreDuringBuilds: true },
     images: { unoptimized: true }     // serve /public assets directly
   };

   export default nextConfig;
   ```

2. In `package.json` add an **export** script:
   ```jsonc
   "scripts": {
     "build": "next build",
     "export": "next export",
     // ...other scripts
   }
   ```

---

## 2. Build & Local Static Export

```bash
cd portfolio-nextjs
npm install
npm run build
npm run export
```

- This generates the static site in the `out/` folder.

---

## 3. GitHub Setup

1. Create or use an existing GitHub repo (e.g. `arvind0212/portfolio-v1`).
2. In your local project:
   ```bash
   cd portfolio-nextjs
   git remote remove origin
   git remote add origin https://github.com/arvind0212/portfolio-v1.git
   git branch -M main
   git push -u origin main --force
   ```

---

## 4. GitHub Actions Workflow

Create `.github/workflows/deploy.yml` in your repo:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: 18 }
      - run: npm ci
      - run: |
          npm run build
          npm run export
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
          # publish_branch: gh-pages # Removed reference
          cname: 'lifeofaguru.com'
          user_name: github-actions[bot]
          user_email: github-actions[bot]@users.noreply.github.com
```

- Commit & push it to `main`.  
- The Action will build and deploy automatically. # Removed reference to gh-pages

---

## 5. Custom Domain & DNS

1. In GitHub → **Settings** → **Pages**, configure the source (e.g., GitHub Actions) and add `lifeofaguru.com` as the custom domain. # Removed reference to gh-pages branch
2. On GoDaddy DNS for `lifeofaguru.com`:
   - **Type**: A  
     **Host**: @  
     **Points to**:  
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - (Optional) **Type**: CNAME  
     **Host**: www  
     **Points to**: `arvind0212.github.io`  
   - **TTL**: 1800 (30 minutes) or 3600 (1 hour).

Wait ~30 minutes for the TLS certificate—then “Enforce HTTPS” appears in GitHub Pages settings.

---

## 6. Manual CNAME (if needed)

If the Action does not create the CNAME automatically:

```bash
cd portfolio-nextjs/out
echo "lifeofaguru.com" > CNAME
# The following git commands related to gh-pages are removed as they are no longer relevant
# git checkout -B gh-pages
# git remote add origin https://github.com/arvind0212/portfolio-v1.git
# git add CNAME .
# git commit -m "Add CNAME"
# git push --force origin gh-pages
# You would typically add the CNAME file to your main branch and let the Action handle deployment.
```

---

## 7. Future Updates

1. **Content changes**:
   - Modify React/TSX files under `src/app/(sections)` or update JSON data in `src/lib`.
   - Commit & push to `main`.

2. **Automated redeploy**:
   - On each push to `main`, GitHub Actions will rebuild & redeploy the `out/` folder.

3. **Data-driven updates**:
   - For frequent edits (timeline, projects), consider moving JSON data into a headless CMS or `data/` folder consumed by components.

4. **Dependency updates**:
   - Use Dependabot or `npm outdated` → `npm update`.
   - Commit and push to trigger rebuild.

5. **Testing & Quality**:
   - Add unit or integration tests (Jest, Playwright).
   - Enforce linting (`npm run lint --max-warnings=0`) on CI.

---

## 8. Monitoring & Maintenance

- **Analytics**: integrate a privacy‑focused tool (Plausible, Fathom).  
- **Performance audits**: use Lighthouse or WebPageTest periodically.  
- **Security**: run `npm audit` and review GitHub Action permissions.

---

Your portfolio is now deployed on GitHub Pages with `lifeofaguru.com` and can be updated and maintained seamlessly.
