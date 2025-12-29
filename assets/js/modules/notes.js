import { storage } from "../utils/storage.js";

const STORAGE_KEY = "aura_notes";

let notes = [];
let currentNoteId = null;

function loadNotes() {
  const saved = storage.get(STORAGE_KEY);
  notes = Array.isArray(saved) ? saved : [];
}

function saveNotes() {
  storage.set(STORAGE_KEY, notes);
}

function vibrate(ms = 10) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

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
let toolbarButtons;

function renderNotesList(filter = "") {
  notesListEl.innerHTML = "";

  const filtered = notes.filter((note) =>
    note.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    notesListEl.innerHTML = `<p class="overlay-meta">No notes yet.</p>`;
    return;
  }

  filtered.forEach((note) => {
    const card = document.createElement("button");
    card.className = "deck-card";
    card.dataset.noteId = note.id;

    card.innerHTML = `
      <strong>${note.title}</strong>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-top:6px;">
        ${new Date(note.updated).toLocaleDateString()}
      </p>
    `;

    card.addEventListener("click", () => openNote(note.id));
    notesListEl.appendChild(card);
  });
}

function openNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  currentNoteId = id;

  titleLabelEl.textContent = "Edit note";
  titleInputEl.value = note.title;
  contentEl.innerHTML = note.content;

  overlayEl.classList.add("is-visible");
  overlayEl.setAttribute("aria-hidden", "false");

  vibrate(10);
}

function closeNoteEditor() {
  overlayEl.classList.remove("is-visible");
  overlayEl.setAttribute("aria-hidden", "true");

  currentNoteId = null;
  titleInputEl.value = "";
  contentEl.innerHTML = "";
}

function addNote() {
  currentNoteId = null;

  titleLabelEl.textContent = "New note";
  titleInputEl.value = "";
  contentEl.innerHTML = "";

  overlayEl.classList.add("is-visible");
  overlayEl.setAttribute("aria-hidden", "false");

  vibrate(10);
}

function saveNote() {
  const title = titleInputEl.value.trim();
  const content = contentEl.innerHTML.trim();

  if (!title) return;

  const now = Date.now();

  if (currentNoteId) {
    const note = notes.find((n) => n.id === currentNoteId);
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
  vibrate(15);
}

function deleteNote() {
  if (!currentNoteId) return;

  if (!confirm("Delete this note?")) return;

  notes = notes.filter((n) => n.id !== currentNoteId);

  saveNotes();
  renderNotesList(searchInput.value);
  closeNoteEditor();
  vibrate(20);
}

function applyFormat(command, value = null) {
  document.execCommand(command, false, value);
  vibrate(5);
}

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

  toolbarButtons = document.querySelectorAll(".note-toolbar button");

  loadNotes();
  renderNotesList();

  searchInput.addEventListener("input", () => {
    renderNotesList(searchInput.value);
  });

  addNoteBtn.addEventListener("click", addNote);
  saveBtn.addEventListener("click", saveNote);
  deleteBtn.addEventListener("click", deleteNote);
  closeBtn.addEventListener("click", closeNoteEditor);

  overlayEl.addEventListener("click", (evt) => {
    if (evt.target === overlayEl) closeNoteEditor();
  });

    toolbarButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const format = btn.dataset.format;
      const color = btn.dataset.color || null;
      applyFormat(format, color);
    });
  });
}
