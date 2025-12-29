// flashcards.js — standard card size + smooth flip + full deck system

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

let deckListEl;

let overlayEl;
let overlayTitleEl;

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
let deleteDeckBtn;
let renameDeckBtn;
let closeOverlayBtn;

let addDeckBtn;

/* -----------------------------------------------------------
   RENDER DECK LIST
----------------------------------------------------------- */

function renderDeckList() {
  deckListEl.innerHTML = "";

  if (decks.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No decks yet.";
    empty.className = "overlay-meta";
    deckListEl.appendChild(empty);
    return;
  }

  decks.forEach((deck) => {
    const card = document.createElement("button");
    card.className = "deck-card";
    card.dataset.deckId = deck.id;

    card.innerHTML = `
      <div style="font-weight:600; margin-bottom:4px;">${deck.name}</div>
      <div style="font-size:0.85rem; color:var(--text-muted);">
        ${deck.cards.length} cards
      </div>
    `;

    card.addEventListener("click", () => openDeck(deck.id));
    deckListEl.appendChild(card);
  });
}

/* -----------------------------------------------------------
   OPEN DECK
----------------------------------------------------------- */

function openDeck(id) {
  currentDeckId = id;
  currentIndex = 0;

  const deck = decks.find((d) => d.id === id);
  if (!deck) return;

  overlayTitleEl.textContent = deck.name;

  overlayEl.classList.add("is-visible");
  overlayEl.setAttribute("aria-hidden", "false");

  renderCard();
}

/* -----------------------------------------------------------
   CLOSE DECK
----------------------------------------------------------- */

function closeDeck() {
  overlayEl.classList.remove("is-visible");
  overlayEl.setAttribute("aria-hidden", "true");

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
   FLIP CARD (F2)
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
  renderDeckList();
}

/* -----------------------------------------------------------
   RENAME DECK
----------------------------------------------------------- */

function renameDeck() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck) return;

  const newName = prompt("New deck name:", deck.name);
  if (!newName || !newName.trim()) return;

  deck.name = newName.trim();
  saveDecks();

  overlayTitleEl.textContent = deck.name;
  renderDeckList();
}

/* -----------------------------------------------------------
   DELETE DECK
----------------------------------------------------------- */

function deleteDeck() {
  const confirmDelete = window.confirm("Delete this deck?");
  if (!confirmDelete) return;

  decks = decks.filter((d) => d.id !== currentDeckId);
  saveDecks();

  closeDeck();
  renderDeckList();
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

  deckListEl = document.getElementById("deck-list");
  addDeckBtn = document.getElementById("add-deck-button");

  overlayEl = document.getElementById("deck-viewer-overlay");
  overlayTitleEl = document.getElementById("deck-viewer-title");

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
  deleteDeckBtn = document.getElementById("delete-deck-button");
  renameDeckBtn = document.getElementById("rename-deck-button");
  closeOverlayBtn = document.getElementById("close-deck-viewer");

  renderDeckList();

  addDeckBtn.addEventListener("click", addDeck);

  flipBtn.addEventListener("click", flipCard);
  prevBtn.addEventListener("click", prevCard);
  nextBtn.addEventListener("click", nextCard);

  addCardBtn.addEventListener("click", addCard);
  editCardBtn.addEventListener("click", editCard);
  deleteCardBtn.addEventListener("click", deleteCard);

  renameDeckBtn.addEventListener("click", renameDeck);
  deleteDeckBtn.addEventListener("click", deleteDeck);

  closeOverlayBtn.addEventListener("click", closeDeck);

  overlayEl.addEventListener("click", (evt) => {
    if (evt.target === overlayEl) closeDeck();
  });
}
