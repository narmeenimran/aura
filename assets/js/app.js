// app.js — navigation, onboarding, theme toggle, module init

import { initFlashcards } from "./modules/flashcards.js";
import { initHome, updateHomeStats } from "./modules/home.js";
import { initNotes } from "./modules/notes.js";
import { initTimer } from "./modules/timer.js";

/* -----------------------------------------------------------
   ELEMENTS
----------------------------------------------------------- */

const onboardingScreen = document.getElementById("onboarding-screen");
const onboardingInput = document.getElementById("onboarding-name-input");
const onboardingSubmit = document.getElementById("onboarding-submit");

const appRoot = document.getElementById("app-root");
const homeGreeting = document.getElementById("home-greeting");

const navButtons = document.querySelectorAll("[data-screen-target]");
const screens = document.querySelectorAll(".aura-screen");
const topbarTitle = document.getElementById("topbar-title");

const themeToggle = document.getElementById("settings-theme-toggle");

/* -----------------------------------------------------------
   ONBOARDING — ASK NAME
----------------------------------------------------------- */

function loadName() {
  return localStorage.getItem("aura_username") || null;
}

function saveName(name) {
  localStorage.setItem("aura_username", name);
}

function showGreeting() {
  const name = loadName();
  if (name && homeGreeting) {
    homeGreeting.textContent = `hello, ${name.toLowerCase()}`;
  }
}

function handleOnboarding() {
  const saved = loadName();

  if (saved) {
    onboardingScreen.style.display = "none";
    appRoot.style.display = "flex";
    showGreeting();
    return;
  }

  onboardingSubmit.addEventListener("click", () => {
    const name = onboardingInput.value.trim();
    if (!name) return;

    saveName(name);
    showGreeting();

    onboardingScreen.style.display = "none";
    appRoot.style.display = "flex";
  });
}

/* -----------------------------------------------------------
   NAVIGATION
----------------------------------------------------------- */

function switchScreen(target) {
  screens.forEach((screen) => {
    screen.classList.remove("is-active");
    if (screen.dataset.screen === target) {
      screen.classList.add("is-active");
    }
  });

  navButtons.forEach((btn) => {
    btn.classList.remove("is-active");
    if (btn.dataset.screenTarget === target) {
      btn.classList.add("is-active");
    }
  });

  topbarTitle.textContent = target.charAt(0).toUpperCase() + target.slice(1);
}

function initNavigation() {
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.screenTarget;
      switchScreen(target);
    });
  });
}

/* -----------------------------------------------------------
   THEME TOGGLE
----------------------------------------------------------- */

function initThemeToggle() {
  themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    localStorage.setItem("aura_theme", next);
  });

  // Load saved theme
  const saved = localStorage.getItem("aura_theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  }
}

/* -----------------------------------------------------------
   INIT APP
----------------------------------------------------------- */

function initApp() {
  handleOnboarding();
  initNavigation();
  initThemeToggle();

  // Initialize modules
  initHome();
  initFlashcards();
  initNotes();
  initTimer();

  updateHomeStats();
}

initApp();
