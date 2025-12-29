// timer.js — Pomodoro timer with animated ring + haptics

/* -----------------------------------------------------------
   ELEMENTS
----------------------------------------------------------- */

let displayEl;
let toggleBtn;
let resetBtn;

let ringEl; // SVG progress ring

/* -----------------------------------------------------------
   TIMER STATE
----------------------------------------------------------- */

let timeLeft = 25 * 60; // 25 minutes
let timerInterval = null;

const FULL_DASH = 628; // circumference of r=100 circle

/* -----------------------------------------------------------
   HAPTICS
----------------------------------------------------------- */

function vibrate(ms = 10) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

/* -----------------------------------------------------------
   FORMAT TIME
----------------------------------------------------------- */

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* -----------------------------------------------------------
   UPDATE DISPLAY + RING
----------------------------------------------------------- */

function updateDisplay() {
  displayEl.textContent = formatTime(timeLeft);

  const progress = timeLeft / (25 * 60);
  const offset = FULL_DASH * (1 - progress);

  ringEl.style.strokeDashoffset = offset;
}

/* -----------------------------------------------------------
   START TIMER
----------------------------------------------------------- */

function startTimer() {
  if (timerInterval) return;

  vibrate(15);
  toggleBtn.textContent = "Pause";

  timerInterval = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timeLeft = 0;
      updateDisplay();
      toggleBtn.textContent = "Start";
      vibrate(30);
      return;
    }

    updateDisplay();
  }, 1000);
}

/* -----------------------------------------------------------
   PAUSE TIMER
----------------------------------------------------------- */

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  toggleBtn.textContent = "Start";
  vibrate(10);
}

/* -----------------------------------------------------------
   RESET TIMER
----------------------------------------------------------- */

function resetTimer() {
  pauseTimer();
  timeLeft = 25 * 60;
  updateDisplay();
  vibrate(10);
}

/* -----------------------------------------------------------
   TOGGLE START/PAUSE
----------------------------------------------------------- */

function toggleTimer() {
  if (timerInterval) {
    pauseTimer();
  } else {
    startTimer();
  }
}

/* -----------------------------------------------------------
   INIT
----------------------------------------------------------- */

export function initTimer() {
  displayEl = document.getElementById("pomodoro-time");
  toggleBtn = document.getElementById("pomodoro-toggle");
  resetBtn = document.getElementById("pomodoro-reset");

  ringEl = document.querySelector(".timer-ring-progress");

  // Initialize ring
  ringEl.style.strokeDasharray = FULL_DASH;
  ringEl.style.strokeDashoffset = 0;

  updateDisplay();

  toggleBtn.addEventListener("click", toggleTimer);
  resetBtn.addEventListener("click", resetTimer);
}
