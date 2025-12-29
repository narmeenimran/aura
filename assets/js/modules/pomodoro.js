import { storage } from "../utils/storage.js";
import { updateHomeStats } from "./home.js";

const STORAGE_KEY = "aura_pomodoro_settings";
const FOCUS_MIN_KEY = "aura_focus_minutes_today";

const DEFAULT_SETTINGS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  custom: null,
};

let settings = { ...DEFAULT_SETTINGS };

let currentMode = "focus";
let remainingSeconds = DEFAULT_SETTINGS.focus * 60;
let timerId = null;
let isRunning = false;

let timeEl;
let modeLabelEl;
let toggleBtn;
let resetBtn;
let customOpenBtn;
let customOverlay;
let customInput;
let customSaveBtn;
let customCloseBtn;
let modeTabs;

function loadSettings() {
  const saved = storage.get(STORAGE_KEY);
  if (saved && typeof saved === "object") {
    settings = { ...DEFAULT_SETTINGS, ...saved };
  }
}

function saveSettings() {
  storage.set(STORAGE_KEY, settings);
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function addFocusMinutesCompleted(minutes) {
  const todayKey = getTodayKey();
  const stored = storage.get(FOCUS_MIN_KEY) || {};
  const current = stored[todayKey] || 0;
  stored[todayKey] = current + minutes;
  storage.set(FOCUS_MIN_KEY, stored);
  updateHomeStats();
}

function getModeDurationMinutes(mode) {
  if (mode === "focus") return settings.focus;
  if (mode === "shortBreak") return settings.shortBreak;
  if (mode === "longBreak") return settings.longBreak;
  if (mode === "custom" && settings.custom) return settings.custom;
  return settings.focus;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updateDisplay() {
  if (!timeEl || !modeLabelEl) return;
  timeEl.textContent = formatTime(remainingSeconds);

  const map = {
    focus: "Focus",
    shortBreak: "Short break",
    longBreak: "Long break",
    custom: "Custom",
  };
  modeLabelEl.textContent = map[currentMode] || "Focus";

  if (toggleBtn) {
    toggleBtn.textContent = isRunning ? "Pause" : "Start";
  }
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
  isRunning = false;
  updateDisplay();
}

function handleTimerComplete() {
  if (currentMode === "focus") {
    const duration = getModeDurationMinutes("focus");
    addFocusMinutesCompleted(duration);
  }
  stopTimer();
}

function tick() {
  remainingSeconds -= 1;
  if (remainingSeconds <= 0) {
    remainingSeconds = 0;
    updateDisplay();
    handleTimerComplete();
  } else {
    updateDisplay();
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  updateDisplay();
  timerId = window.setInterval(tick, 1000);
}

function toggleTimer() {
  if (isRunning) {
    stopTimer();
  } else {
    startTimer();
  }
}

function resetTimer() {
  stopTimer();
  remainingSeconds = getModeDurationMinutes(currentMode) * 60;
  updateDisplay();
}

function setMode(newMode) {
  if (currentMode === newMode) return;
  currentMode = newMode;
  remainingSeconds = getModeDurationMinutes(currentMode) * 60;
  isRunning = false;
  stopTimer();
  updateDisplay();

  if (modeTabs && modeTabs.length) {
    modeTabs.forEach((tab) => {
      const isActive = tab.dataset.mode === newMode;
      tab.classList.toggle("is-active", isActive);
    });
  }
}

function openCustomOverlay() {
  if (!customOverlay) return;
  customOverlay.classList.add("is-visible");
  customOverlay.setAttribute("aria-hidden", "false");
  const current = settings.custom || settings.focus;
  if (customInput) {
    customInput.value = String(current);
  }
}

function closeCustomOverlay() {
  if (!customOverlay) return;
  customOverlay.classList.remove("is-visible");
  customOverlay.setAttribute("aria-hidden", "true");
}

function saveCustomDuration() {
  if (!customInput) return;
  const value = parseInt(customInput.value, 10);
  if (!Number.isFinite(value) || value <= 0) {
    closeCustomOverlay();
    return;
  }
  settings.custom = value;
  saveSettings();
  setMode("custom");
  closeCustomOverlay();
}

export function initPomodoro() {
  loadSettings();

  timeEl = document.getElementById("pomodoro-time");
  modeLabelEl = document.getElementById("pomodoro-mode-label");
  toggleBtn = document.getElementById("pomodoro-toggle");
  resetBtn = document.getElementById("pomodoro-reset");
  customOpenBtn = document.getElementById("pomodoro-custom-open");
  customOverlay = document.getElementById("pomodoro-custom-overlay");
  customInput = document.getElementById("pomodoro-custom-mins");
  customSaveBtn = document.getElementById("save-pomodoro-custom");
  customCloseBtn = document.getElementById("close-pomodoro-custom");
  modeTabs = Array.from(document.querySelectorAll(".timer-mode-tab"));

  remainingSeconds = getModeDurationMinutes(currentMode) * 60;
  updateDisplay();

  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleTimer);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetTimer);
  }

  if (customOpenBtn) {
    customOpenBtn.addEventListener("click", openCustomOverlay);
  }

  if (customSaveBtn) {
    customSaveBtn.addEventListener("click", saveCustomDuration);
  }

  if (customCloseBtn) {
    customCloseBtn.addEventListener("click", closeCustomOverlay);
  }

  if (customOverlay) {
    customOverlay.addEventListener("click", (evt) => {
      if (evt.target === customOverlay) {
        closeCustomOverlay();
      }
    });
  }

  if (modeTabs && modeTabs.length) {
    modeTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const mode = tab.dataset.mode;
        if (!mode) return;
        setMode(mode);
      });
    });
  }
}
