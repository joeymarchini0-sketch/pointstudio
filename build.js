/**
 * DEPLOY BUILD — runs automatically on Vercel at every push (see vercel.json).
 * You never need to run or edit this.
 *
 * It copies the site into /dist and fills each page with its finished HTML
 * (header, footer, gallery, every project page), so search engines and AI
 * assistants — most of which don't run JavaScript — can read all of it.
 * It also writes:
 *   - a page per project at /projects/<slug>/
 *   - sitemap.xml and robots.txt
 *   - structured business details (schema.org) that machines read
 * The site looks and behaves exactly the same; js/main.js just adds the
 * behavior to the content that's already there.
 *
 * Plain Node, no packages. Test locally with:  node build.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const OUT = path.join(ROOT, "dist");

// The site's address. On Vercel this is the production domain (it switches
// to pointstudioarch.com automatically once that domain is connected).
const SITE_URL = (process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://pointstudio.vercel.app"
).replace(/\/$/, "");
const OLD_URL = "https://pointstudio.vercel.app";

const PROJECTS = require("./js/projects-data.js");
const T = require("./js/templates.js");

// ---------------------------------------------------------------------------
// helpers
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const write = (rel, text) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
};
const stripTags = (s) => String(s).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
const attr = (s) => decode(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const summary = (s, max = 158) => {
  const t = decode(stripTags(s));
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/\s+\S*$/, "") + "…";
};
const jsonLd = (obj) =>
  `  <script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>\n`;
const year = new Date().getFullYear();
// Real projects have a cover photo; placeholders don't (kept out of search)
const isReal = (p) => Boolean(p.cover);

// Swap an empty container for one with its content already in place
function fill(html, openTag, content) {
  const i = html.indexOf(openTag);
  if (i === -1) throw new Error(`build: couldn't find ${openTag}`);
  const tagName = openTag.match(/^<(\w+)/)[1];
  const close = `</${tagName}>`;
  const j = html.indexOf(close, i);
  const prerenderedTag = openTag.replace(/>$/, " data-prerendered>");
  return html.slice(0, i) + prerenderedTag + content + html.slice(j);
}

function finishPage(html, { activePage, canonical, extraHead = "" }) {
  html = html.replace("<html lang=\"en\">", "<html lang=\"en\" data-built>");
  html = fill(html, '<header id="site-header" class="site-header">', T.headerHTML(activePage));
  html = fill(html, '<footer id="site-footer" class="site-footer">', T.footerHTML(activePage, year));
  html = html.split(OLD_URL).join(SITE_URL);
  html = html.replace(
    "  <link rel=\"stylesheet\" href=\"css/style.css\" />",
    `  <link rel="canonical" href="${canonical}" />\n${extraHead}  <link rel="stylesheet" href="css/style.css" />`
  );
  return html;
}

// ---------------------------------------------------------------------------
// structured data
const STUDIO_ID = `${SITE_URL}/#studio`;
const studio = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": STUDIO_ID,
  name: T.SITE_NAME,
  alternateName: "Point Studio",
  description:
    "Architecture and design studio offering full architectural services for remodels, additions, new homes and ADUs, and commercial spaces in the San Francisco Bay Area.",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo-email.png`,
  image: `${SITE_URL}/share-image.jpg`,
  email: "hello@pointstudioarch.com",
  address: { "@type": "PostalAddress", addressLocality: "Richmond", addressRegion: "CA", addressCountry: "US" },
  areaServed: { "@type": "Place", name: "San Francisco Bay Area" },
  founder: { "@id": `${SITE_URL}/about.html#megan` },
  knowsAbout: [
    "Residential architecture",
    "Home remodels",
    "Home additions",
    "New homes",
    "Accessory dwelling units (ADUs)",
    "Commercial spaces",
    "Edwardian, Craftsman and Eichler homes"
  ]
};
const megan = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/about.html#megan`,
  name: "Megan Lizarraga Marchini",
  jobTitle: "Architect",
  description: "Licensed architect in California with over ten years of design experience.",
  worksFor: { "@id": STUDIO_ID },
  alumniOf: { "@type": "CollegeOrUniversity", name: "California Polytechnic State University, San Luis Obispo" },
  url: `${SITE_URL}/about.html`
};

// ---------------------------------------------------------------------------
// 1. copy everything except build files
const SKIP = new Set(["dist", "node_modules", ".git", ".github", "build.js", "vercel.json", "package.json", "README.md", ".DS_Store", ".vercel"]);
fs.rmSync(OUT, { recursive: true, force: true });
(function copy(dir) {
  for (const name of fs.readdirSync(path.join(ROOT, dir))) {
    if (SKIP.has(name)) continue;
    const rel = path.join(dir, name);
    if (fs.statSync(path.join(ROOT, rel)).isDirectory()) copy(rel);
    else {
      fs.mkdirSync(path.join(OUT, dir), { recursive: true });
      fs.copyFileSync(path.join(ROOT, rel), path.join(OUT, rel));
    }
  }
})("");

// 2. home, about, contact
let home = finishPage(read("index.html"), {
  activePage: "projects",
  canonical: `${SITE_URL}/`,
  extraHead: jsonLd(studio)
});
home = fill(home, '<div class="gallery" id="galleryTrack">', T.galleryHTML(PROJECTS, true));
write("index.html", home);

write("about.html", finishPage(read("about.html"), {
  activePage: "about",
  canonical: `${SITE_URL}/about.html`,
  extraHead: jsonLd(studio) + jsonLd(megan)
}));

write("contact.html", finishPage(read("contact.html"), {
  activePage: "contact",
  canonical: `${SITE_URL}/contact.html`
}));

// 3. a page per project, at /projects/<slug>/
const template = read("project.html");
for (const p of PROJECTS) {
  const url = `${SITE_URL}/projects/${p.slug}/`;
  const title = `${decode(stripTags(p.title))} — ${T.SITE_NAME}`;
  const desc = summary((p.description && p.description[0]) || `A project by ${T.SITE_NAME}.`);
  const image = `${SITE_URL}/${p.cover || p.card || p.image}`;

  let html = template;
  html = html.replace(/<title>.*?<\/title>/, `<title>${attr(title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*/, `$1${attr(desc)}`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*/, `$1${attr(title)}`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*/, `$1${attr(desc)}`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*/, `$1${image}`);
  html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, "");
  html = html.replace(/(<meta property="og:type" content=")[^"]*/, "$1article");
  // Pages live one folder down; this keeps every relative link pointing at the site root
  html = html.replace("<meta charset=\"UTF-8\" />", "<meta charset=\"UTF-8\" />\n  <base href=\"/\" />");
  html = html.replace("<body data-page=\"projects\">", `<body data-page="projects" data-slug="${attr(p.slug)}">`);

  const work = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: decode(stripTags(p.title)),
    description: (p.description || []).map((d) => decode(stripTags(d))).join(" "),
    image,
    url,
    creator: { "@id": STUDIO_ID },
    keywords: (p.scope || []).join(", ")
  };
  html = finishPage(html, {
    activePage: "projects",
    canonical: url,
    extraHead: (isReal(p) ? "" : '  <meta name="robots" content="noindex" />\n') + jsonLd(work)
  });
  html = fill(html, '<div id="projectDetail">', T.projectHTML(p, PROJECTS, true));
  write(`projects/${p.slug}/index.html`, html);
}

// 4. sitemap + robots
const today = new Date().toISOString().slice(0, 10);
const urls = [
  `${SITE_URL}/`,
  `${SITE_URL}/about.html`,
  `${SITE_URL}/contact.html`,
  ...PROJECTS.filter(isReal).map((p) => `${SITE_URL}/projects/${p.slug}/`)
];
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`
);
write(
  "robots.txt",
  `# Search engines and AI assistants are welcome to read this site\nUser-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
);

console.log(`Built ${PROJECTS.length} project pages for ${SITE_URL}`);
