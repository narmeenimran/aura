/* ============================================================
   AURA — FULL UPDATED APP.JS
   iOS‑17 Soft‑Glass Edition
============================================================ */

/* ------------------------------------------------------------
   GLOBAL STATE
------------------------------------------------------------ */

let userName = localStorage.getItem("aura-name") || "";
let userAge = localStorage.getItem("aura-age") || "";
let userPurpose = JSON.parse(localStorage.getItem("aura-purpose") || "[]");

let decks = JSON.parse(localStorage.getItem("aura-decks") || "{}");
let notes = JSON.parse(localStorage.getItem("aura-notes") || "[]");
let todos = JSON.parse(localStorage.getItem("aura-todos") || "[]");

let currentDeck = null;
let currentCardIndex = 0;

let timerInterval = null;
let totalSeconds = 1500; // default 25 min
let remainingSeconds = totalSeconds;

/* Timer ring */
const ring = document.querySelector(".timer-ring-progress");
const radius = 100;
const circumference = 2 * Math.PI * radius;
if (ring) {
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = 0;
}

/* ------------------------------------------------------------
   ELEMENTS
------------------------------------------------------------ */

const onboardingScreen = document.getElementById("onboarding-screen");
const onboardingStepsContainer = document.querySelector(".onboarding-steps");
const onboardingCards = document.querySelectorAll(".onboarding-card");

const appRoot = document.getElementById("app-root");

const screens = document.querySelectorAll(".aura-screen");
const navButtons = document.querySelectorAll(".bottom-nav-item");

const deckGrid = document.getElementById("deck-grid");
const deckViewer = document.getElementById("deck-viewer-panel");

const flashcard = document.getElementById("flashcard");
const flashcardFront = document.getElementById("flashcard-front");
const flashcardBack = document.getElementById("flashcard-back");
const flashcardProgress = document.getElementById("flashcard-progress");

const notesList = document.getElementById("notes-list");
const noteEditorOverlay = document.getElementById("note-editor-overlay");
const noteEditorContent = document.getElementById("note-editor-content");
const noteEditorTitle = document.getElementById("note-editor-title-input");

const timerDisplay = document.getElementById("pomodoro-time");
const hourInput = document.getElementById("timer-hours");
const minuteInput = document.getElementById("timer-minutes");

/* ------------------------------------------------------------
   ONBOARDING WIZARD
------------------------------------------------------------ */

let onboardingStep = 1;

function goToOnboardingStep(step) {
  onboardingStep = step;
  const offset = (step - 1) * -100;
  onboardingStepsContainer.style.transform = `translateX(${offset}%)`;

  onboardingCards.forEach(card => {
    const s = parseInt(card.dataset.step, 10);
    card.classList.toggle("is-active", s === step);
  });
}

function finishOnboarding() {
  onboardingScreen.style.display = "none";
  appRoot.style.display = "block";

  if (userName) {
    const greet = document.getElementById("home-greeting");
    if (greet) greet.textContent = `hello, ${userName}`;
  }
}

if (!userName || !userAge || !userPurpose.length) {
  onboardingScreen.style.display = "flex";
  appRoot.style.display = "none";
  goToOnboardingStep(1);
} else {
  onboardingScreen.style.display = "none";
  appRoot.style.display = "block";
  const greet = document.getElementById("home-greeting");
  if (greet) greet.textContent = `hello, ${userName}`;
}

/* Step 1: Name */
const onboardingNext1 = document.getElementById("onboarding-next-1");
if (onboardingNext1) {
  onboardingNext1.addEventListener("click", () => {
    const nameInput = document.getElementById("onboarding-name-input");
    const name = (nameInput?.value || "").trim();
    if (!name) return;

    userName = name;
    localStorage.setItem("aura-name", userName);
    goToOnboardingStep(2);
  });
}

/* Step 2: Age */
const onboardingNext2 = document.getElementById("onboarding-next-2");
if (onboardingNext2) {
  onboardingNext2.addEventListener("click", () => {
    const ageInput = document.getElementById("onboarding-age-input");
    const ageValue = ageInput?.value.trim();
    if (!ageValue) return;

    userAge = ageValue;
    localStorage.setItem("aura-age", userAge);
    goToOnboardingStep(3);
  });
}

