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
    <a href="index.html" class="mark"><span class="mark-name">${STUDIO_NAME}</span><span class="sheet">Architecture + Design</span></a>
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
  if (activePage === "contact") return;
  footer.innerHTML = `
    <a class="footer-cta" href="contact.html">Start a project</a>
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

  // Dot progression indicator
  const dotProgress = document.getElementById("dotProgress");
  if (dotProgress) {
    dotProgress.style.animationDelay = "0.15s"; // same moment as the first project image
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

    // Which dot is "active" is decided by the browser itself: rootMargin
    // shrinks the area IntersectionObserver actually watches down to a
    // thin vertical band through the center of the track, so a card only
    // registers as "intersecting" once part of it crosses the middle of
    // the screen — the dot lights up for whichever project is closest to
    // center, not just whichever happens to take up the most raw area.
    // This sidesteps all the manual scroll-offset math (and its edge
    // cases at the very start/end of the track) that kept causing the
    // first/last dot to mis-highlight — IntersectionObserver measures
    // actual on-screen position directly, so there's nothing to get
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
        rootMargin: "0px -42% 0px -42%",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    cards.forEach((card) => observer.observe(card));

    updateActiveDot();

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
