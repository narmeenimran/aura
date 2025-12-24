// flashcards.js — handles deck viewer + flipping cards

import { storage } from "../utils/storage.js";

export function initFlashcards() {
  // Elements
  const deckList = document.getElementById("deck-list");
  const overlay = document.getElementById("deck-viewer-overlay");
  const closeBtn = document.getElementById("close-deck-viewer");
  const flashcard = document.getElementById("flashcard");
  const front = document.getElementById("flashcard-front");
  const back = document.getElementById("flashcard-back");
  const flipBtn = document.getElementById("flashcard-flip");
  const prevBtn = document.getElementById("flashcard-prev");
  const nextBtn = document.getElementById("flashcard-next");
  const progress = document.getElementById("flashcard-progress");
  const deckTitle = document.getElementById("deck-viewer-title");
  const addCardBtn = document.getElementById("add-card-button");
  const editCardBtn = document.getElementById("edit-card-button");

  if (!deckList || !overlay) return;

  // Example deck data (replace with storage later)
  let decks = storage.get("aura_decks") || {
    1: {
      name: "Neuroscience basics",
      cards: [
        { front: "What is a neuron?", back: "A nerve cell that transmits signals." },
        { front: "What is myelin?", back: "A fatty sheath that speeds signal conduction." }
      ]
    },
    2: {
      name: "Cognitive biases",
      cards: [
        { front: "Anchoring bias", back: "Relying too heavily on the first piece of information." }
      ]
    },
    3: {
      name: "Language learning",
      cards: [
        { front: "What is immersion?", back: "Learning by surrounding yourself with the language." }
      ]
    }
  };

  let currentDeckId = null;
  let currentIndex = 0;

  function saveDecks() {
    storage.set("aura_decks", decks);
  }

  function openDeck(deckId) {
    currentDeckId = deckId;
    currentIndex = 0;

    const deck = decks[deckId];
    if (!deck) return;

    deckTitle.textContent = deck.name;
    updateFlashcard();
    overlay.classList.add("aura-overlay-active");
    overlay.removeAttribute("aria-hidden");
  }

  function closeDeck() {
    overlay.classList.remove("aura-overlay-active");
    overlay.setAttribute("aria-hidden", "true");
    flashcard.classList.remove("flipped");
  }

  function updateFlashcard() {
    const deck = decks[currentDeckId];
    if (!deck) return;

    const card = deck.cards[currentIndex];
    if (!card) return;

    front.textContent = card.front;
    back.textContent = card.back;

    progress.textContent = `Card ${currentIndex + 1} / ${deck.cards.length}`;
  }

  function flipCard() {
    flashcard.classList.toggle("flipped");
  }

  function nextCard() {
    const deck = decks[currentDeckId];
    if (!deck) return;

    currentIndex = (currentIndex + 1) % deck.cards.length;
    flashcard.classList.remove("flipped");
    updateFlashcard();
  }

  function prevCard() {
    const deck = decks[currentDeckId];
    if (!deck) return;

    currentIndex = (currentIndex - 1 + deck.cards.length) % deck.cards.length;
    flashcard.classList.remove("flipped");
    updateFlashcard();
  }

  function addCard() {
    const frontText = prompt("Front of card:");
    if (!frontText) return;

    const backText = prompt("Back of card:");
    if (!backText) return;

    decks[currentDeckId].cards.push({ front: frontText, back: backText });
    saveDecks();
    updateFlashcard();
  }

  function editCard() {
    const deck = decks[currentDeckId];
    const card = deck.cards[currentIndex];

    const newFront = prompt("Edit front:", card.front);
    if (newFront === null) return;

    const newBack = prompt("Edit back:", card.back);
    if (newBack === null) return;

    card.front = newFront;
    card.back = newBack;

    saveDecks();
    updateFlashcard();
  }

  // Event listeners
  deckList.addEventListener("click", (e) => {
    const card = e.target.closest(".deck-card");
    if (!card) return;

    const deckId = card.getAttribute("data-deck-id");
    if (deckId) openDeck(deckId);
  });

  closeBtn.addEventListener("click", closeDeck);
  flipBtn.addEventListener("click", flipCard);
  flashcard.addEventListener("click", flipCard);
  nextBtn.addEventListener("click", nextCard);
  prevBtn.addEventListener("click", prevCard);
  addCardBtn.addEventListener("click", addCard);
  editCardBtn.addEventListener("click", editCard);
}
