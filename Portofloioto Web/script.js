const navIntroKey = "navIntroPlayed:v2";
const navigationEntry = performance.getEntriesByType("navigation")[0];

if (navigationEntry?.type === "reload") {
  sessionStorage.removeItem(navIntroKey);
}

if (!sessionStorage.getItem(navIntroKey)) {
  document.body.classList.add("nav-intro");
  sessionStorage.setItem(navIntroKey, "true");
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const label = toggleBtn?.querySelector(".label");

  const setDark = () => {
    document.body.classList.remove("light");
    if (label) label.textContent = "Theme Light";
    localStorage.setItem("theme", "dark");
  };

  const setLight = () => {
    document.body.classList.add("light");
    if (label) label.textContent = "Theme Dark";
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

  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const nav = document.querySelector("nav");

  const openMenu = () => {
    nav.classList.add("menu-open");
    document.body.classList.add("nav-menu-open");
  };

  const closeMenu = () => {
    nav.classList.remove("menu-open");
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

  const handleNavigation = (event) => {
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
    if (!link || link.hasAttribute("hidden") || !link.href) return;

    const href = link.href;
    if (href.includes(window.location.origin) && !href.includes("#")) {
      event.preventDefault();
      document.body.classList.add("exit");
      setTimeout(() => {
        window.location.href = href;
      }, 550);
    }
  };

  document.addEventListener("click", handleNavigation);

  document.querySelectorAll("[data-print]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });

  // CGPA bars interactive click animation
  document.querySelectorAll(".cgpa-bar-wrap").forEach((bar) => {
    bar.addEventListener("click", () => {
      bar.classList.remove("clicked");
      void bar.offsetWidth; // Force element reflow to restart CSS animation
      bar.classList.add("clicked");
    });
    // Remove the class when animation completes
    bar.addEventListener("animationend", () => {
      bar.classList.remove("clicked");
    });
  });

  // Global click handler for squish click animation
  document.addEventListener("click", (event) => {
    const interactive = event.target.closest(
      "a, button, .milestone-card, .spm-summary, .skill-tier-header, .project-card, .edu-card"
    );
    // Exclude if it has the data attribute
    if (!interactive || interactive.hasAttribute("data-no-squish")) return;
  
    interactive.classList.remove("ui-clicked");
    void interactive.offsetWidth; 
    interactive.classList.add("ui-clicked");
  });

  document.addEventListener("animationend", (event) => {
    if (event.target.classList.contains("ui-clicked")) {
      event.target.classList.remove("ui-clicked");
    }
  });
});
