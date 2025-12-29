/* ============================================================
   AURA — FULL UPDATED APP.JS
   iOS‑17 Soft‑Glass Edition
============================================================ */

/* ------------------------------------------------------------
   GLOBAL STATE
------------------------------------------------------------ */

let userName = localStorage.getItem("aura-name") || "";
let decks = JSON.parse(localStorage.getItem("aura-decks") || "{}");
let notes = JSON.parse(localStorage.getItem("aura-notes") || "[]");
let todos = JSON.parse(localStorage.getItem("aura-todos") || "[]");

let currentDeck = null;
let currentCardIndex = 0;

let timerInterval = null;
let totalSeconds = 1500; // default 25 min
let remainingSeconds = totalSeconds;

/* ------------------------------------------------------------
   ELEMENTS
------------------------------------------------------------ */

const onboardingScreen = document.getElementById("onboarding-screen");
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
   ONBOARDING
------------------------------------------------------------ */

if (!userName) {
  onboardingScreen.style.display = "flex";
} else {
  onboardingScreen.style.display = "none";
  appRoot.style.display = "block";
  document.getElementById("home-greeting").textContent = `hello, ${userName}`;
}

document.getElementById("onboarding-submit").addEventListener("click", () => {
  const name = document.getElementById("onboarding-name-input").value.trim();
  if (!name) return;

  localStorage.setItem("aura-name", name);
  userName = name;

  onboardingScreen.style.display = "none";
  appRoot.style.display = "block";

  document.getElementById("home-greeting").textContent = `hello, ${userName}`;
});

/* ------------------------------------------------------------
   CHANGE NAME IN SETTINGS
------------------------------------------------------------ */

document.getElementById("settings-change-name").addEventListener("click", () => {
  const newName = prompt("Enter your new name:");
  if (!newName) return;

  userName = newName.trim();
  localStorage.setItem("aura-name", userName);

  document.getElementById("home-greeting").textContent = `hello, ${userName}`;
});

/* ------------------------------------------------------------
   NAVIGATION
------------------------------------------------------------ */

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.screenTarget;

    screens.forEach(s => s.classList.remove("is-active"));
    document.querySelector(`[data-screen="${target}"]`).classList.add("is-active");

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

document.getElementById("todo-add-button").addEventListener("click", () => {
  const text = prompt("New item:");
  if (!text) return;

  todos.push(text);
  saveTodos();
  renderTodos();
});

/* ------------------------------------------------------------
   FLASHCARDS — SAVE + RENDER DECKS
------------------------------------------------------------ */

function saveDecks() {
  localStorage.setItem("aura-decks", JSON.stringify(decks));
}

