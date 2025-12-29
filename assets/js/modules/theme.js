import { storage } from "../utils/storage.js";

const THEME_KEY = "aura_theme";

export function initTheme() {
  const root = document.documentElement;
  const settingsToggle = document.getElementById("settings-theme-toggle");

  const saved = storage.get(THEME_KEY);
  const initialTheme = saved === "dark" || saved === "light" ? saved : "light";
  root.setAttribute("data-theme", initialTheme);

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    storage.set(THEME_KEY, theme);
  }

  function toggleTheme() {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  }

  if (settingsToggle) {
    settingsToggle.addEventListener("click", toggleTheme);
  }
}
