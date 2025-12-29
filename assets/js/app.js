import { initIntro } from "./modules/intro.js";
import { initNavigation } from "./modules/navigation.js";
import { initTheme } from "./modules/theme.js";
import { initPomodoro } from "./modules/pomodoro.js";
import { initFlashcards } from "./modules/flashcards.js";
import { initNotes } from "./modules/notes.js";
import { initHome } from "./modules/home.js";

function initAppShell() {
  const appRoot = document.getElementById("app-root");
  if (appRoot) {
    appRoot.setAttribute("aria-hidden", "false");
  }
}

function onDomReady() {
  initAppShell();
  initTheme();
  initNavigation();
  initPomodoro();
  initFlashcards();
  initNotes();
  initHome();
  initIntro();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", onDomReady);
} else {
  onDomReady();
}
