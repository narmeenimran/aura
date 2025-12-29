// timer.js — Pomodoro logic + custom duration + saving focus minutes

import { storage } from "../utils/storage.js";
import { updateHomeStats } from "./home.js";

const FOCUS_MIN_KEY = "aura_focus_minutes_today";

let mode = "focus";
let durations = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

let remaining = durations.focus;
let interval = null;

// Elements
let timeEl;
let modeLabelEl;
let toggleBtn;
let resetBtn;
let customOpenBtn;
let customOverlay;
let customInput;
let customSaveBtn;
let customCloseBtn;

/* -----------------------------------------------------------
   TODAY KEY
----------------------------------------------------------- */

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/* -----------------------------------------------------------
   UPDATE DISPLAY
----------------------------------------------------------- */

function updateDisplay() {
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  timeEl.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  modeLabelEl.textContent = mode === "focus" ? "Focus" :
                            mode === "shortBreak" ? "Short break" :
                            "Long break";
}

/* -----------------------------------------------------------
   START / STOP
----------------------------------------------------------- */

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    remaining--;

    if (remaining <= 0) {
      clearInterval(interval);
      interval = null;

      if (mode === "focus") {
        saveFocusMinutes(durations.focus / 60);
      }

      remaining = durations[mode];
    }

    updateDisplay();
  }, 1000);

  toggleBtn.textContent = "Pause";
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
  toggleBtn.textContent = "Start";
}

function toggleTimer() {
  if (interval) stopTimer();
  else startTimer();
}

/* -----------------------------------------------------------
   RESET
----------------------------------------------------------- */

function resetTimer() {
  stopTimer();
  remaining = durations[mode];
  updateDisplay();
}

/* -----------------------------------------------------------
   SAVE FOCUS MINUTES
----------------------------------------------------------- */

function saveFocusMinutes(mins) {
  const map = storage.get(FOCUS_MIN_KEY) || {};
  const today = getTodayKey();

  map[today] = (map[today] || 0) + mins;

  storage.set(FOCUS_MIN_KEY, map);
  updateHomeStats();
}

/* -----------------------------------------------------------
   SWITCH MODE
----------------------------------------------------------- */

function switchMode(newMode) {
  mode = newMode;
  remaining = durations[mode];
  stopTimer();
  updateDisplay();
}

/* -----------------------------------------------------------
   CUSTOM DURATION
----------------------------------------------------------- */

function openCustom() {
  customOverlay.classList.add("is-visible");
  customOverlay.setAttribute("aria-hidden", "false");
}

function closeCustom() {
  customOverlay.classList.remove("is-visible");
  customOverlay.setAttribute("aria-hidden", "true");
}

function saveCustom() {
  const mins = Number(customInput.value);
  if (!mins || mins < 1) return;

  durations[mode] = mins * 60;
  remaining = durations[mode];

  updateDisplay();
  closeCustom();
}

/* -----------------------------------------------------------
   INIT
----------------------------------------------------------- */

export function initTimer() {
  timeEl = document.getElementById("pomodoro-time");
  modeLabelEl = document.getElementById("pomodoro-mode-label");
  toggleBtn = document.getElementById("pomodoro-toggle");
  resetBtn = document.getElementById("pomodoro-reset");
  customOpenBtn = document.getElementById("pomodoro-custom-open");

  customOverlay = document.getElementById("pomodoro-custom-overlay");
  customInput = document.getElementById("pomodoro-custom-mins");
  customSaveBtn = document.getElementById("save-pomodoro-custom");
  customCloseBtn = document.getElementById("close-pomodoro-custom");

  // Mode tabs
  document.querySelectorAll(".timer-mode-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".timer-mode-tab").forEach((b) =>
        b.classList.remove("is-active")
      );
      btn.classList.add("is-active");

      switchMode(btn.dataset.mode);
    });
  });

  toggleBtn.addEventListener("click", toggleTimer);
  resetBtn.addEventListener("click", resetTimer);

  customOpenBtn.addEventListener("click", openCustom);
  customSaveBtn.addEventListener("click", saveCustom);
  customCloseBtn.addEventListener("click", closeCustom);

  customOverlay.addEventListener("click", (evt) => {
    if (evt.target === customOverlay) closeCustom();
  });

  updateDisplay();
}
