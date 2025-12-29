// flashcards.js — B2‑B glass grid + slide‑in deck viewer (Option 3)

import { storage } from "../utils/storage.js";

const DECK_KEY = "aura_flashcard_decks";

let decks = [];
let currentDeckId = null;
let currentIndex = 0;

/* -----------------------------------------------------------
   LOAD + SAVE
----------------------------------------------------------- */

function loadDecks() {
  const saved = storage.get(DECK_KEY);
  if (Array.isArray(saved)) {
    decks = saved;
  } else {
    decks = [];
    saveDecks();
  }
}

function saveDecks() {
  storage.set(DECK_KEY, decks);
}

/* -----------------------------------------------------------
   ELEMENTS
----------------------------------------------------------- */

let gridEl;

let panelEl;
let panelTitleEl;

let flashcardEl;
let flashcardFrontEl;
let flashcardBackEl;

let progressEl;

let flipBtn;
let prevBtn;
let nextBtn;
let addCardBtn;
let editCardBtn;
let deleteCardBtn;
let renameDeckBtn;
let deleteDeckBtn;
let closePanelBtn;

let addDeckBtn;

/* -----------------------------------------------------------
   RENDER DECK GRID
----------------------------------------------------------- */

function renderDeckGrid() {
  gridEl.innerHTML = "";

  if (decks.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No decks yet.";
    empty.className = "overlay-meta";
    gridEl.appendChild(empty);
    return;
  }

  decks.forEach((deck) => {
    const card = document.createElement("div");
    card.className = "deck-card";

    card.innerHTML = `
      <div class="deck-card-header">
        <strong>${deck.name}</strong>
        <div class="deck-card-actions">
          <button class="deck-action-btn" data-edit="${deck.id}">✏️</button>
          <button class="deck-action-btn" data-delete="${deck.id}">🗑</button>
        </div>
      </div>
      <div style="margin-top:6px; font-size:0.85rem; color:var(--text-muted);">
        ${deck.cards.length} cards
      </div>
    `;

    // Open deck viewer
    card.addEventListener("click", (evt) => {
      if (evt.target.dataset.edit || evt.target.dataset.delete) return;
      openDeck(deck.id);
    });

    // Edit deck
    card.querySelector("[data-edit]")?.addEventListener("click", (evt) => {
      evt.stopPropagation();
      renameDeck(deck.id);
    });

    // Delete deck
    card.querySelector("[data-delete]")?.addEventListener("click", (evt) => {
      evt.stopPropagation();
      deleteDeck(deck.id);
    });

    gridEl.appendChild(card);
  });
}

/* -----------------------------------------------------------
   OPEN DECK (SLIDE-IN PANEL)
----------------------------------------------------------- */

function openDeck(id) {
  currentDeckId = id;
  currentIndex = 0;

  const deck = decks.find((d) => d.id === id);
  if (!deck) return;

  panelTitleEl.textContent = deck.name;

  panelEl.classList.add("is-visible");

  renderCard();
}

/* -----------------------------------------------------------
   CLOSE PANEL
----------------------------------------------------------- */

function closePanel() {
  panelEl.classList.remove("is-visible");
  flashcardEl.classList.remove("is-flipped");
}

/* -----------------------------------------------------------
   RENDER CARD
----------------------------------------------------------- */

function renderCard() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck) return;

  if (deck.cards.length === 0) {
    flashcardFrontEl.textContent = "No cards yet.";
    flashcardBackEl.textContent = "Add a card to begin.";
    progressEl.textContent = "0 / 0";
    return;
  }

  const card = deck.cards[currentIndex];

  flashcardFrontEl.textContent = card.front;
  flashcardBackEl.textContent = card.back;

  progressEl.textContent = `${currentIndex + 1} / ${deck.cards.length}`;

  flashcardEl.classList.remove("is-flipped");
}

/* -----------------------------------------------------------
   FLIP CARD
----------------------------------------------------------- */

function flipCard() {
  flashcardEl.classList.toggle("is-flipped");
}

/* -----------------------------------------------------------
   NEXT / PREV
----------------------------------------------------------- */

function nextCard() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck || deck.cards.length === 0) return;

  currentIndex = (currentIndex + 1) % deck.cards.length;
  renderCard();
}

