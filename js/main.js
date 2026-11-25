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
          <img src="${p.card || p.image}" alt="${p.title}" />
          <div class="card-hover-title">${p.cardTitle || p.title}</div>
        </div>
      </a>`
  ).join("");

  track.insertAdjacentHTML("beforeend", cards);
  track.insertAdjacentHTML(
    "beforeend",
    `<a class="gallery-outro" href="contact.html">
      <h2><span class="outro-label">Let's Talk</span></h2>
      <p>Have a project in mind?<br />We'd love to hear about it.</p>
    </a>`
  );

  // Each card is made exactly as wide as its photo (photos are never
  // cropped), so the visible space between every pair of photos is the same.
  // Phones stack the gallery instead, so this only applies on wider screens.
  const phoneLayout = window.matchMedia("(max-width: 720px)");
  const sizeCards = () => {
    track.querySelectorAll(".project-card").forEach((card) => {
      card.style.flex = "";
      card.style.width = "";
    });
    if (phoneLayout.matches) return;
    track.querySelectorAll(".project-card").forEach((card) => {
      const img = card.querySelector("img");
      if (!img.naturalWidth) return;
      const slot = card.getBoundingClientRect();
      const box = card.querySelector(".card-image").getBoundingClientRect();
      const w = Math.min(slot.width, box.height * (img.naturalWidth / img.naturalHeight));
      card.style.flex = `0 0 ${w}px`;
      card.style.width = `${w}px`;
    });
  };
  track.querySelectorAll(".project-card img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", sizeCards, { once: true });
  });
  sizeCards();
  window.addEventListener("resize", sizeCards);

  // Touch screens have no hover, so the project title (and the photo
  // darkening) appears on its own when a project scrolls into the middle
  // of the screen, and fades away again as it scrolls past.
  initTouchTitles(track);

  // Phones: project photos fade up as each one scrolls into view (once),
  // instead of the sideways slide used on computers (styles in CSS)
  if ("IntersectionObserver" in window) {
    const cardObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-shown");
          cardObserver.unobserve(e.target);
        }),
      { threshold: 0.15 }
    );
    track.querySelectorAll(".project-card").forEach((c) => cardObserver.observe(c));
  }

  // "Let's Talk" on phones: fades in each time it scrolls into view and
  // fades back out when it scrolls away (styles in CSS; computers unaffected)
  const outro = track.querySelector(".gallery-outro");
  if (outro && "IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => entries.forEach((e) => outro.classList.toggle("is-in", e.isIntersecting)),
      { threshold: 0.4 }
    ).observe(outro);
  }

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
    document.title = "Project not found — Point Studio Architecture + Design";
    return;
  }

  document.title = `${project.title} — Point Studio Architecture + Design`;

  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug);
  // Previous / next wrap around both ways (1 ← 5, 5 → 1)
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];

  const scope = project.scope && project.scope.length
    ? `<ul class="project-scope" data-reveal>${project.scope.map((l) => `<li>${l}</li>`).join(" ")}</ul>`
    : "";

  // ---- Body blocks -------------------------------------------------------
  // A project's body is a list of blocks, shown in order between the
  // heading and the credits (see projects-data.js for the full guide):
  //   { type: "feature", photos: [...], side: "left" | "right", text: [...] }
  //       1–2 photos side by side with text beside them (text defaults to
  //       the project's description)
  //   { type: "row", photos: [...] }   1–3 photos side by side, matching heights
  //   { type: "text", text: [...] }    a paragraph block on its own
  // Older entries without "blocks" are converted automatically.
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

  const credits = project.credits && project.credits.length
    ? `<section class="project-section project-credits" data-reveal>
         <ul>${project.credits.map((c) => `<li>${c}</li>`).join("")}</ul>
       </section>`
    : "";

  container.innerHTML = `
    <article class="project-page">
      <div class="project-cover"><img src="${project.cover || project.card || project.image}" alt="${project.title}"${project.coverPosition ? ` style="object-position: ${project.coverPosition}"` : ""} /></div>
      <header class="project-heading">
        <h1 data-reveal>${project.title}</h1>
        ${scope}
      </header>
      ${body}
      ${credits}
      <nav class="project-section project-nav" data-reveal aria-label="More projects">
        <a class="prev-link" href="project.html?slug=${encodeURIComponent(prevProject.slug)}">
          <span class="nav-label">Previous</span>
          <span class="nav-name">${prevProject.title}</span>
        </a>
        <a class="next-link" href="project.html?slug=${encodeURIComponent(nextProject.slug)}">
          <span class="nav-label">Next</span>
          <span class="nav-name">${nextProject.title}</span>
        </a>
      </nav>
    </article>
  `;

  // Scope line: wrap at ~2/3 of the title's width, and hide the dot on any
  // item that starts a new line
  const scopeList = container.querySelector(".project-scope");
  const titleEl = container.querySelector(".project-heading h1");
  if (scopeList && titleEl) {
    const layoutScope = () => {
      const range = document.createRange();
      range.selectNodeContents(titleEl);
      const titleWidth = range.getBoundingClientRect().width;
      const items = Array.from(scopeList.children);
      items.forEach((li) => li.classList.remove("line-start"));
      // ~2/3 of the title's width, but never narrower than ~560px, so a short
      // title (e.g. "Hidden Suite") doesn't squeeze the scope into a tall column
      const containerWidth = scopeList.parentElement.clientWidth;
      scopeList.style.maxWidth = `${Math.min(containerWidth, Math.max(560, titleWidth * 0.67))}px`;
      // An item starts a new line if its first line sits lower than the
      // previous item's last line
      const mark = () =>
        items.forEach((li, i) => {
          if (i === 0) return;
          // ignore the empty sliver some browsers leave at the end of a line
          const rects = (el) => Array.from(el.getClientRects()).filter((r) => r.width > 1);
          const prev = rects(items[i - 1]);
          const cur = rects(li);
          const starts = cur.length && prev.length && cur[0].top > prev[prev.length - 1].top + 2;
          li.classList.toggle("line-start", Boolean(starts));
        });
      // Hiding a dot can shift the wrapping, so repeat until it settles
      for (let pass = 0; pass < 4; pass++) {
        const before = items.map((li) => li.classList.contains("line-start")).join();
        mark();
        if (items.map((li) => li.classList.contains("line-start")).join() === before) break;
      }
    };
    layoutScope();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutScope);
    window.addEventListener("resize", layoutScope);
  }

  // Credit links open in a new tab
  container.querySelectorAll(".project-credits a").forEach((a) => {
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Side-by-side photos: give each a width in proportion to its shape so
  // both end up exactly the same height
  container.querySelectorAll(".project-photos:not(.is-single) figure, .project-feature-photo.is-multi figure").forEach((fig) => {
    const img = fig.querySelector("img");
    const size = () => {
      if (img.naturalWidth) fig.style.flexGrow = img.naturalWidth / img.naturalHeight;
    };
    if (img.complete) size(); else img.addEventListener("load", size, { once: true });
  });
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
  "https://script.google.com/macros/s/AKfycbxq4iSWCH9AQHixFeJRiLDfX532pe03FSiE-jV9rdTSia6kfFFcxUPfyn4aybxeyju2QQ/exec";

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
    button.textContent = "Submitting…";
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
      button.textContent = "Submit";
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
