// pomodoro.js — focus timer system

import { storage } from "../utils/storage.js";

export function initPomodoro() {
  const timeEl = document.getElementById("pomodoro-time");
  const modeLabel = document.getElementById("pomodoro-mode-label");
  const toggleBtn = document.getElementById("pomodoro-toggle");
  const resetBtn = document.getElementById("pomodoro-reset");

  const presetGroups = document.querySelectorAll(".pomodoro-segment-group");
  const customOverlay = document.getElementById("pomodoro-custom-overlay");
  const customInput = document.getElementById("pomodoro-custom-mins");
  const customSave = document.getElementById("save-pomodoro-custom");
  const customClose = document.getElementById("close-pomodoro-custom");

  const homePreview = document.getElementById("home-focus-time");

  if (!timeEl || !toggleBtn) return;

  // Default settings
  let duration = storage.get("pomodoro_duration") || 25 * 60;
  let remaining = duration;
  let running = false;
  let interval = null;

  function format(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateUI() {
    timeEl.textContent = format(remaining);
    if (homePreview) homePreview.textContent = format(remaining);
  }

  function start() {
    if (running) return;
    running = true;
    toggleBtn.textContent = "Pause";

    interval = setInterval(() => {
      remaining -= 1;
      updateUI();

      if (remaining <= 0) {
        clearInterval(interval);
        running = false;
        toggleBtn.textContent = "Start";
        remaining = duration;
        updateUI();
      }
    }, 1000);
  }

  function pause() {
    running = false;
    toggleBtn.textContent = "Start";
    clearInterval(interval);
  }

  function reset() {
    pause();
    remaining = duration;
    updateUI();
  }

  function setDuration(mins) {
    duration = mins * 60;
    remaining = duration;
    storage.set("pomodoro_duration", duration);
    updateUI();
  }

  // Toggle start/pause
  toggleBtn.addEventListener("click", () => {
    running ? pause() : start();
  });

  // Reset
  resetBtn.addEventListener("click", reset);

  // Presets
  presetGroups.forEach((group) => {
    group.querySelectorAll(".pomodoro-segment").forEach((btn) => {
      btn.addEventListener("click", () => {
        group.querySelectorAll(".pomodoro-segment").forEach((b) =>
          b.classList.remove("pomodoro-segment-active")
        );

        btn.classList.add("pomodoro-segment-active");

        const mins = btn.getAttribute("data-mins");

        if (mins === "custom") {
          customOverlay.classList.add("aura-overlay-active");
          customOverlay.removeAttribute("aria-hidden");
        } else {
          setDuration(parseInt(mins, 10));
        }
      });
    });
  });

  // Custom modal
  customSave.addEventListener("click", () => {
    const mins = parseInt(customInput.value, 10);
    if (!isNaN(mins) && mins > 0) {
      setDuration(mins);
    }
    customOverlay.classList.remove("aura-overlay-active");
    customOverlay.setAttribute("aria-hidden", "true");
  });

  customClose.addEventListener("click", () => {
    customOverlay.classList.remove("aura-overlay-active");
    customOverlay.setAttribute("aria-hidden", "true");
  });

  // Initial UI
  updateUI();
}