function prevCard() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck || deck.cards.length === 0) return;

  currentIndex = (currentIndex - 1 + deck.cards.length) % deck.cards.length;
  renderCard();
}

/* -----------------------------------------------------------
   ADD DECK
----------------------------------------------------------- */

function addDeck() {
  const name = prompt("Deck name:");
  if (!name || !name.trim()) return;

  decks.push({
    id: String(Date.now()),
    name: name.trim(),
    cards: []
  });

  saveDecks();
  renderDeckGrid();
}

/* -----------------------------------------------------------
   RENAME DECK
----------------------------------------------------------- */

function renameDeck(id) {
  const deck = decks.find((d) => d.id === id);
  if (!deck) return;

  const newName = prompt("New deck name:", deck.name);
  if (!newName || !newName.trim()) return;

  deck.name = newName.trim();
  saveDecks();

  renderDeckGrid();

  if (id === currentDeckId) {
    panelTitleEl.textContent = deck.name;
  }
}

/* -----------------------------------------------------------
   DELETE DECK
----------------------------------------------------------- */

function deleteDeck(id) {
  const confirmDelete = window.confirm("Delete this deck?");
  if (!confirmDelete) return;

  decks = decks.filter((d) => d.id !== id);
  saveDecks();

  renderDeckGrid();

  if (id === currentDeckId) {
    closePanel();
  }
}

/* -----------------------------------------------------------
   ADD CARD
----------------------------------------------------------- */

function addCard() {
  const front = prompt("Front:");
  if (!front) return;

  const back = prompt("Back:");
  if (!back) return;

  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck) return;

  deck.cards.push({ front, back });
  saveDecks();

  currentIndex = deck.cards.length - 1;
  renderCard();
}

/* -----------------------------------------------------------
   EDIT CARD
----------------------------------------------------------- */

function editCard() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck || deck.cards.length === 0) return;

  const card = deck.cards[currentIndex];

  const newFront = prompt("Edit front:", card.front);
  if (!newFront) return;

  const newBack = prompt("Edit back:", card.back);
  if (!newBack) return;

  card.front = newFront;
  card.back = newBack;

  saveDecks();
  renderCard();
}

/* -----------------------------------------------------------
   DELETE CARD
----------------------------------------------------------- */

function deleteCard() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck || deck.cards.length === 0) return;

  const confirmDelete = window.confirm("Delete this card?");
  if (!confirmDelete) return;

  deck.cards.splice(currentIndex, 1);
  saveDecks();

  if (currentIndex >= deck.cards.length) {
    currentIndex = deck.cards.length - 1;
  }

  renderCard();
}

/* -----------------------------------------------------------
   INIT
----------------------------------------------------------- */

export function initFlashcards() {
  loadDecks();

  gridEl = document.getElementById("deck-grid");
  addDeckBtn = document.getElementById("add-deck-button");

  panelEl = document.getElementById("deck-viewer-panel");
  panelTitleEl = document.getElementById("deck-viewer-title");

  flashcardEl = document.getElementById("flashcard");
  flashcardFrontEl = document.getElementById("flashcard-front");
  flashcardBackEl = document.getElementById("flashcard-back");

  progressEl = document.getElementById("flashcard-progress");

  flipBtn = document.getElementById("flashcard-flip");
  prevBtn = document.getElementById("flashcard-prev");
  nextBtn = document.getElementById("flashcard-next");
  addCardBtn = document.getElementById("add-card-button");
  editCardBtn = document.getElementById("edit-card-button");
  deleteCardBtn = document.getElementById("delete-card-button");
  renameDeckBtn = document.getElementById("rename-deck-button");
  deleteDeckBtn = document.getElementById("delete-deck-button");
  closePanelBtn = document.getElementById("close-deck-viewer");

  renderDeckGrid();

  addDeckBtn.addEventListener("click", addDeck);

  flipBtn.addEventListener("click", flipCard);
  prevBtn.addEventListener("click", prevCard);
  nextBtn.addEventListener("click", nextCard);

  addCardBtn.addEventListener("click", addCard);
  editCardBtn.addEventListener("click", editCard);
  deleteCardBtn.addEventListener("click", deleteCard);

  renameDeckBtn.addEventListener("click", () => renameDeck(currentDeckId));
  deleteDeckBtn.addEventListener("click", () => deleteDeck(currentDeckId));

  closePanelBtn.addEventListener("click", closePanel);
}
