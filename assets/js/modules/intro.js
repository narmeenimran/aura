// intro.js — handles splash + intro animations

export function initIntro() {
  const splash = document.getElementById("aura-splash");
  const intro = document.getElementById("intro-screen");
  const app = document.getElementById("app-shell");

  if (!splash || !intro || !app) return;

  // Splash is handled mostly by CSS animation.
  // After splash fades, show intro.
  setTimeout(() => {
    splash.style.display = "none";
    intro.classList.add("aura-intro-active");

    // After intro shows, fade it out
    setTimeout(() => {
      intro.classList.add("aura-intro-fade-out");

      setTimeout(() => {
        intro.style.display = "none";
        app.classList.add("aura-app-active");
        app.removeAttribute("aria-hidden");
      }, 500);
    }, 900);
  }, 900);
}
