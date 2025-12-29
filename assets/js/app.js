import { initHome } from "./modules/home.js";
import { initFlashcards } from "./modules/flashcards.js";
import { initNotes } from "./modules/notes.js";
import { initTimer } from "./modules/timer.js";
import { initProfile } from "./modules/profile.js";

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
const swipeLayer = document.getElementById("swipe-layer");

function loadName() {
  return localStorage.getItem("aura_username") || null;
}

function saveName(name) {
  localStorage.setItem("aura_username", name);
}

export function updateGreeting() {
  const name = loadName();
  homeGreeting.textContent = name ? `hello, ${name.toLowerCase()}` : "hello,";
}

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

function initChangeName() {
  changeNameBtn.addEventListener("click", () => {
    const current = loadName() || "";
    const newName = prompt("Enter your new name:", current);
    if (!newName || !newName.trim()) return;

    saveName(newName.trim());
    updateGreeting();
  });
}

function vibrate(ms = 10) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

let currentScreen = "home";

function switchScreen(target) {
  if (target === currentScreen) return;

  const newScreen = document.querySelector(`.aura-screen[data-screen="${target}"]`);
  const oldScreen = document.querySelector(`.aura-screen[data-screen="${currentScreen}"]`);

  if (!newScreen || !oldScreen) return;

  vibrate(10);

  oldScreen.classList.remove("is-active");
  newScreen.classList.add("is-active");

  currentScreen = target;

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

let startX = 0;
let isSwiping = false;

const screenOrder = ["home", "flashcards", "notes", "timer", "settings"];

function getNextScreen(direction) {
  const index = screenOrder.indexOf(currentScreen);
  if (direction === "left") {
    return screenOrder[index + 1] || null;
  } else {
    return screenOrder[index - 1] || null;
  }
}

function initSwipeNavigation() {
  swipeLayer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  swipeLayer.addEventListener("touchend", (e) => {
    if (!isSwiping) return;
    isSwiping = false;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) < 40) return;

    if (diff < 0) {
      const next = getNextScreen("left");
      if (next) {
        vibrate(15);
        switchScreen(next);
      }
    } else {
      const prev = getNextScreen("right");
      if (prev) {
        vibrate(15);
        switchScreen(prev);
      }
    }
  });
}

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

function initProfileButton() {
  profileButton.addEventListener("click", () => {
    const overlay = document.getElementById("profile-overlay");
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    vibrate(10);
  });
}

function initApp() {
  handleOnboarding();
  initNavigation();
  initSwipeNavigation();
  initThemeToggle();
  initChangeName();
  initProfileButton();

  initHome();
  initFlashcards();
  initNotes();
  initTimer();
  initProfile();
}

initApp();
