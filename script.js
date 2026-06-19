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
      "a, button, .bento-card, .project-card-modern, .project-card, .timeline-item, .evidence-card, .edu-card, .milestone-card, .gallery-item, .skill-card-v2, .quality-card, .about-block, .spm-summary, .skill-tier-header, .feature-card, .tech-concept-item, .contact-pill"
    );
    if (!interactive || interactive.closest("[data-no-squish], .no-squish")) return;

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

  let aboutMorph = null;
  let atTop = true;

  const resetOnTop = () => {
    // Note: card scroll-reveal is intentionally NOT replayed. It plays once per page visit 
    // (fresh load or SPA navigation re-runs setupReveals), not every time the user scrolls back to the top.
    if (aboutMorph) aboutMorph.reset();
  };
  const onScroll = () => {
    scrollTopBtn.classList.toggle("is-visible", window.scrollY > 400);
    const nowTop = window.scrollY <= 2;
    if (nowTop && !atTop) resetOnTop();
    atTop = nowTop;
  };
  let scrollTicking = false;
  const requestScrollUpdate = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      onScroll();
      scrollTicking = false;
    });
  };
  onScroll();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Smooth-scroll triggers
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-scroll-to]");
    if (!trigger) return;
    const target = document.querySelector(trigger.getAttribute("data-scroll-to"));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
   
    let activePath = target;
    if (target.startsWith("/projects/")) activePath = "/projects.html";
    else if (target === "/resume.html") activePath = "/about.html";
    navList?.querySelectorAll("a").forEach((a) => {
      const ap = normPath(a.href);
      const isActive = ap === activePath;
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

  // Split the hero title into per-character spans so a soft blur wave can travel across it. Words stay grouped so they don't wrap mid-word.
  const splitHeroTitle = () => {
    const title = document.querySelector(".hero-title");
    if (!title || title.dataset.split) return;
    title.dataset.split = "1";

    let index = 0;
    const buildWord = (text, isGrad) => {
      const word = document.createElement("span");
      word.className = isGrad ? "hero-word hero-word--grad" : "hero-word";
      for (const ch of text) {
        const c = document.createElement("span");
        c.className = "hero-char";
        c.style.setProperty("--i", index++);
        c.textContent = ch;
        word.appendChild(c);
      }
      return word;
    };

    const frag = document.createDocumentFragment();
    Array.from(title.childNodes).forEach((node) => {
      const isGrad =
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("text-gradient");
      (node.textContent || "").split(/(\s+)/).forEach((part) => {
        if (part === "") return;
        if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
        else frag.appendChild(buildWord(part, isGrad));
      });
    });

    title.textContent = "";
    title.appendChild(frag);
  };

  // Scroll reveal card lists (projects, skills). Cards fade & zoom & unblur as they enter view. Reveal only happens on the way DOWN and is NOT removed
  // when a card leaves, so scrolling up partway never re-triggers it. The reveal is re-armed only when the user returns to the very top (see resetOnTop).
  const REVEAL_SELECTOR =
    ".project-card-modern, .skill-card-v2, .quality-card";
  const revealObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) entry.target.classList.add("in-view");
            });
          },
          { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
        )
      : null;

  const setupReveals = () => {
    if (!revealObserver) return;
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
      if (el.dataset.reveal) return;
      el.dataset.reveal = "1";
      el.classList.add("reveal-item");
      
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("in-view");
      }
      const siblings = Array.from(el.parentElement.children).filter((c) =>
        c.matches(REVEAL_SELECTOR)
      );
      el.style.setProperty("--reveal-i", siblings.indexOf(el));
      revealObserver.observe(el);
    });
  };

  // Hero peek -> About SEAMLESS morph (hopefully). The three peek cards are absolutely positioned in <main> (document space). When the About section is about to be
  // seen, each peek card animates its exact box until it lands on its matching About card. then a crossfade hands off to the real card. 
  // Because both live in document space, the morph stays locked to the cards even while scrolling. Resets at the very top.
  // ggs broder..
  const setupAboutMorph = () => {
    aboutMorph = null;
    const peek = document.querySelector(".scroll-peek");
    const about = document.querySelector("#about");
    const main = document.querySelector(".home-page");
    if (!peek || !about || !main) return;
    const squares = Array.from(peek.querySelectorAll(".peek-card"));
    const cards = Array.from(about.querySelectorAll(".bento-card"));
    if (!squares.length || squares.length !== cards.length) return;

    let morphed = false;
    let revealTimer = null;
    let rests = [];

    const computeRest = () => {
      const mr = main.getBoundingClientRect();
      const mainTopDoc = mr.top + window.scrollY;
      const vw = main.clientWidth;
      const vh = window.innerHeight;
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const cx = vw / 2;

      // Fraction of the card shown above the fold; the rest peeks below it. The
      // deck is ALWAYS clipped by the bottom edge - it never shows in full.
      const PEEK = 0.7;

      // Bottom of the hero CTAs, via layout offsets (robust while the hero
      // entrance still has the CTAs transformed).
      const cta = document.querySelector(".hero-ctas");
      let ctaBottomDoc;
      if (cta) {
        let y = 0;
        let node = cta;
        while (node && node !== main) {
          y += node.offsetTop;
          node = node.offsetParent;
        }
        ctaBottomDoc = mainTopDoc + y + cta.offsetHeight;
      } else {
        ctaBottomDoc = mainTopDoc + vh * 0.72;
      }

      // Clear gap kept between the CTAs and the top of the visible deck, and capped
      // gap between the fanned deck and the screen's side edges.
      const topGap = Math.round(Math.min(Math.max(rem * 1.1, vh * 0.025), rem * 3.5));
      const sideGap = Math.round(Math.min(Math.max(vw * 0.05, 16), 96));

      // Adaptive height: scales with viewport height, width AND font size.
      let h = Math.min(vh * 0.26, vw * 0.18, rem * 13, 230);
      // The VISIBLE part (PEEK*h) must fit between the CTAs (+gap) and the fold
      // Cap the height to guarantee it - on short screens the deck simply shrinks.
      const roomAboveFold = vh - ctaBottomDoc - topGap; // fold at doc y = vh (scrollY 0)
      if (roomAboveFold > 0) h = Math.min(h, roomAboveFold / PEEK);
      h = Math.max(60, h);

      // Width from the aspect ratio, then shrink the WHOLE fan if needed so it
      // keeps the side-edge gaps (rule 2). 0.62 of w covers the rotation overhang.
      let w = h / 0.62;
      // Fan spread grows with screen width (so the trio doesn't look lost in the
      // middle of wide screens), but is shrunk below to honour the side gaps.
      let spread = Math.max(w * 0.58, Math.min(vw * 0.14, 260));
      const maxHalf = vw / 2 - sideGap;
      const deckHalf = spread + w * 0.62;
      if (deckHalf > maxHalf && deckHalf > 0) {
        const k = maxHalf / deckHalf;
        w *= k;
        spread *= k;
        h = w * 0.62;
      }
      w = Math.round(w);
      h = Math.round(h);
      spread = Math.round(spread);
      const drop = Math.round(h * 0.08);

      // Anchor at the bottom edge of the screen: PEEK of the (centre) card shows
      // above the fold, the remainder spills below it. Clamp so the top always
      // stays below the CTAs, even on very short screens
      let topDoc = vh - PEEK * h;
      topDoc = Math.max(topDoc, ctaBottomDoc + topGap);
      const top = topDoc - mainTopDoc;

      rests = [
        { left: cx - w / 2 - spread, top: top + drop, w, h, rot: -11 },
        { left: cx - w / 2, top: top, w, h, rot: 0 },
        { left: cx - w / 2 + spread, top: top + drop, w, h, rot: 11 },
      ];
    };

    const applyRest = (animate) => {
      squares.forEach((s, i) => {
        const r = rests[i];
        if (!r) return;
        if (!animate) s.style.transition = "none";
        s.style.left = `${r.left}px`;
        s.style.top = `${r.top}px`;
        s.style.width = `${r.w}px`;
        s.style.height = `${r.h}px`;
        s.style.transform = `rotate(${r.rot}deg)`;
        s.style.opacity = "";
        if (!animate) {
          void s.offsetWidth;
          s.style.transition = "";
        }
      });
    };

    // Lock each peek card onto its matching About card's exact box. 
    // Used by the morph and, on resize, to keep the deck tracking the About cards in real time.
    const positionOnAbout = (animate) => {
      const mr = main.getBoundingClientRect();
      squares.forEach((s, i) => {
        const r = cards[i].getBoundingClientRect();
        if (!animate) s.style.transition = "none";
        s.style.left = `${r.left - mr.left}px`;
        s.style.top = `${r.top - mr.top}px`;
        s.style.width = `${r.width}px`;
        s.style.height = `${r.height}px`;
        s.style.transform = "rotate(0deg)";
        if (!animate) {
          void s.offsetWidth;
          s.style.transition = "";
        }
      });
    };

    let placed = false;
    let lastResetT = 0;
    const measure = (animate) => {
      computeRest();
      if (morphed) {
        // Keep the deck glued to the (re-laid-out) About cards while resizing.
        positionOnAbout(animate);
      } else {
        applyRest(animate && placed);
        placed = true;
      }
    };

    const doMorph = () => {
      if (morphed) return;
      if (window.scrollY < 40 && performance.now() - lastResetT < 400) return;
      morphed = true;
      peek.classList.add("peek-morphing");
      positionOnAbout(true);
      clearTimeout(revealTimer);

      revealTimer = setTimeout(() => {
        about.classList.add("about-revealed");
        peek.classList.add("peek-gone");
      }, 700);
    };

    // Reverse morph (on returning to the very top): the About cards fade out and
    // the peek cards fade back in over their boxes, then glide back to the resting fanned peek.
    const reset = () => {
      if (!morphed) return;
      morphed = false;
      lastResetT = performance.now();
      clearTimeout(revealTimer);
      about.classList.remove("about-revealed");
      peek.classList.remove("peek-gone");
      applyRest(true);

      setTimeout(() => {
        if (!morphed) peek.classList.remove("peek-morphing");
      }, 700);
    };

    measure();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) doMorph();
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(about);

    aboutMorph = { reset, measure };
  };

  /* ==================== Page features (re-bound after each swap) ==================== */
  const initPageFeatures = () => {
    splitHeroTitle();
    setupReveals();
    setupAboutMorph();

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

    // SPM subject breakdown dropdown: animate open AND close every time it's toggled
    document.querySelectorAll(".spm-details").forEach((details) => {
      if (details.dataset.bound) return;
      details.dataset.bound = "1";
      const summary = details.querySelector(".spm-summary");
      const content = details.querySelector(".spm-content");
      if (!summary || !content) return;

      summary.addEventListener("click", (event) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        event.preventDefault();
        if (content.dataset.animating) return;

        const play = (name, dur) => {
          content.style.animation = "none";
          void content.offsetWidth; // restart the animation
          content.style.animation = `${name} ${dur}`;
        };

        if (details.open) {
          content.dataset.animating = "1";
          play("spmCollapse", "0.35s ease forwards");
          content.addEventListener(
            "animationend",
            () => {
              details.open = false;
              content.style.animation = "";
              delete content.dataset.animating;
            },
            { once: true }
          );
        } else {
          details.open = true;
          play("spmExpand", "0.45s cubic-bezier(0.22, 1, 0.36, 1)");
          content.addEventListener(
            "animationend",
            () => {
              content.style.animation = "";
            },
            { once: true }
          );
        }
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

        const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
        const body = encodeURIComponent(
          [
            "Hi Uzair,",
            "",
            message,
            "",
            "——————————————————",
            `Name:   ${name}`,
            `Email:  ${email}`,
            "",
            "Sent from your portfolio contact form.",
          ].join("\r\n")
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

  // Expanded footer. Built once, the footer lives outside <main>, so its consistent across SPA navigations.
  const setupFooter = () => {
    const footer = document.querySelector("footer");
    if (!footer || footer.dataset.expanded) return;
    footer.dataset.expanded = "1";
    footer.classList.add("site-footer");

    const logoHref = document.querySelector(".logo a")?.href || location.href;
    const u = (rel) => new URL(rel, logoHref).href;
    const links = [
      ["Home", "index.html"],
      ["About Me", "about.html"],
      ["Education", "education.html"],
      ["Projects", "projects.html"],
      ["Skills", "qualities.html"],
      ["Contact", "contact.html"],
    ]
      .map(([label, rel]) => `<li><a href="${u(rel)}">${label}</a></li>`)
      .join("");

    const catSvg = `
      <svg class="footer-cat-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path class="cat-fur" d="M24 40 L17 15 L43 30 Z"/>
        <path class="cat-fur" d="M76 40 L83 15 L57 30 Z"/>
        <path class="cat-ear-in" d="M26 38 L21 21 L39 31 Z"/>
        <path class="cat-ear-in" d="M74 38 L79 21 L61 31 Z"/>
        <ellipse class="cat-fur cat-head" cx="50" cy="58" rx="35" ry="31"/>
        <g class="cat-whiskers">
          <line class="cat-whisker" x1="7" y1="56" x2="26" y2="58"/>
          <line class="cat-whisker" x1="7" y1="64" x2="26" y2="63"/>
          <line class="cat-whisker" x1="93" y1="56" x2="74" y2="58"/>
          <line class="cat-whisker" x1="93" y1="64" x2="74" y2="63"/>
        </g>
        <circle class="cat-blush" cx="28" cy="64" r="5.5"/>
        <circle class="cat-blush" cx="72" cy="64" r="5.5"/>
        <g class="cat-eye cat-eye-l">
          <ellipse class="cat-eye-white" cx="37" cy="54" rx="8" ry="10"/>
          <circle class="cat-pupil" cx="37" cy="55" r="4"/>
        </g>
        <g class="cat-eye cat-eye-r">
          <ellipse class="cat-eye-white" cx="63" cy="54" rx="8" ry="10"/>
          <circle class="cat-pupil" cx="63" cy="55" r="4"/>
        </g>
        <path class="cat-eye-happy" d="M30 56 q7 -8 14 0"/>
        <path class="cat-eye-happy" d="M56 56 q7 -8 14 0"/>
        <path class="cat-brow" d="M28 41 L45 47"/>
        <path class="cat-brow" d="M72 41 L55 47"/>
        <path class="cat-nose" d="M46 62 H54 L50 67 Z"/>
        <path class="cat-mouth mouth-neutral" d="M50 67 q-5 5 -10 1 M50 67 q5 5 10 1"/>
        <path class="cat-mouth mouth-happy" d="M38 68 q12 11 24 0"/>
        <path class="cat-mouth mouth-angry" d="M40 74 q10 -7 20 0"/>
        <ellipse class="cat-mouth mouth-scared" cx="50" cy="72" rx="5" ry="7"/>
        <path class="cat-sweat" d="M84 39 q-4 7 0 11 q4 -4 0 -11 Z"/>
      </svg>`;

    footer.innerHTML = `
      <div class="footer-inner">
        <div class="footer-col footer-about">
          <h4>zaiki's Portfolio</h4>
          <p>A personal portfolio showcasing my projects, skills, and journey as
          an aspiring web &amp; app developer - built with a focus on clean,
          minimalist, and functional UI/UX.</p>
          <p class="footer-credit">Designed &amp; built by Muhd Uzair (zaiki).</p>
        </div>
        <div class="footer-col footer-links-col">
          <h4>Quick Links</h4>
          <ul class="footer-links">${links}</ul>
        </div>
        <div class="footer-col footer-cat-col">
          <button class="footer-cat" type="button" aria-label="Pet the cat">${catSvg}</button>
          <span class="footer-cat-hint">
            hover only, no clicking me!
          </span>
        </div>
      </div>
      <div class="footer-bottom"><small>&copy; 2026 zaiki. All Rights Reserved.</small></div>`;

    const cat = footer.querySelector(".footer-cat");
    const pupils = footer.querySelectorAll(".cat-pupil");
    let catTimer = null;

    const tempMood = (cls, ms) => {
      cat.classList.remove("cat--happy", "cat--angry", "cat--scared", "cat--react");
      cat.classList.add(cls);
      clearTimeout(catTimer);
      catTimer = setTimeout(() => {
        cat.classList.remove(cls);
        if (cat.matches(":hover")) cat.classList.add("cat--happy");
      }, ms);
    };

    cat.addEventListener("mouseenter", () => {
      if (!cat.classList.contains("cat--angry") && !cat.classList.contains("cat--scared")) {
        cat.classList.add("cat--happy");
      }
    });
    cat.addEventListener("mouseleave", () => cat.classList.remove("cat--happy"));
    cat.addEventListener("click", (event) => {
      event.preventDefault();
      tempMood(Math.random() < 0.5 ? "cat--angry" : "cat--scared", 1200);
    });

    // Reacting to any footer link click
    footer.addEventListener("click", (event) => {
      if (event.target.closest("a")) tempMood("cat--react", 750);
    });

    // Eyes track the cursor
    document.addEventListener(
      "mousemove",
      (event) => {
        const r = cat.getBoundingClientRect();
        if (!r.width) return;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const ang = Math.atan2(event.clientY - cy, event.clientX - cx);
        const dist = Math.min(3.2, Math.hypot(event.clientX - cx, event.clientY - cy) / 50);
        const dx = (Math.cos(ang) * dist).toFixed(2);
        const dy = (Math.sin(ang) * dist).toFixed(2);
        pupils.forEach((p) => p.setAttribute("transform", `translate(${dx} ${dy})`));
      },
      { passive: true }
    );
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
  setupFooter();

  const afterLayout = () => {
    updatePill(false);
    if (aboutMorph) aboutMorph.measure();
  };
  window.addEventListener("resize", () => {
    if (aboutMorph) aboutMorph.measure(true);
  });

  initPageFeatures();

  if (document.fonts && document.fonts.status !== "loaded") {
    document.fonts.ready.then(afterLayout);
  } else {
    afterLayout();
  }
  window.addEventListener("load", afterLayout);
});

window.addEventListener("pageshow", () => {
  document.body.classList.remove("exit");
});
