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
        <div class="card-image">
          <img src="${p.image}" alt="${p.title}" />
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

  // Dot progression indicator
  const dotProgress = document.getElementById("dotProgress");
  if (dotProgress) {
    dotProgress.innerHTML = PROJECTS.map(
      (p, i) =>
        `<button class="dot" type="button" data-index="${i}" aria-label="Go to ${p.title}"></button>`
    ).join("");

    const dots = Array.from(dotProgress.querySelectorAll(".dot"));
    const cards = Array.from(track.querySelectorAll(".project-card"));

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        const card = cards[i];
        if (card) {
          // Center the clicked project rather than left-aligning it — with
          // no snap forcing a specific resting edge, centering is the more
          // natural target and the browser clamps automatically if a card
          // near either end can't fully reach center.
          const target = card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2;
          track.scrollTo({ left: target, behavior: "smooth" });
        }
      });
    });

    // Which dot is "active" is decided by the browser itself: whichever
    // card currently takes up the most visible area of the track wins.
    // This sidesteps all the manual scroll-offset math (and its edge
    // cases at the very start/end of the track) that kept causing the
    // first/last dot to mis-highlight — IntersectionObserver measures
    // actual on-screen visibility directly, so there's nothing to get
    // wrong at the boundaries.
    const visibleRatios = new Map();

    const updateActiveDot = () => {
      let bestIndex = 0;
      let bestRatio = -1;
      cards.forEach((card, i) => {
        const ratio = visibleRatios.get(card) || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestIndex = i;
        }
      });
      dots.forEach((dot, i) => dot.classList.toggle("active", i === bestIndex));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleRatios.set(entry.target, entry.intersectionRatio);
        });
        updateActiveDot();
      },
      {
        root: track,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    cards.forEach((card) => observer.observe(card));

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
