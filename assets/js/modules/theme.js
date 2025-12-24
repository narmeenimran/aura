// theme.js — handles theme switching + persistence

import { storage } from "../utils/storage.js";

export function initTheme() {
  const root = document.documentElement;
  const settingsToggle = document.getElementById("settings-theme-toggle");
  const topbarToggle = document.getElementById("theme-toggle");

  // Load saved theme
  const saved = storage.get("theme");
  if (saved) {
    root.setAttribute("data-theme", saved);
  }

  function toggleTheme() {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    storage.set("theme", next);
  }

  // Top bar toggle
  if (topbarToggle) {
    topbarToggle.addEventListener("click", toggleTheme);
  }

  // Settings screen toggle
  if (settingsToggle) {
    settingsToggle.addEventListener("click", toggleTheme);
  }
}
