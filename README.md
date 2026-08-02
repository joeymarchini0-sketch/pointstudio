# Studio Name — Architecture Website

A 3-page site: Projects (horizontal-scroll gallery), About, and Contact.
Plain HTML/CSS/JS — **no build step, no npm install required.**

## How the pages fit together

- `index.html` — the projects gallery (horizontal scroll on desktop, stacked on mobile)
- `about.html` — owner photo + bio
- `contact.html` — embedded Google Form
- `project.html` — one template that renders **every** project's detail page,
  based on `?slug=` in the URL (e.g. `project.html?slug=placeholder-project-one`)
- `js/projects-data.js` — the single list of all projects. This is the only
  file you edit to add, remove, or update a project.
- `js/main.js` — renders the header/footer on every page and builds the
  gallery + project pages from `projects-data.js`
- `css/style.css` — all styling

## Updating projects (the easy way)

You never touch HTML to add a project. Open `js/projects-data.js`:

1. Drop your new image into `images/projects/`
2. Copy one of the existing entries in the `PROJECTS` array, paste it as a
   new one, and fill in the fields (`title`, `location`, `year`, `image`
   path, description, etc.)
3. Give it a unique `slug` — that becomes its URL automatically
4. Save. The home page gallery and the project's detail page both update
   automatically — nothing else to touch.

To replace a placeholder image with a real photo, just point `image:` at
the new file and delete the old placeholder from `images/projects/` if you
want to clean up.

## Testing it locally (offline, no npm needed)

Because there's no build step, you have two options:

**Option A — just open it**
Double-click `index.html` and it opens in your browser. Since everything
uses plain relative links (no fetch/import), this works fully offline.

**Option B — a tiny local server (recommended)**
A local server avoids a few browser quirks around `file://` links and
gives you auto-reload. Pick whichever is easiest:

- **VS Code "Live Server" extension** — right-click `index.html` → "Open
  with Live Server." Auto-refreshes on save. This is the closest thing to
  a "local CSS player" — instant visual feedback as you edit.
- **Python** (already on most Macs): from this folder, run
  `python3 -m http.server 8000`, then visit `http://localhost:8000`
- **Node**, if you have it installed: `npx serve` from this folder

No build tooling, no `node_modules`, nothing to install for Option A or
the Python route.

## Deploying (GitHub + Vercel)

1. Push this folder to a GitHub repo
2. In Vercel, "Add New Project" → import that repo
3. Framework preset: choose **"Other"** (it's a static site — no build
   command needed, output directory is the repo root)
4. Deploy. Every future push to the connected branch auto-deploys.

## Still to do before launch

- Replace `OWNER_NAME` / `STUDIO_NAME` constants at the top of `js/main.js`
- Replace bio copy and credentials in `about.html`
- Replace `images/owner-placeholder.svg` with a real photo
  (`images/owner.jpg`, then update the `<img src>` in `about.html`)
- Swap the Google Form `<iframe>` into `contact.html` (marked with a
  comment showing exactly where)
- Replace the 6 placeholder projects in `js/projects-data.js` with real
  ones, and swap `images/projects/placeholder-0X.svg` for real photos
- Update the `mailto:` address in `contact.html`
- Confirm Avenir renders as expected — see note below

## A note on the Avenir font

Avenir is a commercial font (owned by Linotype), so it can't be bundled or
loaded from a free web font CDN the way Google Fonts can. This site
references it directly (`font-family: "Avenir Next", Avenir, ...`), which
will render correctly on any Mac (Avenir ships with macOS) but will fall
back to a similar geometric sans (Futura/Century Gothic) on Windows or
Linux machines that don't have it installed. If pixel-exact Avenir on
every visitor's device matters, the studio would need a licensed webfont
version (e.g. through Linotype/Monotype) to self-host — happy to wire that
in once you have a license file.
