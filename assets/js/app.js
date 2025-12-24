// app.js — ES module entry for Aura
// Imports modules and initializes the app shell

import { initIntro } from "./modules/intro.js";
import { initNavigation } from "./modules/navigation.js";
import { initTheme } from "./modules/theme.js";
import { initFlashcards } from "./modules/flashcards.js";
import { initNotes } from "./modules/notes.js";
import { initPomodoro } from "./modules/pomodoro.js";
import { storage } from "./utils/storage.js";


const SELECTORS = {
  splash: "#aura-splash",
  intro: "#intro-screen",
  appShell: "#app-shell",
  topbarTitle: "#topbar-title",
  bottomNavItems: ".aura-bottom-nav-item",
};

function showAppShell() {
  const splash = document.querySelector(SELECTORS.splash);
  const intro = document.querySelector(SELECTORS.intro);
  const app = document.querySelector(SELECTORS.appShell);

  // Hide splash immediately (splash animation already set in CSS)
  if (splash) {
    splash.style.display = "none";
  }

  // Show intro briefly, then show app
  if (intro) {
    intro.classList.add("aura-intro-active");
    setTimeout(() => {
      intro.classList.add("aura-intro-fade-out");
      setTimeout(() => {
        intro.style.display = "none";
        app.classList.add("aura-app-active");
        app.removeAttribute("aria-hidden");
      }, 420);
    }, 900); // keep intro visible for a short moment
  } else {
    app.classList.add("aura-app-active");
    app.removeAttribute("aria-hidden");
  }
}

function restoreThemeFromStorage() {
  const saved = storage.get("theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  } else {
    // default to dark
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

function wireGlobalShortcuts() {
  // Theme toggle button
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      storage.set("theme", next);
    });
  }

  // Bottom nav items update topbar title
  document.querySelectorAll(SELECTORS.bottomNavItems).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = btn.getAttribute("data-screen-target");
      const titleEl = document.querySelector(SELECTORS.topbarTitle);
      if (titleEl && target) {
        const label = btn.textContent.trim();
        titleEl.textContent = label || titleEl.textContent;
      }
    });
  });
}

function boot() {
  // Restore theme early
  restoreThemeFromStorage();

  // Initialize modules
  initIntro();
  initTheme();
  initNavigation();
  initFlashcards();
  initNotes();
  initPomodoro();

  // Wire global UI bits
  wireGlobalShortcuts();

  // Show app after a short delay so splash/intro animations feel natural
  window.addEventListener("load", () => {
    setTimeout(showAppShell, 600);
  });

  // Register service worker if available
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch(() => {
        // silent fail — service worker optional for now
      });
  }
}

// Start
boot();
