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
        </div>
      </div>
      <span class="footer-copyright">© ${year} Point Studio Inc.</span>
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

  // Touch screens have no hover, so the project title (and the photo
  // darkening) appears on its own when a project scrolls into the middle
  // of the screen, and fades away again as it scrolls past.
  initTouchTitles(track);

  // Load-in animation: stagger each item (intro, cards, closing card) so
  // they slide in right-to-left one after another. Capped so items far
  // offscreen don't wait too long.
  Array.from(track.children).forEach((el, i) => {
    el.style.animationDelay = `${Math.min(i * 0.15, 1.2)}s`;
  });

  // Progress line: starts one-third full when the page opens, then fills
  // the remaining two-thirds in step with scrolling, reaching full at the
  // end of the gallery. Clicking the line scrolls to the matching point.
  const progress = document.getElementById("scrollProgress");
  const fill = document.getElementById("scrollProgressFill");
  if (progress && fill) {
    progress.style.animationDelay = "0s"; // fades in with the first project

    const START = 1 / 3;
    const maxScroll = () => Math.max(1, track.scrollWidth - track.clientWidth);

    const update = () => {
      const t = Math.min(1, Math.max(0, track.scrollLeft / maxScroll()));
      const pct = START + (1 - START) * t;
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
      // Inverse of the fill: anywhere in the first third = the start
      const t = Math.min(1, Math.max(0, (ratio - START) / (1 - START)));
      track.scrollTo({ left: t * maxScroll(), behavior: "smooth" });
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

function initTouchTitles(track) {
  if (!("IntersectionObserver" in window)) return;
  const touch = window.matchMedia("(hover: none)");
  const phone = window.matchMedia("(max-width: 720px)");
  const cards = Array.from(track.querySelectorAll(".project-card"));
  let observer = null;

  const setup = () => {
    if (observer) observer.disconnect();
    cards.forEach((c) => c.classList.remove("is-active"));
    if (!touch.matches && !phone.matches) return; // mouse: normal hover

    // Phones scroll the page up and down; tablets scroll the gallery sideways.
    // Either way, watch a band through the middle of what's on screen.
    const vertical = phone.matches;
    // Only one title shows at a time: of the projects crossing the middle
    // band, the one whose center is closest to the middle of the screen.
    const inBand = new Set();
    const pick = () => {
      const r = vertical
        ? { mid: window.innerHeight / 2 }
        : { mid: track.getBoundingClientRect().left + track.clientWidth / 2 };
      let best = null;
      let bestDist = Infinity;
      inBand.forEach((c) => {
        const b = c.getBoundingClientRect();
        const center = vertical ? b.top + b.height / 2 : b.left + b.width / 2;
        const d = Math.abs(center - r.mid);
        if (d < bestDist) { bestDist = d; best = c; }
      });
      cards.forEach((c) => c.classList.toggle("is-active", c === best));
    };
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inBand.add(e.target) : inBand.delete(e.target)));
        pick();
      },
      vertical
        ? { root: null, rootMargin: "-40% 0px -40% 0px" }
        : { root: track, rootMargin: "0px -40% 0px -40%" }
    );
    cards.forEach((c) => observer.observe(c));
  };

  setup();
  phone.addEventListener("change", setup);
  touch.addEventListener("change", setup);
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

  document.title = `${project.title} — Point Studio Architecture + Design`;

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

/**
 * Contact form: our own styled form. Submissions go to a small Google Apps
 * Script (attached to the studio's Google Form), which submits them into
 * the Form as the owner — so they land in the Form's Responses tab and
 * linked Sheet like any other response. The script replies with
 * {"ok": true} or {"ok": false, "error": "..."}, so the site only shows
 * "Thank you" when the response was really recorded.
 *
 * The script matches questions by title; if a question is renamed in the
 * Google Form, update the QUESTIONS list at the top of the script.
 */
