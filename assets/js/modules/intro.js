export function initIntro() {
  const splash = document.getElementById("aura-splash");
  const intro = document.getElementById("intro-screen");
  const appRoot = document.getElementById("app-root");

  if (!splash || !intro || !appRoot) {
    return;
  }

  window.setTimeout(() => {
    splash.classList.add("is-hidden");
    intro.classList.add("is-visible");

    window.setTimeout(() => {
      intro.classList.remove("is-visible");
      intro.classList.add("is-hidden");
      appRoot.setAttribute("aria-hidden", "false");
    }, 1300);
  }, 800);
}
