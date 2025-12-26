// app.js — main entry for Aura

import { initIntro } from "./modules/intro.js";
import { initNavigation } from "./modules/navigation.js";

function initAppShell() {
  const appRoot = document.getElementById("app-root");
  if (appRoot) {
    appRoot.setAttribute("aria-hidden", "false");
  }
}

function onDomReady() {
  initAppShell();
  initNavigation();
  initIntro();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", onDomReady);
} else {
  onDomReady();
}
