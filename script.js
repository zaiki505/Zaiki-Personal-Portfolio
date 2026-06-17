const navIntroKey = "navIntroPlayed:v2";
const navigationEntry = performance.getEntriesByType("navigation")[0];

if (navigationEntry?.type === "reload") {
  sessionStorage.removeItem(navIntroKey);
}

if (!sessionStorage.getItem(navIntroKey)) {
  document.body.classList.add("nav-intro");
  sessionStorage.setItem(navIntroKey, "true");
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

document.addEventListener("DOMContentLoaded", () => {
  /* ==================== Theme toggle ==================== */
  const toggleBtn = document.getElementById("theme-toggle");
  const label = toggleBtn?.querySelector(".label");

  const setDark = () => {
    document.body.classList.remove("light");
    if (label) label.textContent = "Theme ☀️";
    toggleBtn?.setAttribute("data-theme-icon", "moon");
    localStorage.setItem("theme", "dark");
  };

  const setLight = () => {
    document.body.classList.add("light");
    if (label) label.textContent = "Theme 🌙";
    toggleBtn?.setAttribute("data-theme-icon", "sun");
    localStorage.setItem("theme", "light");
  };

  const saved = localStorage.getItem("theme");
  if (saved === "light") setLight();
  else if (saved === "dark") setDark();
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) setLight();
  else setDark();

  toggleBtn?.addEventListener("click", () => {
    if (document.body.classList.contains("light")) setDark();
    else setLight();
  });

  /* ==================== Mobile menu ==================== */
  const nav = document.querySelector("nav");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");

  const openMenu = () => {
    nav?.classList.add("menu-open");
    document.body.classList.add("nav-menu-open");
  };

  const closeMenu = () => {
    nav?.classList.remove("menu-open");
    document.body.classList.remove("nav-menu-open");
  };

  mobileMenuToggle?.addEventListener("click", () => {
    if (nav.classList.contains("menu-open")) closeMenu();
    else openMenu();
  });

  document.addEventListener("click", (event) => {
    if (nav?.classList.contains("menu-open") && !nav.contains(event.target)) {
      closeMenu();
    }
  });

  /* ==================== Squish click animation (delegated) ==================== */
  document.addEventListener("click", (event) => {
    const interactive = event.target.closest(
      "a, button, .milestone-card, .spm-summary, .skill-tier-header, .project-card, .edu-card"
    );
    if (!interactive || interactive.hasAttribute("data-no-squish")) return;

    interactive.classList.remove("ui-clicked");
    void interactive.offsetWidth;
    interactive.classList.add("ui-clicked");
  });

  document.addEventListener("animationend", (event) => {
    if (event.target.classList?.contains("ui-clicked")) {
      event.target.classList.remove("ui-clicked");
    }
  });

  /* ==================== Nav pill indicator (glides between pages) ==================== */
  const navList = document.querySelector(".nav-links");
  let indicator = null;
  let fill = null;

  const placeAt = (link) => {
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.height = `${link.offsetHeight}px`;
    indicator.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
    indicator.classList.add("is-ready");
  };

  const snapTo = (link) => {
    indicator.style.transition = "none";
    placeAt(link);
    void indicator.offsetWidth;
    indicator.style.transition = "";
  };

  const updatePill = (animate) => {
    if (!navList || !indicator) return;
    const active = navList.querySelector('a[aria-current="page"]');
    if (!active) {
      indicator.classList.remove("is-ready");
      return;
    }
    if (animate && indicator.classList.contains("is-ready")) {
      indicator.classList.add("is-gliding");
      placeAt(active);
      fill.addEventListener(
        "animationend",
        () => indicator.classList.remove("is-gliding"),
        { once: true }
      );
    } else {
      snapTo(active);
    }
  };

  if (navList) {
    indicator = document.createElement("span");
    indicator.className = "nav-indicator";
    indicator.setAttribute("aria-hidden", "true");
    fill = document.createElement("span");
    fill.className = "nav-indicator-fill";
    indicator.appendChild(fill);
    navList.appendChild(indicator);
    window.addEventListener("resize", () => updatePill(false));
  }

  /* ==================== Scroll-to-top button (mobile) ==================== */
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.className = "scroll-top-btn";
  scrollTopBtn.type = "button";
  scrollTopBtn.setAttribute("aria-label", "Scroll to top");
  scrollTopBtn.setAttribute("data-no-squish", "");
  scrollTopBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  document.body.appendChild(scrollTopBtn);

  const toggleScrollBtn = () => {
    scrollTopBtn.classList.toggle("is-visible", window.scrollY > 400);
  };
  toggleScrollBtn();
  window.addEventListener("scroll", toggleScrollBtn, { passive: true });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ==================== URL helpers ==================== */
  const normPath = (href) => {
    let p = new URL(href, location.href).pathname;
    p = p.replace(/index\.html$/, "");
    return p === "" ? "/" : p;
  };

  const isSpecialUrl = (v) =>
    !v || v.startsWith("#") || v.startsWith("data:") || /^[a-z]+:/i.test(v);

  const absolutize = (root, baseHref) => {
    root.querySelectorAll("[href]").forEach((el) => {
      const v = el.getAttribute("href");
      if (!isSpecialUrl(v)) el.setAttribute("href", new URL(v, baseHref).href);
    });
    root.querySelectorAll("[src]").forEach((el) => {
      const v = el.getAttribute("src");
      if (!isSpecialUrl(v)) el.setAttribute("src", new URL(v, baseHref).href);
    });
  };

  const header = document.querySelector("header");
  if (header) absolutize(header, location.href);

  const setActiveNav = (href) => {
    const target = normPath(href);
    // A project detail page (/projects/X.html) keeps the "Projects" tab lit.
    const inProjects = target.startsWith("/projects/");
    navList?.querySelectorAll("a").forEach((a) => {
      const ap = normPath(a.href);
      const isActive = ap === target || (inProjects && ap === "/projects.html");
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    const logoA = document.querySelector(".logo a");
    if (logoA) {
      const home = normPath(logoA.href) === target;
      if (home) logoA.setAttribute("aria-current", "page");
      else logoA.removeAttribute("aria-current");
      logoA.setAttribute("data-tooltip", home ? "You're home" : "Back to home");
    }
  };

  /* ==================== Page features (re-bound after each swap) ==================== */
  const initPageFeatures = () => {
    // Category filter bars (projects + skills)
    document.querySelectorAll("[data-filter-bar]").forEach((bar) => {
      if (bar.dataset.bound) return;
      bar.dataset.bound = "1";
      const targetSelector = bar.getAttribute("data-filter-target");
      if (!targetSelector) return;

      const items = Array.from(document.querySelectorAll(targetSelector));
      const groups = Array.from(document.querySelectorAll("[data-filter-group]"));

      bar.addEventListener("click", (event) => {
        const btn = event.target.closest(".filter-btn");
        if (!btn) return;

        bar
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        items.forEach((item) => {
          const cats = (item.dataset.category || "").split(/\s+/);
          const show = filter === "all" || cats.includes(filter);
          item.classList.toggle("filtered-hidden", !show);
        });

        groups.forEach((group) => {
          const hasVisible = group.querySelector(
            `${targetSelector}:not(.filtered-hidden)`
          );
          group.classList.toggle("filtered-hidden", !hasVisible);
        });
      });
    });

    // CGPA bars (education)
    document.querySelectorAll(".cgpa-bar-wrap").forEach((bar) => {
      if (bar.dataset.bound) return;
      bar.dataset.bound = "1";
      bar.addEventListener("click", () => {
        bar.classList.remove("clicked");
        void bar.offsetWidth;
        bar.classList.add("clicked");
      });
      bar.addEventListener("animationend", () => bar.classList.remove("clicked"));
    });

    // Print buttons
    document.querySelectorAll("[data-print]").forEach((button) => {
      if (button.dataset.bound) return;
      button.dataset.bound = "1";
      button.addEventListener("click", () => window.print());
    });

    // Contact form
    const contactForm = document.getElementById("contact-form");
    if (contactForm && !contactForm.dataset.bound) {
      contactForm.dataset.bound = "1";
      const statusEl = document.getElementById("form-status");
      const showStatus = (msg, state) => {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.dataset.state = state;
        statusEl.classList.add("is-visible");
      };

      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!name || !email || !message) {
          showStatus("Please fill in all fields before sending.", "error");
          return;
        }
        if (!emailOk) {
          showStatus("That email address doesn't look quite right.", "error");
          return;
        }

        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );
        window.location.href = `mailto:shamsulzire@gmail.com?subject=${subject}&body=${body}`;
        showStatus(
          "Opening your email app… if nothing happens, email shamsulzire@gmail.com directly.",
          "success"
        );
        contactForm.reset();
      });
    }
  };

  /* ==================== SPA router ==================== */
  let currentPath = normPath(location.href);
  let navToken = 0;

  const scrollToHashOrTop = (href) => {
    const hash = new URL(href, location.href).hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  };

  const navigateTo = async (href, push) => {
    const token = ++navToken;
    document.body.classList.add("spa-active");

    let html;
    try {
      const res = await fetch(href);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      html = await res.text();
    } catch (err) {
      window.location.href = href;
      return;
    }
    if (token !== navToken) return;

    const doc = new DOMParser().parseFromString(html, "text/html");
    const incoming = doc.querySelector("main");
    const current = document.querySelector("main");
    if (!incoming || !current) {
      window.location.href = href;
      return;
    }

    absolutize(incoming, href);
    const imported = document.importNode(incoming, true);
    imported.classList.add("page-enter");
    current.replaceWith(imported);
    imported.addEventListener(
      "animationend",
      () => imported.classList.remove("page-enter"),
      { once: true }
    );

    document.title = doc.title || document.title;
    if (push) history.pushState({ spa: true }, "", href);
    currentPath = normPath(href);

    setActiveNav(href);
    updatePill(true);
    initPageFeatures();
    closeMenu();
    scrollToHashOrTop(href);
  };

  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const link = event.target.closest("a");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;

    const isHtml = url.pathname.endsWith(".html") || url.pathname.endsWith("/");
    if (!isHtml) return;

    if (normPath(url.href) === currentPath && url.hash) return;

    event.preventDefault();

    if (normPath(url.href) === currentPath && !url.hash) return;

    navigateTo(url.href, true);
  });

  window.addEventListener("popstate", () => {
    if (normPath(location.href) === currentPath) {
      scrollToHashOrTop(location.href);
    } else {
      navigateTo(location.href, false);
    }
  });

  /* ==================== Initial page setup ==================== */
  setActiveNav(location.href);

  if (document.fonts && document.fonts.status !== "loaded") {
    document.fonts.ready.then(() => updatePill(false));
  } else {
    updatePill(false);
  }

  initPageFeatures();
});

window.addEventListener("pageshow", () => {
  document.body.classList.remove("exit");
});
