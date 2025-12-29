// flashcards.js — clean vertical flip + deck CRUD + overlay

import { storage } from "../utils/storage.js";
import { updateHomeStats } from "./home.js";

const STORAGE_KEY = "aura_decks";

let decks = [];
let currentDeckId = null;
let currentCardIndex = 0;

// Elements
let deckListEl;
let overlayEl;
let titleEl;
let frontEl;
let backEl;
let progressEl;
let flashcardEl;

let flipBtn;
let prevBtn;
let nextBtn;
let addCardBtn;
let editCardBtn;
let deleteCardBtn;
let renameDeckBtn;
let deleteDeckBtn;
let closeBtn;
let addDeckBtn;

/* -----------------------------------------------------------
   DEFAULT STARTER DECKS
----------------------------------------------------------- */
function defaultDecks() {
  return [
    {
      id: "1",
      name: "Neuroscience basics",
      cards: [
        { front: "What is a neuron?", back: "A cell that transmits nerve impulses." },
        { front: "What is synaptic plasticity?", back: "The ability of synapses to strengthen or weaken." }
      ]
    },
    {
      id: "2",
      name: "Cognitive biases",
      cards: [
        { front: "Confirmation bias", back: "Seeking info that confirms existing beliefs." },
        { front: "Anchoring", back: "Relying too heavily on the first piece of information." }
      ]
    }
  ];
}

/* -----------------------------------------------------------
   LOAD + SAVE
----------------------------------------------------------- */
function loadDecks() {
  const saved = storage.get(STORAGE_KEY);
  if (Array.isArray(saved) && saved.length) {
    decks = saved;
  } else {
    decks = defaultDecks();
    saveDecks();
  }
}

function saveDecks() {
  storage.set(STORAGE_KEY, decks);
  updateHomeStats();
}

