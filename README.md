# NMS — New Money Stores Website

A multi-page static website with a live, editable product database (Firebase).

## Files in this folder

- `index.html` — home page
- `iron.html`, `pipes.html`, `sheets.html`, `hardware.html`, `welding.html` — department pages (product lists load dynamically)
- `admin.html` — password-protected panel to add/edit/delete products
- `styles.css` — shared styling
- `script.js` — shared page behavior (menu, scroll effects)
- `render-products.js` — loads products from the database onto each department page
- `fallback-data.js` — the default catalog shown until the database has real products
- `firebase-config.js` — **you fill this in** (see `FIREBASE-SETUP.md`)
- `FIREBASE-SETUP.md` — step-by-step guide to connect the database

All files must be uploaded together, in the same folder.

## Put it on GitHub

1. Create a repo at [github.com/new](https://github.com/new)
2. Upload **all files from this folder at once**
3. Commit to `main`
4. **Settings → Pages** → Source: `main` branch, root → Save
5. Live at `https://your-username.github.io/repo-name/` in about a minute

## Set up the product database (optional but recommended)

Right now the site works out of the box showing a default product catalog — nothing is broken if you skip this. But to actually **add/edit products yourself** through `admin.html`, follow `FIREBASE-SETUP.md` (takes about 10 minutes, completely free).

## Before you publish

Search `index.html` for `[Store address]` if you haven't already set the real address.

## Editing later

- **Products:** once Firebase is set up, use `admin.html` — no code editing needed
- **Text/design changes:** edit files directly on GitHub (pencil icon), or come back here and ask
