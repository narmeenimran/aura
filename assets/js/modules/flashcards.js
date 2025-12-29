import { storage } from "../utils/storage.js";

const STORAGE_KEY = "aura_flashcards";

let decks = [];
let currentDeckId = null;
let currentCardIndex = 0;

function loadDecks() {
  const saved = storage.get(STORAGE_KEY);
  if (Array.isArray(saved)) {
    decks = saved;
  } else {
    decks = [];
    saveDecks();
  }
}

function saveDecks() {
  storage.set(STORAGE_KEY, decks);
}

function vibrate(ms = 10) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

let deckGridEl;
let deckViewerEl;
let deckViewerTitleEl;

let flashcardEl;
let flashcardFrontEl;
let flashcardBackEl;
let flashcardProgressEl;

let flipBtn;
let nextBtn;
let prevBtn;
let addCardBtn;
let editCardBtn;
let deleteCardBtn;
let renameDeckBtn;
let deleteDeckBtn;
let closeViewerBtn;
let addDeckBtn;

function renderDeckGrid() {
  deckGridEl.innerHTML = "";

  if (decks.length === 0) {
    deckGridEl.innerHTML = `<p class="overlay-meta">No decks yet.</p>`;
    return;
  }

  decks.forEach((deck) => {
    const card = document.createElement("button");
    card.className = "deck-card";
    card.dataset.deckId = deck.id;

    card.innerHTML = `
      <strong>${deck.name}</strong>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-top:6px;">
        ${deck.cards.length} cards
      </p>
    `;

    card.addEventListener("click", () => openDeck(deck.id));
    deckGridEl.appendChild(card);
  });
}

function openDeck(id) {
  const deck = decks.find((d) => d.id === id);
  if (!deck) return;

  currentDeckId = id;
  currentCardIndex = 0;

  deckViewerTitleEl.textContent = deck.name;

  updateFlashcard();
  deckViewerEl.classList.add("is-visible");
  vibrate(10);
}

function closeDeckViewer() {
  deckViewerEl.classList.remove("is-visible");
  currentDeckId = null;
  currentCardIndex = 0;
  vibrate(10);
}

function updateFlashcard() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck || deck.cards.length === 0) {
    flashcardFrontEl.textContent = "No cards";
    flashcardBackEl.textContent = "";
    flashcardProgressEl.textContent = "";
    return;
  }

  const card = deck.cards[currentCardIndex];

  flashcardFrontEl.textContent = card.front;
  flashcardBackEl.textContent = card.back;

  flashcardProgressEl.textContent = `${currentCardIndex + 1} / ${deck.cards.length}`;
}

function flipCard() {
  flashcardEl.classList.toggle("is-flipped");
  vibrate(10);
}

function nextCard() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck) return;

  currentCardIndex = (currentCardIndex + 1) % deck.cards.length;
  flashcardEl.classList.remove("is-flipped");
  updateFlashcard();
  vibrate(10);
}

function prevCard() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck) return;

  currentCardIndex =
    (currentCardIndex - 1 + deck.cards.length) % deck.cards.length;

  flashcardEl.classList.remove("is-flipped");
  updateFlashcard();
  vibrate(10);
}

function addDeck() {
  const name = prompt("Deck name:");
  if (!name || !name.trim()) return;

  const newDeck = {
    id: String(Date.now()),
    name: name.trim(),
    cards: []
  };

  decks.push(newDeck);
  saveDecks();
  renderDeckGrid();
  vibrate(15);
}

function addCard() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck) return;

  const front = prompt("Front:");
  if (!front || !front.trim()) return;

  const back = prompt("Back:");
  if (!back || !back.trim()) return;

  deck.cards.push({ front: front.trim(), back: back.trim() });

  saveDecks();
  updateFlashcard();
  renderDeckGrid();
  vibrate(15);
}

function editCard() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck || deck.cards.length === 0) return;

  const card = deck.cards[currentCardIndex];

  const newFront = prompt("Edit front:", card.front);
  if (!newFront || !newFront.trim()) return;

  const newBack = prompt("Edit back:", card.back);
  if (!newBack || !newBack.trim()) return;

  card.front = newFront.trim();
  card.back = newBack.trim();

  saveDecks();
  updateFlashcard();
  renderDeckGrid();
  vibrate(15);
}

function deleteCard() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck || deck.cards.length === 0) return;

  const confirmDelete = confirm("Delete this card?");
  if (!confirmDelete) return;

  deck.cards.splice(currentCardIndex, 1);

  if (currentCardIndex >= deck.cards.length) {
    currentCardIndex = Math.max(0, deck.cards.length - 1);
  }

  saveDecks();
  updateFlashcard();
  renderDeckGrid();
  vibrate(20);
}

function renameDeck() {
  const deck = decks.find((d) => d.id === currentDeckId);
  if (!deck) return;

  const newName = prompt("New deck name:", deck.name);
  if (!newName || !newName.trim()) return;

  deck.name = newName.trim();
  saveDecks();

  deckViewerTitleEl.textContent = deck.name;
  renderDeckGrid();
  vibrate(15);
}

function deleteDeck() {
  const confirmDelete = confirm("Delete this deck?");
  if (!confirmDelete) return;

  decks = decks.filter((d) => d.id !== currentDeckId);

  saveDecks();
  renderDeckGrid();
  closeDeckViewer();
  vibrate(20);
}

export function initFlashcards() {
  deckGridEl = document.getElementById("deck-grid");
  deckViewerEl = document.getElementById("deck-viewer-panel");
  deckViewerTitleEl = document.getElementById("deck-viewer-title");

  flashcardEl = document.getElementById("flashcard");
  flashcardFrontEl = document.getElementById("flashcard-front");
  flashcardBackEl = document.getElementById("flashcard-back");
  flashcardProgressEl = document.getElementById("flashcard-progress");

  flipBtn = document.getElementById("flashcard-flip");
  nextBtn = document.getElementById("flashcard-next");
  prevBtn = document.getElementById("flashcard-prev");
  addCardBtn = document.getElementById("add-card-button");
  editCardBtn = document.getElementById("edit-card-button");
  deleteCardBtn = document.getElementById("delete-card-button");
  renameDeckBtn = document.getElementById("rename-deck-button");
  deleteDeckBtn = document.getElementById("delete-deck-button");
  closeViewerBtn = document.getElementById("close-deck-viewer");
  addDeckBtn = document.getElementById("add-deck-button");

  loadDecks();
  renderDeckGrid();

  flipBtn.addEventListener("click", flipCard);
  nextBtn.addEventListener("click", nextCard);
  prevBtn.addEventListener("click", prevCard);
  addCardBtn.addEventListener("click", addCard);
  editCardBtn.addEventListener("click", editCard);
  deleteCardBtn.addEventListener("click", deleteCard);
  renameDeckBtn.addEventListener("click", renameDeck);
  deleteDeckBtn.addEventListener("click", deleteDeck);
  closeViewerBtn.addEventListener("click", closeDeckViewer);
  addDeckBtn.addEventListener("click", addDeck);
}
