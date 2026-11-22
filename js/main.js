/**
 * Shared site behavior: header/footer injection + mobile nav toggle
 * runs on every page. Page-specific rendering (gallery, project detail)
 * runs only if the relevant container exists on that page.
 */

const OWNER_NAME = "Megan Lizarraga Marchini";
const STUDIO_NAME = "Point Studio";

function renderHeader(activePage) {
  const header = document.getElementById("site-header");
  if (!header) return;

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

  header.innerHTML = `
    <a href="index.html" class="mark"><img src="logo-header.svg" alt="Point Studio Architecture + Design" /></a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
      <span></span>
    </button>
    <nav class="site-nav" id="siteNav">${navLinks}</nav>
  `;

  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function renderFooter(activePage) {
  const footer = document.getElementById("site-footer");
  if (!footer) return;

  const cta = activePage === "contact" ? "" : `
    <div class="footer-cta-row">
      <a class="footer-cta" href="contact.html">Start a project</a>
    </div>`;

  // Home page: the gallery is sized to fill the screen, so the footer sits
  // tighter there (see .site-footer.is-home in the CSS)
  if (document.getElementById("galleryTrack")) footer.classList.add("is-home");

  const year = new Date().getFullYear();
  footer.innerHTML = `${cta}
    <div class="footer-bar">
      <img src="wordmark-light.svg" alt="Point Studio Architecture + Design" class="footer-wordmark" />
      <div class="footer-center">
        <p class="footer-blurb">Serving residential and commercial spaces in the San Francisco Bay Area</p>
        <div class="footer-info">
          <a href="mailto:hello@pointstudioarch.com">hello@pointstudioarch.com</a>
          <span>© ${year} Point Studio Inc.</span>
        </div>
      </div>
    </div>
  `;
}

function initGallery() {
  const track = document.getElementById("galleryTrack");
  if (!track) return;

  const cards = PROJECTS.map(
    (p, i) => `
      <a class="project-card" href="project.html?slug=${encodeURIComponent(p.slug)}" data-index>
        <div class="card-image">
          <img src="${p.image}" alt="${p.title}" ${i === 0 ? "" : 'loading="lazy"'} />
          <div class="card-hover-title">${p.title}</div>
        </div>
      </a>`
  ).join("");

  track.insertAdjacentHTML("beforeend", cards);
  track.insertAdjacentHTML(
    "beforeend",
    `<a class="gallery-outro" href="contact.html">
      <h2>Let's Talk</h2>
      <p>Have a project in mind? We'd love to hear about it.</p>
    </a>`
  );

  // Load-in animation: stagger each item (intro, cards, closing card) so
  // they slide in right-to-left one after another. Capped so items far
  // offscreen don't wait too long.
  Array.from(track.children).forEach((el, i) => {
    el.style.animationDelay = `${Math.min(i * 0.15, 1.2)}s`;
  });

  // Progress line: fill = how far the right edge of the screen has
  // travelled through the gallery (so it's partly full on load, completely
  // full at the end). Clicking the line scrolls to that point.
  const progress = document.getElementById("scrollProgress");
  const fill = document.getElementById("scrollProgressFill");
  if (progress && fill) {
    progress.style.animationDelay = "0s"; // fades in with the first project

    const update = () => {
      const total = track.scrollWidth;
      const seen = total > 0 ? (track.scrollLeft + track.clientWidth) / total : 1;
      const pct = Math.min(1, Math.max(0, seen));
      fill.style.transform = `scaleX(${pct})`;
      progress.setAttribute("aria-valuenow", String(Math.round(pct * 100)));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    progress.addEventListener("click", (e) => {
      const rect = progress.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      // Same scale as the fill: move so the line ends where you clicked
      const left = ratio * track.scrollWidth - track.clientWidth;
      track.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    });

    update();
  }
}

/**
 * Scroll reveal: elements marked data-reveal fade up the first time they
 * scroll into view, then stay visible for the rest of the visit (each
 * element is un-observed as soon as it's revealed, so it never fades
 * back out). To use on any page: add data-reveal to an element, and the
 * one-line "js" class script in that page's <head>.
 */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    // Reveal once ~10% of the element is on screen, slightly above the
    // bottom edge so the fade is actually seen rather than happening offscreen
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

function initProjectPage() {
  const container = document.getElementById("projectDetail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    container.innerHTML = `
      <div class="not-found">
        <p>We couldn't find that project.</p>
        <a class="back-link" href="index.html">Back to all projects</a>
      </div>`;
    document.title = "Project not found";
    return;
  }

  document.title = `${project.title} — ${STUDIO_NAME}`;

  const paragraphs = project.description.map((p) => `<p>${p}</p>`).join("");

  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  container.innerHTML = `
    <div class="project-detail" id="projectDetailInner">
      <div class="project-photo">
        <img src="${project.image}" alt="${project.title}" />
      </div>
      <div class="project-copy">
        <h1>${project.title}</h1>
        <div class="project-description">${paragraphs}</div>
        <a class="next-link" href="project.html?slug=${encodeURIComponent(nextProject.slug)}">Next Project</a>
      </div>
    </div>
  `;

  // Portrait photos sit beside the text; landscape photos stack above it.
  // Decided from the image's actual dimensions once it loads, so adding a
  // new project never requires manually picking a layout — just add the
  // entry to projects-data.js and point it at an image.
  const detailEl = document.getElementById("projectDetailInner");
  const photoImg = detailEl.querySelector(".project-photo img");
  const applyOrientation = () => {
    if (!photoImg.naturalWidth || !photoImg.naturalHeight) return;
    const isLandscape = photoImg.naturalWidth >= photoImg.naturalHeight;
    detailEl.classList.toggle("is-landscape", isLandscape);
  };
  if (photoImg.complete) {
    applyOrientation();
  } else {
    photoImg.addEventListener("load", applyOrientation, { once: true });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const activePage = document.body.dataset.page || "";
  renderHeader(activePage);
  renderFooter(activePage);
  initGallery();
  initProjectPage();
  initReveal();
});