const CONTACT_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyXs-jXQuGQz-91h5hQNdgzP1pBI5kkgSjMEpdo0waXYUZAJijVF-8Pxwbz4bALNNUfuQ/exec";

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const thanks = document.getElementById("formThanks");
  const status = form.querySelector(".form-status");
  const button = form.querySelector(".form-submit");

  const setError = (fieldEl, msg) => {
    const box = fieldEl.closest(".field");
    box.classList.toggle("has-error", Boolean(msg));
    box.querySelector(".field-error").textContent = msg || "";
  };

  const validate = () => {
    let ok = true;
    const name = form.querySelector("#cf-name");
    const email = form.querySelector("#cf-email");
    const choice = form.querySelector('input[name="entry.2042927560"]');
    const chosen = form.querySelector('input[name="entry.2042927560"]:checked');

    if (!name.value.trim()) { setError(name, "Please add your name."); ok = false; } else setError(name);
    if (!email.value.trim()) { setError(email, "Please add your email."); ok = false; }
    else if (!email.checkValidity()) { setError(email, "That email doesn't look quite right."); ok = false; }
    else setError(email);
    if (!chosen) { setError(choice, "Please choose one."); ok = false; } else setError(choice);
    return ok;
  };

  // Message box: start at 2 lines, grow with the text. If the visitor has
  // dragged it taller with the corner handle, never shrink below that.
  const message = form.querySelector("#cf-message");
  if (message) {
    let manualMin = 0;
    const grow = () => {
      message.style.height = "auto";
      const border = message.offsetHeight - message.clientHeight;
      const needed = message.scrollHeight + border;
      message.style.height = `${Math.max(needed, manualMin)}px`;
    };
    message.addEventListener("input", grow);
    message.addEventListener("mouseup", () => { manualMin = message.offsetHeight; });
    grow();
  }

  // Clear a field's error as soon as it's fixed
  form.addEventListener("input", (e) => {
    const box = e.target.closest(".field");
    if (box && box.classList.contains("has-error")) validate();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    if (!validate()) {
      const first = form.querySelector(".has-error input, .has-error textarea");
      if (first) first.focus();
      return;
    }

    // Honeypot filled in → quietly pretend it worked
    if (form.querySelector("#cf-website").value) {
      form.closest(".contact-page").querySelectorAll("h1, .direct-contact").forEach((el) => (el.hidden = true));
      form.hidden = true;
      thanks.hidden = false;
      return;
    }

    const chosen = form.querySelector('input[name="entry.2042927560"]:checked');
    const payload = {
      name: form.querySelector("#cf-name").value.trim(),
      email: form.querySelector("#cf-email").value.trim(),
      inquiry: chosen ? chosen.value : "",
      message: form.querySelector("#cf-message").value.trim(),
      website: form.querySelector("#cf-website").value,
    };

    button.disabled = true;
    button.textContent = "Sending…";
    try {
      // text/plain keeps this a "simple" request, which Apps Script accepts
      // from other websites without extra permission checks
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.ok) throw new Error(result.error || "Not recorded");

      // Fade out the title, form and "reach out directly" line, leaving
      // only the thank-you message
      const page = form.closest(".contact-page");
      const extras = page ? page.querySelectorAll("h1, .direct-contact") : [];
      form.classList.add("is-leaving");
      extras.forEach((el) => el.classList.add("is-leaving"));
      setTimeout(() => {
        form.hidden = true;
        extras.forEach((el) => (el.hidden = true));
        thanks.hidden = false;
        thanks.classList.add("is-showing");
      }, 400);
    } catch (err) {
      console.error("Contact form:", err); // visible in the browser's developer console
      button.disabled = false;
      button.textContent = "Send";
      status.innerHTML =
        'Something went wrong sending that. Please try again, or email us at <a href="mailto:hello@pointstudioarch.com">hello@pointstudioarch.com</a>.';
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const activePage = document.body.dataset.page || "";
  renderHeader(activePage);
  renderFooter(activePage);
  initGallery();
  initProjectPage();
  initReveal();
  initContactForm();
});
