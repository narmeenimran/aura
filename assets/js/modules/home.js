// home.js — updates home stats + pastel deck previews

import { storage } from "../utils/storage.js";

const FOCUS_MIN_KEY = "aura_focus_minutes_today";
const DECKS_KEY = "aura_decks";
const NOTES_KEY = "aura_notes";

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// Update stats (focus minutes, deck count, note count)
export function updateHomeStats() {
  const focusEl = document.getElementById("home-focus-minutes");
  const deckEl = document.getElementById("home-deck-count");
  const noteEl = document.getElementById("home-note-count");

  // Focus minutes
  if (focusEl) {
    const focusMap = storage.get(FOCUS_MIN_KEY) || {};
    const todayKey = getTodayKey();
    const mins = focusMap[todayKey] || 0;
    focusEl.textContent = `${mins} min`;
  }

  // Deck count
  if (deckEl) {
    const decks = storage.get(DECKS_KEY);
    const count = Array.isArray(decks) ? decks.length : 0;
    deckEl.textContent = String(count);
  }

  // Note count
  if (noteEl) {
    const notes = storage.get(NOTES_KEY);
    const count = Array.isArray(notes) ? notes.length : 0;
    noteEl.textContent = String(count);
  }
}

// Render pastel deck previews on Home
function renderHomeDeckPreview() {
  const container = document.getElementById("home-deck-preview");
  if (!container) return;

  const decks = storage.get(DECKS_KEY);
  container.innerHTML = "";

  if (!Array.isArray(decks) || decks.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No decks yet. Create your first one.";
    empty.className = "overlay-meta";
    container.appendChild(empty);
    return;
  }

  // Show first 3 decks
  const previewDecks = decks.slice(0, 3);

  previewDecks.forEach((deck) => {
    const card = document.createElement("div");
    card.className = "home-deck-card";
    card.dataset.deckId = deck.id;

    const title = document.createElement("div");
    title.style.fontWeight = "600";
    title.style.marginBottom = "4px";
    title.textContent = deck.name;

    const count = document.createElement("div");
    count.style.fontSize = "0.85rem";
    count.style.color = "var(--aura-text-muted)";
    count.textContent = `${deck.cards.length} cards`;

    card.appendChild(title);
    card.appendChild(count);

    // Clicking opens the deck viewer
    card.addEventListener("click", () => {
      const openEvent = new CustomEvent("openDeckFromHome", {
        detail: { deckId: deck.id }
      });
      window.dispatchEvent(openEvent);
    });

    container.appendChild(card);
  });
}

// Listen for deck opening from Home
function attachDeckOpenListener() {
  window.addEventListener("openDeckFromHome", (evt) => {
    const deckId = evt.detail.deckId;
    const deckButton = document.querySelector(
      `.deck-card[data-deck-id="${deckId}"]`
    );

    // If deck exists in the Decks screen, simulate click
    if (deckButton) {
      deckButton.click();
    } else {
      // If not rendered yet, navigate to Decks screen first
      const decksNav = document.querySelector(
        '[data-screen-target="decks"]'
      );
      if (decksNav) {
        decksNav.click();
        setTimeout(() => {
          const btn = document.querySelector(
            `.deck-card[data-deck-id="${deckId}"]`
          );
          if (btn) btn.click();
        }, 150);
      }
    }
  });
}

// Init Home
export function initHome() {
  updateHomeStats();
  renderHomeDeckPreview();
  attachDeckOpenListener();
}
