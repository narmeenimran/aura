// app.js — full navigation system with iOS-style slide transitions

import { initHome } from "./modules/home.js";
import { initFlashcards } from "./modules/flashcards.js";
import { initNotes } from "./modules/notes.js";
import { initTimer } from "./modules/timer.js";
import { initProfile } from "./modules/profile.js";

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
const changeNameBtn = document.getElementById("settings-change-name");

const profileButton = document.getElementById("profile-button");

/* -----------------------------------------------------------
   NAME STORAGE
----------------------------------------------------------- */

function loadName() {
  return localStorage.getItem("aura_username") || null;
}

function saveName(name) {
  localStorage.setItem("aura_username", name);
}

export function updateGreeting() {
  const name = loadName();
  if (name && homeGreeting) {
    homeGreeting.textContent = `hello, ${name.toLowerCase()}`;
  } else if (homeGreeting) {
    homeGreeting.textContent = "hello,";
  }
}

/* -----------------------------------------------------------
   ONBOARDING
----------------------------------------------------------- */

function handleOnboarding() {
  const saved = loadName();

  if (saved) {
    onboardingScreen.style.display = "none";
    appRoot.style.display = "flex";
    updateGreeting();
    return;
  }

  onboardingSubmit.addEventListener("click", () => {
    const name = onboardingInput.value.trim();
    if (!name) return;

    saveName(name);
    updateGreeting();

    onboardingScreen.style.display = "none";
    appRoot.style.display = "flex";
  });
}

/* -----------------------------------------------------------
   CHANGE NAME (SETTINGS)
----------------------------------------------------------- */

function initChangeName() {
  changeNameBtn.addEventListener("click", () => {
    const current = loadName() || "";
    const newName = prompt("Enter your new name:", current);
    if (!newName || !newName.trim()) return;

    saveName(newName.trim());
    updateGreeting();
  });
}

/* -----------------------------------------------------------
   NAVIGATION — iOS SLIDE TRANSITIONS
----------------------------------------------------------- */

function switchScreen(target) {
  const newScreen = document.querySelector(`.aura-screen[data-screen="${target}"]`);
  const oldScreen = document.querySelector(".aura-screen.is-active");

  if (newScreen === oldScreen) return;

  // Prepare new screen
  newScreen.classList.add("pre-enter");
  newScreen.style.display = "block";

  requestAnimationFrame(() => {
    oldScreen.classList.add("slide-left");
    newScreen.classList.add("slide-in");
  });

  // After animation ends
  setTimeout(() => {
    oldScreen.classList.remove("is-active", "slide-left");
    oldScreen.style.display = "none";

    newScreen.classList.remove("pre-enter", "slide-in");
    newScreen.classList.add("is-active");
  }, 300);

  // Update navbar + title
  navButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.screenTarget === target);
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

  const saved = localStorage.getItem("aura_theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  }
}

/* -----------------------------------------------------------
   PROFILE BUTTON
----------------------------------------------------------- */

function initProfileButton() {
  profileButton.addEventListener("click", () => {
    const overlay = document.getElementById("profile-overlay");
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
  });
}

/* -----------------------------------------------------------
   INIT APP
----------------------------------------------------------- */

function initApp() {
  handleOnboarding();
  initNavigation();
  initThemeToggle();
  initChangeName();
  initProfileButton();

  // Initialize modules
  initHome();
  initFlashcards();
  initNotes();
  initTimer();
  initProfile();
}

initApp();