/* Step 3: Purpose */
const onboardingFinish = document.getElementById("onboarding-finish");
if (onboardingFinish) {
  onboardingFinish.addEventListener("click", () => {
    const checks = document.querySelectorAll('input[name="purpose"]:checked');
    const selected = Array.from(checks).map(c => c.value);
    if (!selected.length) return;

    userPurpose = selected;
    localStorage.setItem("aura-purpose", JSON.stringify(userPurpose));
    finishOnboarding();
  });
}

/* ------------------------------------------------------------
   SETTINGS — CHANGE NAME
------------------------------------------------------------ */

const changeNameBtn = document.getElementById("settings-change-name");
if (changeNameBtn) {
  changeNameBtn.addEventListener("click", () => {
    const newName = prompt("Enter your new name:", userName || "");
    if (!newName) return;

    userName = newName.trim();
    localStorage.setItem("aura-name", userName);

    const greet = document.getElementById("home-greeting");
    if (greet) greet.textContent = `hello, ${userName}`;
  });
}

/* ------------------------------------------------------------
   NAVIGATION
------------------------------------------------------------ */

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.screenTarget;

    screens.forEach(s => s.classList.remove("is-active"));
    const screen = document.querySelector(`[data-screen="${target}"]`);
    if (screen) screen.classList.add("is-active");

    navButtons.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  });
});

/* ------------------------------------------------------------
   TODO LIST (HOME)
------------------------------------------------------------ */

function saveTodos() {
  localStorage.setItem("aura-todos", JSON.stringify(todos));
}

