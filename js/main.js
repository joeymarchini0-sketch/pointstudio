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
    { href: "index.html", label: "Projects", key: "projects" },
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
    <a href="index.html" class="mark">${STUDIO_NAME}<span class="sheet">Architecture</span></a>
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

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.innerHTML = `
    <a class="footer-cta" href="contact.html">Start a project</a>
  `;
}

function initGallery() {
  const track = document.getElementById("galleryTrack");
  if (!track) return;

  const cards = PROJECTS.map(
    (p) => `
      <a class="project-card" href="project.html?slug=${encodeURIComponent(p.slug)}" data-index>
        <img src="${p.image}" alt="${p.title}" />
        <div class="card-label">
          <div class="card-sheet">${p.sheet}</div>
          <div class="card-title">${p.title}</div>
          <div class="card-meta">${p.location} — ${p.year}</div>
        </div>
      </a>`
  ).join("");

  track.insertAdjacentHTML("beforeend", cards);

  // Dot progression indicator
  const dotProgress = document.getElementById("dotProgress");
  if (dotProgress) {
    dotProgress.innerHTML = PROJECTS.map(
      (p, i) =>
        `<button class="dot" type="button" data-index="${i}" aria-label="Go to ${p.title}"></button>`
    ).join("");

    const dots = Array.from(dotProgress.querySelectorAll(".dot"));
    const cards = Array.from(track.querySelectorAll(".project-card"));
    const images = Array.from(track.querySelectorAll(".project-card img"));

    const updateActiveDot = () => {
      const containerCenter = track.scrollLeft + track.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      dots.forEach((dot, i) => dot.classList.toggle("active", i === closestIndex));
    };

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        const card = cards[i];
        if (card) {
          track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
        }
      });
    });

    track.addEventListener("scroll", updateActiveDot, { passive: true });
    window.addEventListener("resize", updateActiveDot);

    // Card widths depend on each image's natural aspect ratio, which isn't
    // known until it finishes loading — recalc as each one comes in so the
    // dots (and click targets) stay accurate instead of using stale/zero
    // widths from before the images loaded.
    images.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", updateActiveDot, { once: true });
    });

    updateActiveDot();

  }
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

  container.innerHTML = `
    <div class="project-hero">
      <img src="${project.image}" alt="${project.title}" />
    </div>
    <div class="project-body">
      <div class="project-sheet">${project.sheet}</div>
      <h1>${project.title}</h1>
      <div class="meta-row">
        <div><span class="k">Location</span><span class="v">${project.location}</span></div>
        <div><span class="k">Year</span><span class="v">${project.year}</span></div>
        <div><span class="k">Category</span><span class="v">${project.category}</span></div>
      </div>
      <div class="project-copy">${paragraphs}</div>
      <a class="back-link" href="index.html">Back to all projects</a>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const activePage = document.body.dataset.page || "";
  renderHeader(activePage);
  renderFooter();
  initGallery();
  initProjectPage();
});
