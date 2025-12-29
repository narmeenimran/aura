// flashcards.js — vertical flip + deck CRUD + viewer overlay

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
let flashcardEl;

// Default starter decks
function defaultDecks() {
  return [
    {
      id: "1",
      name: "Neuroscience basics",
      cards: [
        {
          front: "What is a neuron?",
          back: "A specialized cell that transmits nerve impulses."
        },
        {
          front: "What is synaptic plasticity?",
          back: "The ability of synapses to strengthen or weaken over time."
        }
      ]
    },
    {
      id: "2",
      name: "Cognitive biases",
      cards: [
        {
          front: "Confirmation bias",
          back: "Seeking information that confirms existing beliefs."
        },
        {
          front: "Anchoring",
          back: "Relying too heavily on the first piece of information seen."
        }
      ]
    },
    {
      id: "3",
      name: "Language learning",
      cards: [
        {
          front: "Best way to retain vocabulary?",
          back: "Spaced repetition and active recall."
        }
      ]
    }
  ];
}

// Load decks
function loadDecks() {
  const saved = storage.get(STORAGE_KEY);
  if (Array.isArray(saved) && saved.length) {
    decks = saved;
  } else {
    decks = defaultDecks();
    saveDecks();
  }
}

// Save decks
function saveDecks() {
  storage.set(STORAGE_KEY, decks);
  updateHomeStats();
}

// Render deck list (Flashcards screen)
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
    const btn = document.createElement("button");
    btn.className = "deck-card";
    btn.dataset.deckId = deck.id;
    btn.textContent = `${deck.name} (${deck.cards.length})`;
    btn.addEventListener("click", () => openDeck(deck.id));
    deckListEl.appendChild(btn);
  });
}

// Find deck
function findDeckById(id) {
  return decks.find((d) => d.id === id) || null;
}

// Current deck
function getCurrentDeck() {
  return currentDeckId ? findDeckById(currentDeckId) : null;
}

// Update flashcard view
function updateFlashcardView() {
  const deck = getCurrentDeck();
  if (!deck || !frontEl || !backEl || !progressEl) return;

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

// Open overlay
function openOverlay() {
  if (!overlayEl) return;
  overlayEl.classList.add("is-visible");
  overlayEl.setAttribute("aria-hidden", "false");
}

// Close overlay
function closeOverlay() {
  if (!overlayEl) return;
  overlayEl.classList.remove("is-visible");
  overlayEl.setAttribute("aria-hidden", "true");
  currentDeckId = null;
  currentCardIndex = 0;

  // Reset flip state
  if (flashcardEl) {
    flashcardEl.classList.remove("is-flipped");
  }
}

// Open deck
function openDeck(deckId) {
  const deck = findDeckById(deckId);
  if (!deck || !titleEl) return;

  currentDeckId = deckId;
  currentCardIndex = 0;

  titleEl.textContent = deck.name;
  updateFlashcardView();
  openOverlay();

  // Reset flip state
  if (flashcardEl) {
    flashcardEl.classList.remove("is-flipped");
  }
}

// Flip card (vertical flip)
function flipCard() {
  if (!flashcardEl) return;
  flashcardEl.classList.toggle("is-flipped");
}

// Prev card
function prevCard() {
  const deck = getCurrentDeck();
  if (!deck || !deck.cards.length) return;

  currentCardIndex =
    (currentCardIndex - 1 + deck.cards.length) % deck.cards.length;

  flashcardEl.classList.remove("is-flipped");
  updateFlashcardView();
}

// Next card
function nextCard() {
  const deck = getCurrentDeck();
  if (!deck || !deck.cards.length) return;

  currentCardIndex = (currentCardIndex + 1) % deck.cards.length;

  flashcardEl.classList.remove("is-flipped");
  updateFlashcardView();
}

// Add card
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

// Edit card
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

// Delete card
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

// Delete deck
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

// Rename deck
function renameDeck() {
  const deck = getCurrentDeck();
  if (!deck || !titleEl) return;

  const newName = window.prompt("Rename deck:", deck.name);
  if (!newName) return;

  deck.name = newName;
  saveDecks();

  titleEl.textContent = deck.name;
  renderDeckList();
}

// Add deck
function addDeck() {
  const name = window.prompt("Deck name:");
  if (!name) return;

  const id = String(Date.now());
  const deck = { id, name, cards: [] };

  decks.push(deck);
  saveDecks();

  renderDeckList();
}

// Init
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

  if (flipBtn) flipBtn.addEventListener("click", flipCard);
  if (prevBtn) prevBtn.addEventListener("click", prevCard);
  if (nextBtn) nextBtn.addEventListener("click", nextCard);
  if (addCardBtn) addCardBtn.addEventListener("click", addCard);
  if (editCardBtn) editCardBtn.addEventListener("click", editCard);
  if (deleteCardBtn) deleteCardBtn.addEventListener("click", deleteCard);
  if (renameDeckBtn) renameDeckBtn.addEventListener("click", renameDeck);
  if (deleteDeckBtn) deleteDeckBtn.addEventListener("click", deleteDeck);
  if (closeBtn) closeBtn.addEventListener("click", closeOverlay);
  if (addDeckBtn) addDeckBtn.addEventListener("click", addDeck);

  if (overlayEl) {
    overlayEl.addEventListener("click", (evt) => {
      if (evt.target === overlayEl) {
        closeOverlay();
      }
    });
  }
}
