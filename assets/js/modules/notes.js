// notes.js — advanced editor + toolbar + full-width search bar + auto-save

import { storage } from "../utils/storage.js";

const STORAGE_KEY = "aura_notes";

let notes = [];
let currentNoteId = null;

/* -----------------------------------------------------------
   LOAD + SAVE
----------------------------------------------------------- */

function loadNotes() {
  const saved = storage.get(STORAGE_KEY);
  if (Array.isArray(saved)) {
    notes = saved;
  } else {
    notes = [];
    saveNotes();
  }
}

function saveNotes() {
  storage.set(STORAGE_KEY, notes);
}

/* -----------------------------------------------------------
   ELEMENTS
----------------------------------------------------------- */

let notesListEl;
let searchInput;
let addNoteBtn;

let overlayEl;
let titleLabelEl;
let titleInputEl;
let contentEl;

let saveBtn;
let deleteBtn;
let closeBtn;

/* -----------------------------------------------------------
   RENDER NOTES LIST
----------------------------------------------------------- */

function renderNotesList(filter = "") {
  notesListEl.innerHTML = "";

  const filtered = notes.filter((note) =>
    note.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No notes yet.";
    empty.className = "overlay-meta";
    notesListEl.appendChild(empty);
    return;
  }

  filtered.forEach((note) => {
    const card = document.createElement("button");
    card.className = "deck-card";
    card.dataset.noteId = note.id;

    card.innerHTML = `
      <div style="font-weight:600; margin-bottom:4px;">${note.title}</div>
      <div style="font-size:0.85rem; color:var(--text-muted);">
        ${new Date(note.updated).toLocaleDateString()}
      </div>
    `;

    card.addEventListener("click", () => openNote(note.id));
    notesListEl.appendChild(card);
  });
}

/* -----------------------------------------------------------
   OPEN NOTE
----------------------------------------------------------- */

function openNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  currentNoteId = id;

  titleLabelEl.textContent = "Edit note";
  titleInputEl.value = note.title;
  contentEl.innerHTML = note.content;

  overlayEl.classList.add("is-visible");
  overlayEl.setAttribute("aria-hidden", "false");
}

/* -----------------------------------------------------------
   CLOSE NOTE
----------------------------------------------------------- */

function closeNoteEditor() {
  overlayEl.classList.remove("is-visible");
  overlayEl.setAttribute("aria-hidden", "true");

  currentNoteId = null;
  titleInputEl.value = "";
  contentEl.innerHTML = "";
}

/* -----------------------------------------------------------
   ADD NOTE
----------------------------------------------------------- */

function addNote() {
  currentNoteId = null;

  titleLabelEl.textContent = "New note";
  titleInputEl.value = "";
  contentEl.innerHTML = "";

  overlayEl.classList.add("is-visible");
  overlayEl.setAttribute("aria-hidden", "false");
}

/* -----------------------------------------------------------
   SAVE NOTE
----------------------------------------------------------- */

function saveNote() {
  const title = titleInputEl.value.trim();
  const content = contentEl.innerHTML.trim();

  if (!title) return;

  const now = Date.now();

  if (currentNoteId) {
    const note = notes.find((n) => n.id === currentNoteId);
    if (!note) return;

    note.title = title;
    note.content = content;
    note.updated = now;
  } else {
    notes.push({
      id: String(now),
      title,
      content,
      updated: now
    });
  }

  saveNotes();
  renderNotesList(searchInput.value);
  closeNoteEditor();
}

/* -----------------------------------------------------------
   DELETE NOTE
----------------------------------------------------------- */

function deleteNote() {
  if (!currentNoteId) return;

  const confirmDelete = window.confirm("Delete this note?");
  if (!confirmDelete) return;

  notes = notes.filter((n) => n.id !== currentNoteId);

  saveNotes();
  renderNotesList(searchInput.value);
  closeNoteEditor();
}

/* -----------------------------------------------------------
   TOOLBAR COMMANDS
----------------------------------------------------------- */

function applyCommand(cmd) {
  if (cmd === "checkbox") {
    document.execCommand("insertHTML", false, `<input type="checkbox"> `);
    return;
  }

  document.execCommand(cmd, false, null);
}

/* -----------------------------------------------------------
   INIT
----------------------------------------------------------- */

export function initNotes() {
  notesListEl = document.getElementById("notes-list");
  searchInput = document.getElementById("note-search-input");
  addNoteBtn = document.getElementById("add-note-button");

  overlayEl = document.getElementById("note-editor-overlay");
  titleLabelEl = document.getElementById("note-editor-title-label");
  titleInputEl = document.getElementById("note-editor-title-input");
  contentEl = document.getElementById("note-editor-content");

  saveBtn = document.getElementById("save-note-button");
  deleteBtn = document.getElementById("delete-note-button");
  closeBtn = document.getElementById("close-note-editor");

  loadNotes();
  renderNotesList();

  /* Search */
  searchInput.addEventListener("input", () => {
    renderNotesList(searchInput.value);
  });

  /* Add note */
  addNoteBtn.addEventListener("click", addNote);

  /* Save */
  saveBtn.addEventListener("click", saveNote);

  /* Delete */
  deleteBtn.addEventListener("click", deleteNote);

  /* Close */
  closeBtn.addEventListener("click", closeNoteEditor);

  /* Close overlay when clicking outside */
  overlayEl.addEventListener("click", (evt) => {
    if (evt.target === overlayEl) closeNoteEditor();
  });

  /* Toolbar buttons */
  document.querySelectorAll(".toolbar-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.dataset.command;
      applyCommand(cmd);
    });
  });
}
