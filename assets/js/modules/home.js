// home.js — updates home stats (focus minutes, decks, notes)

import { storage } from "../utils/storage.js";

const FOCUS_MIN_KEY = "aura_focus_minutes_today";
const DECKS_KEY = "aura_decks";
const NOTES_KEY = "aura_notes";

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function updateHomeStats() {
  const focusEl = document.getElementById("home-focus-minutes");
  const deckEl = document.getElementById("home-deck-count");
  const noteEl = document.getElementById("home-note-count");

  if (focusEl) {
    const focusMap = storage.get(FOCUS_MIN_KEY) || {};
    const todayKey = getTodayKey();
    const mins = focusMap[todayKey] || 0;
    focusEl.textContent = `${mins} min`;
  }

  if (deckEl) {
    const decks = storage.get(DECKS_KEY);
    const count = Array.isArray(decks) ? decks.length : 0;
    deckEl.textContent = String(count);
  }

  if (noteEl) {
    const notes = storage.get(NOTES_KEY);
    const count = Array.isArray(notes) ? notes.length : 0;
    noteEl.textContent = String(count);
  }
}

export function initHome() {
  updateHomeStats();
}
