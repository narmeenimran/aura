// timer.js — simple Pomodoro timer (25:00)

let duration = 25 * 60; // 25 minutes in seconds
let remaining = duration;
let interval = null;

let displayEl;
let toggleBtn;
let resetBtn;

/* -----------------------------------------------------------
   FORMAT TIME
----------------------------------------------------------- */

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* -----------------------------------------------------------
   UPDATE DISPLAY
----------------------------------------------------------- */

function updateDisplay() {
  displayEl.textContent = formatTime(remaining);
}

/* -----------------------------------------------------------
   START TIMER
----------------------------------------------------------- */

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    remaining--;

    if (remaining <= 0) {
      clearInterval(interval);
      interval = null;
      remaining = 0;
    }

    updateDisplay();
  }, 1000);

  toggleBtn.textContent = "Pause";
}

/* -----------------------------------------------------------
   PAUSE TIMER
----------------------------------------------------------- */

function pauseTimer() {
  clearInterval(interval);
  interval = null;
  toggleBtn.textContent = "Start";
}

/* -----------------------------------------------------------
   TOGGLE START/PAUSE
----------------------------------------------------------- */

function toggleTimer() {
  if (interval) {
    pauseTimer();
  } else {
    startTimer();
  }
}

/* -----------------------------------------------------------
   RESET TIMER
----------------------------------------------------------- */

function resetTimer() {
  pauseTimer();
  remaining = duration;
  updateDisplay();
}

/* -----------------------------------------------------------
   INIT
----------------------------------------------------------- */

export function initTimer() {
  displayEl = document.getElementById("pomodoro-time");
  toggleBtn = document.getElementById("pomodoro-toggle");
  resetBtn = document.getElementById("pomodoro-reset");

  updateDisplay();

  toggleBtn.addEventListener("click", toggleTimer);
  resetBtn.addEventListener("click", resetTimer);
}
