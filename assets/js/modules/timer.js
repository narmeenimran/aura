// timer.js — clean Pomodoro timer (25:00) with start/pause/reset

let timeLeft = 25 * 60; // 25 minutes
let timerInterval = null;

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
  displayEl.textContent = formatTime(timeLeft);
}

/* -----------------------------------------------------------
   START TIMER
----------------------------------------------------------- */

function startTimer() {
  if (timerInterval) return;

  toggleBtn.textContent = "Pause";

  timerInterval = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timeLeft = 0;
      updateDisplay();
      toggleBtn.textContent = "Start";
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
}

/* -----------------------------------------------------------
   RESET TIMER
----------------------------------------------------------- */

function resetTimer() {
  pauseTimer();
  timeLeft = 25 * 60;
  updateDisplay();
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

  updateDisplay();

  toggleBtn.addEventListener("click", toggleTimer);
  resetBtn.addEventListener("click", resetTimer);
}
