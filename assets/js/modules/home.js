// home.js — dashboard stats + clean quick actions

import { storage } from "../utils/storage.js";

const FOCUS_MIN_KEY = "aura_focus_minutes_today";
const DECKS_KEY = "aura_decks";
const NOTES_KEY = "aura_notes";

/* -----------------------------------------------------------
   TODAY KEY
----------------------------------------------------------- */
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/* -----------------------------------------------------------
   UPDATE HOME STATS
----------------------------------------------------------- */
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
    deckEl.textContent = Array.isArray(decks) ? decks.length : 0;
  }

  // Note count
  if (noteEl) {
    const notes = storage.get(NOTES_KEY);
    noteEl.textContent = Array.isArray(notes) ? notes.length : 0;
  }
}

/* -----------------------------------------------------------
   INIT HOME
----------------------------------------------------------- */
export function initHome() {
  updateHomeStats();
}
