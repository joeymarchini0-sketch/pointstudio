/**
 * PAGE TEMPLATES
 * ==============
 * Builds the HTML for the shared header and footer, the Selected Work
 * gallery, and each project page, from the PROJECTS list.
 *
 * Used in two places, so both always produce exactly the same markup:
 *   - in the browser, by js/main.js (when a page hasn't been pre-built,
 *     e.g. opening the files locally)
 *   - on Vercel at deploy time, by build.js, which writes finished HTML
 *     for every page so search engines and AI assistants can read it
 *
 * You don't need to edit this file to add projects — use projects-data.js.
 */
(function (root) {
  const SITE_NAME = "Point Studio Architecture + Design";

  // Project page address. Built site: /projects/<slug>/ ; local files: project.html?slug=
  const projectHref = (slug, clean) =>
    clean ? `projects/${encodeURIComponent(slug)}/` : `project.html?slug=${encodeURIComponent(slug)}`;

  function headerHTML(activePage) {
    const links = [
      { href: "index.html", label: "Selected Work", key: "projects" },
      { href: "about.html", label: "About", key: "about" },
      { href: "contact.html", label: "Contact", key: "contact" }
    ];
    const navLinks = links
      .map(
        (l) =>
          `<a href="${l.href}"${l.key === activePage ? ' aria-current="page"' : ""}>${l.label}</a>`
      )
      .join("");
    return `
    <a href="index.html" class="mark"><img src="logo-header.svg" alt="${SITE_NAME}" /></a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
      <span></span>
    </button>
    <nav class="site-nav" id="siteNav">${navLinks}</nav>
  `;
  }

  function footerHTML(activePage, year) {
    const cta = activePage === "contact" ? "" : `
    <div class="footer-cta-row">
      <a class="footer-cta" href="contact.html">Start a project</a>
    </div>`;
    return `${cta}
    <div class="footer-bar">
      <img src="wordmark-light.svg" alt="${SITE_NAME}" class="footer-wordmark" />
      <div class="footer-center">
        <p class="footer-blurb">Serving residential and commercial spaces <span class="blurb-break">in the San Francisco Bay Area</span></p>
        <div class="footer-info">
          <a href="mailto:hello@pointstudioarch.com">hello@pointstudioarch.com</a>
        </div>
      </div>
      <span class="footer-copyright">© <span class="footer-year">${year}</span> Point Studio Inc.</span>
    </div>
  `;
  }

  function galleryHTML(projects, clean) {
    const cards = projects
      .map(
        (p) => `
      <a class="project-card" href="${projectHref(p.slug, clean)}" data-index>
        <div class="card-image">
          <img src="${p.card || p.image}" alt="${p.title}" />
          <div class="card-hover-title">${p.cardTitle || p.title}</div>
        </div>
      </a>`
      )
      .join("");
    return (
      cards +
      `<a class="gallery-outro" href="contact.html">
      <div class="outro-inner">
        <h2><span class="outro-label">Let's Talk</span></h2>
        <p>Have a project in mind?<br />We'd love to hear about it.</p>
      </div>
    </a>`
    );
  }

  // ---- Project page ------------------------------------------------------
  // A project's body is a list of blocks, shown in order between the
  // heading and the credits (see projects-data.js for the full guide):
  //   { type: "feature", photos: [...], side: "left" | "right", text: [...] }
  //   { type: "row", photos: [...] }   1–3 photos side by side, matching heights
  //   { type: "text", text: [...] }    a paragraph block on its own
  // Older entries without "blocks" are converted automatically.
  function projectHTML(project, projects, clean) {
    const currentIndex = projects.findIndex((p) => p.slug === project.slug);
    // Previous / next wrap around both ways (1 ← 5, 5 → 1)
    const nextProject = projects[(currentIndex + 1) % projects.length];
    const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];

    const scope = project.scope && project.scope.length
      ? `<ul class="project-scope" data-reveal>${project.scope.map((l) => `<li>${l}</li>`).join(" ")}</ul>`
      : "";

    const blocks = project.blocks || [
      ...(project.featureImage
        ? [{ type: "feature", photos: [].concat(project.featureImage) }]
        : [{ type: "text" }]),
      ...((project.photos || project.pair || []).length
        ? [{ type: "row", photos: project.photos || project.pair }]
        : []),
    ];

    const figures = (list) =>
      list
        .map((src, n) => `<figure data-reveal style="transition-delay: ${n * 0.35}s"><img src="${src}" alt="${project.title}" /></figure>`)
        .join("");
    const textHtml = (text) =>
      [].concat(text || project.description || []).map((t) => `<p>${t}</p>`).join("");

    const renderBlock = (b) => {
      const list = [].concat(b.photos || []);
      if (b.type === "row") {
        return `<section class="project-section project-photos${list.length === 1 ? " is-single" : ""}">${figures(list)}</section>`;
      }
      if (b.type === "feature" && list.length) {
        const photos = list.length > 1
          ? `<div class="project-feature-photo is-multi">${figures(list)}</div>`
          : `<div class="project-feature-photo" data-reveal><img src="${list[0]}" alt="${project.title}" /></div>`;
        const cls = `project-section project-feature${list.length > 1 ? " has-multi" : ""}${b.side === "right" ? " is-right" : ""}`;
        return `<section class="${cls}">${photos}<div class="project-description" data-reveal>${textHtml(b.text)}</div></section>`;
      }
      return `<section class="project-section project-text"><div class="project-description" data-reveal>${textHtml(b.text)}</div></section>`;
    };
    const body = blocks.map(renderBlock).join("");

    // Credit links open in a new tab
    const credits = project.credits && project.credits.length
      ? `<section class="project-section project-credits" data-reveal>
         <ul>${project.credits
           .map((c) => `<li>${c.replace(/<a (?![^>]*target=)/g, '<a target="_blank" rel="noopener" ')}</li>`)
           .join("")}</ul>
       </section>`
      : "";

    return `
    <article class="project-page">
      <div class="project-cover"><img src="${project.cover || project.card || project.image}" alt="${project.title}"${project.coverPosition ? ` style="object-position: ${project.coverPosition}"` : ""} /></div>
      <header class="project-heading">
        <h1 data-reveal>${project.title}</h1>
        ${scope}
      </header>
      ${body}
      ${credits}
      <nav class="project-section project-nav" data-reveal aria-label="More projects">
        <a class="prev-link" href="${projectHref(prevProject.slug, clean)}">
          <span class="nav-label">Previous</span>
          <span class="nav-name">${prevProject.title}</span>
        </a>
        <a class="next-link" href="${projectHref(nextProject.slug, clean)}">
          <span class="nav-label">Next</span>
          <span class="nav-name">${nextProject.title}</span>
        </a>
      </nav>
    </article>
  `;
  }

  const PS = { SITE_NAME, projectHref, headerHTML, footerHTML, galleryHTML, projectHTML };
  if (typeof module !== "undefined" && module.exports) module.exports = PS;
  else root.PSTemplates = PS;
})(this);