function renderTodos() {
  const list = document.getElementById("todo-list");
  if (!list) return;

  list.innerHTML = "";
  todos.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.innerHTML = `
      <span>${item}</span>
      <button class="ghost-button" data-index="${index}">x</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    list.appendChild(li);
  });
}

renderTodos();

const todoAddButton = document.getElementById("todo-add-button");
if (todoAddButton) {
  todoAddButton.addEventListener("click", () => {
    const text = prompt("New item:");
    if (!text) return;
    todos.push(text.trim());
    saveTodos();
    renderTodos();
  });
}

/* ------------------------------------------------------------
   FLASHCARDS — SAVE + RENDER DECKS
------------------------------------------------------------ */

function saveDecks() {
  localStorage.setItem("aura-decks", JSON.stringify(decks));
}

function renderDecks() {
  if (!deckGrid) return;
  deckGrid.innerHTML = "";

  Object.keys(decks).forEach(deckName => {
    const card = document.createElement("div");
    card.className = "deck-card";
    card.innerHTML = `
      <div>${deckName}</div>
    `;

    // open deck when card clicked
    card.addEventListener("click", () => openDeck(deckName));

    // delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete deck";
    deleteBtn.className = "ghost-button deck-delete-button";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`Delete deck "${deckName}"?`)) {
        delete decks[deckName];
        saveDecks();
        renderDecks();
      }
    });

    card.appendChild(deleteBtn);
    deckGrid.appendChild(card);
  });
}

renderDecks();

/* ------------------------------------------------------------
   FLASHCARDS — OPEN DECK
------------------------------------------------------------ */

function openDeck(name) {
  currentDeck = name;
  currentCardIndex = 0;

  const title = document.getElementById("deck-viewer-title");
  if (title) title.textContent = name;

  if (deckViewer) deckViewer.classList.add("is-visible");

  renderFlashcard();
}

const closeDeckViewerBtn = document.getElementById("close-deck-viewer");
if (closeDeckViewerBtn) {
  closeDeckViewerBtn.addEventListener("click", () => {
    if (deckViewer) deckViewer.classList.remove("is-visible");
  });
}

/* ------------------------------------------------------------
   FLASHCARDS — RENDER CARD
------------------------------------------------------------ */

function renderFlashcard() {
  const deck = decks[currentDeck];
  if (!deck || deck.length === 0) {
    if (flashcardFront) flashcardFront.textContent = "No cards yet";
    if (flashcardBack) flashcardBack.textContent = "";
    if (flashcardProgress) flashcardProgress.textContent = "";
    return;
  }

  const card = deck[currentCardIndex];
  if (flashcardFront) flashcardFront.textContent = card.front;
  if (flashcardBack) flashcardBack.textContent = card.back;
  if (flashcardProgress) {
    flashcardProgress.textContent = `${currentCardIndex + 1} / ${deck.length}`;
  }
}

/* ------------------------------------------------------------
   FLASHCARDS — BUTTONS
------------------------------------------------------------ */

const flipBtn = document.getElementById("flashcard-flip");
if (flipBtn && flashcard) {
  flipBtn.addEventListener("click", () => {
    flashcard.classList.toggle("is-flipped");
  });
}

const nextBtn = document.getElementById("flashcard-next");
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    const deck = decks[currentDeck];
    if (!deck) return;
    currentCardIndex = (currentCardIndex + 1) % deck.length;
    if (flashcard) flashcard.classList.remove("is-flipped");
    renderFlashcard();
  });
}

const prevBtn = document.getElementById("flashcard-prev");
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    const deck = decks[currentDeck];
    if (!deck) return;
    currentCardIndex = (currentCardIndex - 1 + deck.length) % deck.length;
    if (flashcard) flashcard.classList.remove("is-flipped");
    renderFlashcard();
  });
}

/* ADD CARD */
const addCardBtn = document.getElementById("add-card-button");
if (addCardBtn) {
  addCardBtn.addEventListener("click", () => {
    if (!currentDeck) return;
    const front = prompt("Front:");
    const back = prompt("Back:");
    if (!front || !back) return;
    decks[currentDeck].push({ front, back });
    saveDecks();
    renderFlashcard();
  });
}

/* EDIT CARD */
const editCardBtn = document.getElementById("edit-card-button");
if (editCardBtn) {
  editCardBtn.addEventListener("click", () => {
    const deck = decks[currentDeck];
    if (!deck || !deck.length) return;

    const card = deck[currentCardIndex];
    const newFront = prompt("Edit front:", card.front);
    const newBack = prompt("Edit back:", card.back);
    if (!newFront || !newBack) return;

    card.front = newFront;
    card.back = newBack;
    saveDecks();
    renderFlashcard();
  });
}

/* DELETE CARD */
const deleteCardBtn = document.getElementById("delete-card-button");
if (deleteCardBtn) {
  deleteCardBtn.addEventListener("click", () => {
    const deck = decks[currentDeck];
    if (!deck || !deck.length) return;

    deck.splice(currentCardIndex, 1);
    if (currentCardIndex >= deck.length) currentCardIndex = 0;
    saveDecks();
    renderFlashcard();
  });
}

/* RENAME DECK */
const renameDeckBtn = document.getElementById("rename-deck-button");
if (renameDeckBtn) {
  renameDeckBtn.addEventListener("click", () => {
    if (!currentDeck) return;
    const newName = prompt("Rename deck:", currentDeck);
    if (!newName || newName === currentDeck) return;

    decks[newName] = decks[currentDeck];
    delete decks[currentDeck];
    currentDeck = newName;
    saveDecks();
    renderDecks();

    const title = document.getElementById("deck-viewer-title");
    if (title) title.textContent = newName;
  });
}

/* DELETE CURRENT DECK */
const deleteDeckBtn = document.getElementById("delete-deck-button");
if (deleteDeckBtn) {
  deleteDeckBtn.addEventListener("click", () => {
    if (!currentDeck) return;
    if (!confirm(`Delete deck "${currentDeck}"?`)) return;

    delete decks[currentDeck];
    saveDecks();
    renderDecks();

    currentDeck = null;
    if (deckViewer) deckViewer.classList.remove("is-visible");
  });
}

/* ADD DECK (GLOBAL) */
const addDeckBtn = document.getElementById("add-deck-button");
if (addDeckBtn) {
  addDeckBtn.addEventListener("click", () => {
    const name = prompt("Deck name:");
    if (!name) return;
    if (decks[name]) {
      alert("A deck with that name already exists.");
      return;
    }
    decks[name] = [];
    saveDecks();
    renderDecks();
  });
}

/* ------------------------------------------------------------
   NOTES — SAVE + RENDER
------------------------------------------------------------ */

function saveNotes() {
  localStorage.setItem("aura-notes", JSON.stringify(notes));
}

function renderNotes() {
  if (!notesList) return;
  notesList.innerHTML = "";

  notes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "glass-card";
    card.innerHTML = `
      <h3>${note.title || "Untitled"}</h3>
      <p>${(note.content || "").replace(/<[^>]*>/g, "").slice(0, 80)}...</p>
    `;
    card.addEventListener("click", () => openNoteEditor(index));
    notesList.appendChild(card);
  });
}

renderNotes();

/* OPEN NOTE EDITOR */
function openNoteEditor(index = null) {
  if (!noteEditorOverlay) return;
  noteEditorOverlay.classList.add("is-visible");

  if (index === null) {
    noteEditorTitle.value = "";
    noteEditorContent.innerHTML = "";
    noteEditorOverlay.dataset.editing = "new";
  } else {
    const note = notes[index];
    noteEditorTitle.value = note.title;
    noteEditorContent.innerHTML = note.content;
    noteEditorOverlay.dataset.editing = index;
  }
}

/* ADD NOTE BUTTON */
const addNoteBtn = document.getElementById("add-note-button");
if (addNoteBtn) {
  addNoteBtn.addEventListener("click", () => {
    openNoteEditor(null);
  });
}

/* CLOSE NOTE EDITOR */
const closeNoteEditorBtn = document.getElementById("close-note-editor");
if (closeNoteEditorBtn) {
  closeNoteEditorBtn.addEventListener("click", () => {
    noteEditorOverlay.classList.remove("is-visible");
  });
}

/* SAVE NOTE */
const saveNoteBtn = document.getElementById("save-note-button");
if (saveNoteBtn) {
  saveNoteBtn.addEventListener("click", () => {
    const title = noteEditorTitle.value.trim();
    const content = noteEditorContent.innerHTML.trim();
    if (!content) return;

    const editing = noteEditorOverlay.dataset.editing;
    if (editing === "new") {
      notes.push({ title, content });
    } else {
      notes[editing] = { title, content };
    }

    saveNotes();
    renderNotes();
    noteEditorOverlay.classList.remove("is-visible");
  });
}

/* DELETE NOTE */
const deleteNoteBtn = document.getElementById("delete-note-button");
if (deleteNoteBtn) {
  deleteNoteBtn.addEventListener("click", () => {
    const editing = noteEditorOverlay.dataset.editing;
    if (editing === "new") return;

    notes.splice(editing, 1);
    saveNotes();
    renderNotes();
    noteEditorOverlay.classList.remove("is-visible");
  });
}

/* ------------------------------------------------------------
   TIMER — CUSTOM TIME + RING
------------------------------------------------------------ */

function getCustomTime() {
  const h = parseInt(hourInput?.value || "0", 10) || 0;
  const m = parseInt(minuteInput?.value || "0", 10) || 0;
  const seconds = h * 3600 + m * 60;
  return seconds > 0 ? seconds : 1500; // fallback 25 min
}

function updateTimerDisplay() {
  const m = Math.floor(remainingSeconds / 60);
  const s = remainingSeconds % 60;
  if (timerDisplay) {
    timerDisplay.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
}

function updateRing() {
  if (!ring) return;
  const percent = remainingSeconds / totalSeconds;
  ring.style.strokeDashoffset = circumference * (1 - percent);
}

/* START / PAUSE */
const pomodoroToggleBtn = document.getElementById("pomodoro-toggle");
if (pomodoroToggleBtn) {
  pomodoroToggleBtn.addEventListener("click", () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      pomodoroToggleBtn.textContent = "Start";
      return;
    }

    totalSeconds = getCustomTime();
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
    updateRing();

    timerInterval = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds <= 0) {
        remainingSeconds = 0;
        updateTimerDisplay();
        updateRing();
        clearInterval(timerInterval);
        timerInterval = null;
        pomodoroToggleBtn.textContent = "Start";
        return;
      }
      updateTimerDisplay();
      updateRing();
    }, 1000);

    pomodoroToggleBtn.textContent = "Pause";
  });
}

/* RESET */
const pomodoroResetBtn = document.getElementById("pomodoro-reset");
if (pomodoroResetBtn) {
  pomodoroResetBtn.addEventListener("click", () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    totalSeconds = getCustomTime();
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
    updateRing();

    if (pomodoroToggleBtn) {
      pomodoroToggleBtn.textContent = "Start";
    }
  });
}

/* ------------------------------------------------------------
   DARK MODE TOGGLE
------------------------------------------------------------ */

const themeToggleBtn = document.getElementById("settings-theme-toggle");
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("aura-theme", next);
  });
}

/* Load theme from storage */
const savedTheme = localStorage.getItem("aura-theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}