function renderDecks() {
  deckGrid.innerHTML = "";

  Object.keys(decks).forEach(deckName => {
    const card = document.createElement("div");
    card.className = "deck-card";
    card.textContent = deckName;

    card.addEventListener("click", () => openDeck(deckName));
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

  document.getElementById("deck-viewer-title").textContent = name;
  deckViewer.classList.add("is-visible");

  renderFlashcard();
}

document.getElementById("close-deck-viewer").addEventListener("click", () => {
  deckViewer.classList.remove("is-visible");
});

/* ------------------------------------------------------------
   FLASHCARDS — RENDER CARD
------------------------------------------------------------ */

function renderFlashcard() {
  const deck = decks[currentDeck];
  if (!deck || deck.length === 0) {
    flashcardFront.textContent = "No cards yet";
    flashcardBack.textContent = "";
    flashcardProgress.textContent = "";
    return;
  }

  const card = deck[currentCardIndex];

  flashcardFront.textContent = card.front;
  flashcardBack.textContent = card.back;

  flashcardProgress.textContent = `${currentCardIndex + 1} / ${deck.length}`;
}

/* ------------------------------------------------------------
   FLASHCARDS — BUTTONS
------------------------------------------------------------ */

document.getElementById("flashcard-flip").addEventListener("click", () => {
  flashcard.classList.toggle("is-flipped");
});

document.getElementById("flashcard-next").addEventListener("click", () => {
  const deck = decks[currentDeck];
  if (!deck) return;

  currentCardIndex = (currentCardIndex + 1) % deck.length;
  flashcard.classList.remove("is-flipped");
  renderFlashcard();
});

document.getElementById("flashcard-prev").addEventListener("click", () => {
  const deck = decks[currentDeck];
  if (!deck) return;

  currentCardIndex = (currentCardIndex - 1 + deck.length) % deck.length;
  flashcard.classList.remove("is-flipped");
  renderFlashcard();
});

/* ------------------------------------------------------------
   FLASHCARDS — ADD CARD
------------------------------------------------------------ */

document.getElementById("add-card-button").addEventListener("click", () => {
  const front = prompt("Front:");
  const back = prompt("Back:");

  if (!front || !back) return;

  decks[currentDeck].push({ front, back });
  saveDecks();
  renderFlashcard();
});

/* ------------------------------------------------------------
   FLASHCARDS — EDIT CARD
------------------------------------------------------------ */

document.getElementById("edit-card-button").addEventListener("click", () => {
  const deck = decks[currentDeck];
  if (!deck) return;

  const card = deck[currentCardIndex];

  const newFront = prompt("Edit front:", card.front);
  const newBack = prompt("Edit back:", card.back);

  if (!newFront || !newBack) return;

  card.front = newFront;
  card.back = newBack;

  saveDecks();
  renderFlashcard();
});

/* ------------------------------------------------------------
   FLASHCARDS — DELETE CARD
------------------------------------------------------------ */

document.getElementById("delete-card-button").addEventListener("click", () => {
  const deck = decks[currentDeck];
  if (!deck) return;

  deck.splice(currentCardIndex, 1);

  if (currentCardIndex >= deck.length) currentCardIndex = 0;

  saveDecks();
  renderFlashcard();
});

/* ------------------------------------------------------------
   FLASHCARDS — ADD DECK
------------------------------------------------------------ */

document.getElementById("add-deck-button").addEventListener("click", () => {
  const name = prompt("Deck name:");
  if (!name) return;

  decks[name] = [];
  saveDecks();
  renderDecks();
});

/* ------------------------------------------------------------
   NOTES — SAVE + RENDER
------------------------------------------------------------ */

function saveNotes() {
  localStorage.setItem("aura-notes", JSON.stringify(notes));
}

function renderNotes() {
  notesList.innerHTML = "";

  notes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "glass-card";
    card.innerHTML = `
      <h3>${note.title || "Untitled"}</h3>
      <p>${note.content.slice(0, 80)}...</p>
    `;

    card.addEventListener("click", () => openNoteEditor(index));
    notesList.appendChild(card);
  });
}

renderNotes();

/* ------------------------------------------------------------
   NOTES — OPEN EDITOR
------------------------------------------------------------ */

function openNoteEditor(index = null) {
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

/* ------------------------------------------------------------
   NOTES — CLOSE EDITOR
------------------------------------------------------------ */

document.getElementById("close-note-editor").addEventListener("click", () => {
  noteEditorOverlay.classList.remove("is-visible");
});

/* ------------------------------------------------------------
   NOTES — SAVE NOTE
------------------------------------------------------------ */

document.getElementById("save-note-button").addEventListener("click", () => {
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

/* ------------------------------------------------------------
   NOTES — DELETE NOTE
------------------------------------------------------------ */

document.getElementById("delete-note-button").addEventListener("click", () => {
  const editing = noteEditorOverlay.dataset.editing;
  if (editing === "new") return;

  notes.splice(editing, 1);
  saveNotes();
  renderNotes();
  noteEditorOverlay.classList.remove("is-visible");
});

/* ------------------------------------------------------------
   TIMER — CUSTOM TIME
------------------------------------------------------------ */

function getCustomTime() {
  const h = parseInt(hourInput.value) || 0;
  const m = parseInt(minuteInput.value) || 0;
  return h * 3600 + m * 60;
}

function updateTimerDisplay() {
  const m = Math.floor(remainingSeconds / 60);
  const s = remainingSeconds % 60;
  timerDisplay.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ------------------------------------------------------------
   TIMER — START / STOP
------------------------------------------------------------ */

document.getElementById("pomodoro-toggle").addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("pomodoro-toggle").textContent = "Start";
    return;
  }

  totalSeconds = getCustomTime();
  remainingSeconds = totalSeconds;

  updateTimerDisplay();

  timerInterval = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      remainingSeconds = 0;
    }

    updateTimerDisplay();
  }, 1000);

  document.getElementById("pomodoro-toggle").textContent = "Pause";
});

/* ------------------------------------------------------------
   TIMER — RESET
------------------------------------------------------------ */

document.getElementById("pomodoro-reset").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;

  remainingSeconds = getCustomTime();
  updateTimerDisplay();

  document.getElementById("pomodoro-toggle").textContent = "Start";
});

/* ------------------------------------------------------------
   DARK MODE TOGGLE
------------------------------------------------------------ */

document.getElementById("settings-theme-toggle").addEventListener("click", () => {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
});