/* -----------------------------------------------------------
   RENDER DECK LIST
----------------------------------------------------------- */
function renderDeckList() {
  if (!deckListEl) return;

  deckListEl.innerHTML = "";

  if (!decks.length) {
    const empty = document.createElement("p");
    empty.textContent = "No decks yet. Create your first one.";
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
   HELPERS
----------------------------------------------------------- */
function findDeck(id) {
  return decks.find((d) => d.id === id) || null;
}

function getCurrentDeck() {
  return currentDeckId ? findDeck(currentDeckId) : null;
}

/* -----------------------------------------------------------
   FLASHCARD VIEW UPDATE
----------------------------------------------------------- */
function updateFlashcardView() {
  const deck = getCurrentDeck();
  if (!deck) return;

  if (!deck.cards.length) {
    frontEl.textContent = "This deck is empty. Add your first card.";
    backEl.textContent = "";
    progressEl.textContent = "0 / 0";
    return;
  }

  if (currentCardIndex < 0) currentCardIndex = 0;
  if (currentCardIndex >= deck.cards.length) {
    currentCardIndex = deck.cards.length - 1;
  }

  const card = deck.cards[currentCardIndex];

  frontEl.textContent = card.front;
  backEl.textContent = card.back;
  progressEl.textContent = `${currentCardIndex + 1} / ${deck.cards.length}`;
}

/* -----------------------------------------------------------
   OVERLAY CONTROL
----------------------------------------------------------- */
function openOverlay() {
  overlayEl.classList.add("is-visible");
  overlayEl.setAttribute("aria-hidden", "false");
}

function closeOverlay() {
  overlayEl.classList.remove("is-visible");
  overlayEl.setAttribute("aria-hidden", "true");

  currentDeckId = null;
  currentCardIndex = 0;

  flashcardEl.classList.remove("is-flipped");
}

/* -----------------------------------------------------------
   OPEN DECK
----------------------------------------------------------- */
function openDeck(deckId) {
  const deck = findDeck(deckId);
  if (!deck) return;

  currentDeckId = deckId;
  currentCardIndex = 0;

  titleEl.textContent = deck.name;
  flashcardEl.classList.remove("is-flipped");
  updateFlashcardView();
  openOverlay();
}

/* -----------------------------------------------------------
   CARD ACTIONS
----------------------------------------------------------- */
function flipCard() {
  flashcardEl.classList.toggle("is-flipped");
}

function prevCard() {
  const deck = getCurrentDeck();
  if (!deck || !deck.cards.length) return;

  currentCardIndex =
    (currentCardIndex - 1 + deck.cards.length) % deck.cards.length;

  flashcardEl.classList.remove("is-flipped");
  updateFlashcardView();
}

function nextCard() {
  const deck = getCurrentDeck();
  if (!deck || !deck.cards.length) return;

  currentCardIndex = (currentCardIndex + 1) % deck.cards.length;

  flashcardEl.classList.remove("is-flipped");
  updateFlashcardView();
}

function addCard() {
  const deck = getCurrentDeck();
  if (!deck) return;

  const front = window.prompt("Front of card:");
  if (!front) return;

  const back = window.prompt("Back of card:");
  if (back === null) return;

  deck.cards.push({ front, back });
  saveDecks();

  currentCardIndex = deck.cards.length - 1;
  flashcardEl.classList.remove("is-flipped");
  updateFlashcardView();
  renderDeckList();
}

function editCard() {
  const deck = getCurrentDeck();
  if (!deck || !deck.cards.length) return;

  const card = deck.cards[currentCardIndex];

  const newFront = window.prompt("Edit front:", card.front);
  if (newFront === null) return;

  const newBack = window.prompt("Edit back:", card.back);
  if (newBack === null) return;

  card.front = newFront;
  card.back = newBack;

  saveDecks();
  flashcardEl.classList.remove("is-flipped");
  updateFlashcardView();
  renderDeckList();
}

function deleteCard() {
  const deck = getCurrentDeck();
  if (!deck || !deck.cards.length) return;

  const confirmDelete = window.confirm("Delete this card?");
  if (!confirmDelete) return;

  deck.cards.splice(currentCardIndex, 1);

  if (currentCardIndex >= deck.cards.length) {
    currentCardIndex = deck.cards.length - 1;
  }
  if (currentCardIndex < 0) currentCardIndex = 0;

  saveDecks();
  flashcardEl.classList.remove("is-flipped");
  updateFlashcardView();
  renderDeckList();
}

/* -----------------------------------------------------------
   DECK ACTIONS
----------------------------------------------------------- */
function renameDeck() {
  const deck = getCurrentDeck();
  if (!deck) return;

  const newName = window.prompt("Rename deck:", deck.name);
  if (!newName) return;

  deck.name = newName;
  saveDecks();

  titleEl.textContent = deck.name;
  renderDeckList();
}

function deleteDeck() {
  const deck = getCurrentDeck();
  if (!deck) return;

  const confirmDelete = window.confirm(
    `Delete deck "${deck.name}" and all its cards?`
  );
  if (!confirmDelete) return;

  decks = decks.filter((d) => d.id !== deck.id);
  saveDecks();

  renderDeckList();
  closeOverlay();
}

function addDeck() {
  const name = window.prompt("Deck name:");
  if (!name) return;

  const id = String(Date.now());
  decks.push({ id, name, cards: [] });

  saveDecks();
  renderDeckList();
}

/* -----------------------------------------------------------
   INIT
----------------------------------------------------------- */
export function initFlashcards() {
  deckListEl = document.getElementById("deck-list");
  overlayEl = document.getElementById("deck-viewer-overlay");
  titleEl = document.getElementById("deck-viewer-title");
  frontEl = document.getElementById("flashcard-front");
  backEl = document.getElementById("flashcard-back");
  progressEl = document.getElementById("flashcard-progress");
  flashcardEl = document.getElementById("flashcard");

  flipBtn = document.getElementById("flashcard-flip");
  prevBtn = document.getElementById("flashcard-prev");
  nextBtn = document.getElementById("flashcard-next");
  addCardBtn = document.getElementById("add-card-button");
  editCardBtn = document.getElementById("edit-card-button");
  deleteCardBtn = document.getElementById("delete-card-button");
  renameDeckBtn = document.getElementById("rename-deck-button");
  deleteDeckBtn = document.getElementById("delete-deck-button");
  closeBtn = document.getElementById("close-deck-viewer");
  addDeckBtn = document.getElementById("add-deck-button");

  loadDecks();
  renderDeckList();

  flipBtn.addEventListener("click", flipCard);
  prevBtn.addEventListener("click", prevCard);
  nextBtn.addEventListener("click", nextCard);
  addCardBtn.addEventListener("click", addCard);
  editCardBtn.addEventListener("click", editCard);
  deleteCardBtn.addEventListener("click", deleteCard);
  renameDeckBtn.addEventListener("click", renameDeck);
  deleteDeckBtn.addEventListener("click", deleteDeck);
  closeBtn.addEventListener("click", closeOverlay);
  addDeckBtn.addEventListener("click", addDeck);

  overlayEl.addEventListener("click", (evt) => {
    if (evt.target === overlayEl) closeOverlay();
  });
}
