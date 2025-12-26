// navigation.js — handles switching screens and syncing nav (sidebar + bottom nav)

export function initNavigation() {
  const screens = Array.from(
    document.querySelectorAll(".aura-screen[data-screen]")
  );
  const sidebarItems = Array.from(
    document.querySelectorAll(".sidebar-item[data-screen-target]")
  );
  const bottomNavItems = Array.from(
    document.querySelectorAll(".bottom-nav-item[data-screen-target]")
  );
  const topbarTitle = document.getElementById("topbar-title");

  if (!screens.length) {
    return;
  }

  function setActiveScreen(targetScreen) {
    if (!targetScreen) return;

    // Screens
    screens.forEach((screen) => {
      const isTarget = screen.dataset.screen === targetScreen;
      screen.classList.toggle("is-active", isTarget);
    });

    // Sidebar
    sidebarItems.forEach((btn) => {
      const isActive = btn.dataset.screenTarget === targetScreen;
      btn.classList.toggle("is-active", isActive);
    });

    // Bottom nav
    bottomNavItems.forEach((btn) => {
      const isActive = btn.dataset.screenTarget === targetScreen;
      btn.classList.toggle("is-active", isActive);
    });

    // Topbar title
    if (topbarTitle) {
      const label =
        targetScreen.charAt(0).toUpperCase() + targetScreen.slice(1);
      topbarTitle.textContent = label;
    }
  }

  function handleNavClick(evt) {
    const target = evt.currentTarget;
    const screenTarget = target.dataset.screenTarget;
    if (!screenTarget) return;
    setActiveScreen(screenTarget);
  }

  // Attach listeners
  sidebarItems.forEach((btn) => {
    btn.addEventListener("click", handleNavClick);
  });

  bottomNavItems.forEach((btn) => {
    btn.addEventListener("click", handleNavClick);
  });

  // Also allow in-screen buttons with data-screen-target
  document.addEventListener("click", (evt) => {
    const el = evt.target;
    if (!(el instanceof HTMLElement)) return;
    const screenTarget = el.dataset.screenTarget;
    if (!screenTarget) return;
    setActiveScreen(screenTarget);
  });

  // Initial active screen
  const initial =
    sidebarItems.find((b) => b.classList.contains("is-active"))?.dataset
      .screenTarget ||
    bottomNavItems.find((b) => b.classList.contains("is-active"))?.dataset
      .screenTarget ||
    screens[0].dataset.screen;

  setActiveScreen(initial);
}
