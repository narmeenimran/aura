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
  });
}

function initApp() {
  handleOnboarding();
  initNavigation();
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
