let displayEl;
let toggleBtn;
let resetBtn;
let ringEl; 
let timeLeft = 25 * 60;
let timerInterval = null;
const FULL_DASH = 628; 

function vibrate(ms = 10) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function updateDisplay() {
  displayEl.textContent = formatTime(timeLeft);

  const progress = timeLeft / (25 * 60);
  const offset = FULL_DASH * (1 - progress);

  ringEl.style.strokeDashoffset = offset;
}

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

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  toggleBtn.textContent = "Start";
  vibrate(10);
}

function resetTimer() {
  pauseTimer();
  timeLeft = 25 * 60;
  updateDisplay();
  vibrate(10);
}

function toggleTimer() {
  if (timerInterval) {
    pauseTimer();
  } else {
    startTimer();
  }
}

export function initTimer() {
  displayEl = document.getElementById("pomodoro-time");
  toggleBtn = document.getElementById("pomodoro-toggle");
  resetBtn = document.getElementById("pomodoro-reset");

  ringEl = document.querySelector(".timer-ring-progress");

  ringEl.style.strokeDasharray = FULL_DASH;
  ringEl.style.strokeDashoffset = 0;

  updateDisplay();

  toggleBtn.addEventListener("click", toggleTimer);
  resetBtn.addEventListener("click", resetTimer);
}

