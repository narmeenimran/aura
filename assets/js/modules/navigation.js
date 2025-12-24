// navigation.js — handles switching between screens + nav state

export function initNavigation() {
  const screens = document.querySelectorAll(".aura-screen");
  const navItems = document.querySelectorAll(".aura-bottom-nav-item");
  const topbarTitle = document.getElementById("topbar-title");

  function showScreen(name) {
    // Hide all screens
    screens.forEach((s) => s.classList.remove("aura-screen-active"));

    // Show target screen
    const target = document.querySelector(`[data-screen="${name}"]`);
    if (target) {
      target.classList.add("aura-screen-active");
    }

    // Update topbar title
    if (topbarTitle) {
      const navBtn = document.querySelector(
        `.aura-bottom-nav-item[data-screen-target="${name}"]`
      );
      if (navBtn) {
        topbarTitle.textContent = navBtn.textContent.trim();
      }
    }

    // Update bottom nav active state
    navItems.forEach((btn) => {
      btn.classList.remove("aura-bottom-nav-item-active");
      if (btn.getAttribute("data-screen-target") === name) {
        btn.classList.add("aura-bottom-nav-item-active");
      }
    });
  }

  // Bottom nav click handling
  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-screen-target");
      if (target) showScreen(target);
    });
  });

  // Buttons inside the UI that navigate to screens
  document.querySelectorAll("[data-nav-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav-target");
      if (target) showScreen(target);
    });
  });

  // Default screen
  showScreen("home");
}
