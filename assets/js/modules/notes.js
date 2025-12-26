// notes.js — notes CRUD, simple search, editor overlay

import { storage } from "../utils/storage.js";
import { updateHomeStats } from "./home.js";

const STORAGE_KEY = "aura_notes";

let notes = [];
let listEl;
let searchInput;
let addBtn;
let overlayEl;
let titleLabelEl;
let titleInputEl;
let contentEl;
let saveBtn;
let deleteBtn;
let closeBtn;

let editingNoteId = null;

function loadNotes() {
  const saved = storage.get(STORAGE_KEY);
  if (Array.isArray(saved)) {
    notes = saved;
  } else {
    notes = [];
  }
}

function saveNotes() {
  storage.set(STORAGE_KEY, notes);
  updateHomeStats();
}

function getPreviewText(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  const text = (tmp.textContent || "").trim();
  return text.length > 80 ? text.slice(0, 77) + "..." : text;
}

function renderNotes() {
  if (!listEl) return;
  const query = (searchInput?.value || "").toLowerCase().trim();
  listEl.innerHTML = "";

  if (!notes.length) {
    const empty = document.createElement("p");
    empty.textContent = "No notes yet. Capture your first thought.";
    empty.className = "overlay-meta";
    listEl.appendChild(empty);
    return;
  }

  notes
    .filter((note) => {
      if (!query) return true;
      const haystack = (note.title + " " + getPreviewText(note.content)).toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((note) => {
      const item = document.createElement("div");
      item.className = "note-list-item";
      item.dataset.noteId = note.id;

      const title = document.createElement("div");
      title.className = "note-list-title";
      title.textContent = note.title || "Untitled";

      const preview = document.createElement("div");
      preview.className = "note-list-preview";
      preview.textContent = getPreviewText(note.content);

      item.appendChild(title);
      item.appendChild(preview);

      item.addEventListener("click", () => openEditor(note.id));
      listEl.appendChild(item);
    });
}

function openOverlay() {
  if (!overlayEl) return;
  overlayEl.classList.add("is-visible");
  overlayEl.setAttribute("aria-hidden", "false");
}

function closeOverlay() {
  if (!overlayEl) return;
  overlayEl.classList.remove("is-visible");
  overlayEl.setAttribute("aria-hidden", "true");
  editingNoteId = null;
}

function newNote() {
  editingNoteId = null;
  if (titleLabelEl) titleLabelEl.textContent = "New note";
  if (titleInputEl) titleInputEl.value = "";
  if (contentEl) contentEl.innerHTML = "";
  if (deleteBtn) deleteBtn.style.display = "none";
  openOverlay();
}

function openEditor(noteId) {
  const note = notes.find((n) => n.id === noteId);
  editingNoteId = note ? note.id : null;

  if (titleLabelEl) {
    titleLabelEl.textContent = note ? "Edit note" : "New note";
  }
  if (titleInputEl) {
    titleInputEl.value = note?.title || "";
  }
  if (contentEl) {
    contentEl.innerHTML = note?.content || "";
  }
  if (deleteBtn) {
    deleteBtn.style.display = note ? "inline-block" : "none";
  }

  openOverlay();
}

function saveNote() {
  const title = titleInputEl?.value.trim() || "";
  const content = contentEl?.innerHTML || "";
  const now = Date.now();

  if (editingNoteId) {
    const note = notes.find((n) => n.id === editingNoteId);
    if (!note) return;
    note.title = title || "Untitled";
    note.content = content;
    note.updatedAt = now;
  } else {
    const id = String(now);
    notes.push({
      id,
      title: title || "Untitled",
      content,
      createdAt: now,
      updatedAt: now,
    });
  }

  saveNotes();
  renderNotes();
  closeOverlay();
}

function deleteNote() {
  if (!editingNoteId) return;
  const confirmDelete = window.confirm("Delete this note?");
  if (!confirmDelete) return;
  notes = notes.filter((n) => n.id !== editingNoteId);
  saveNotes();
  renderNotes();
  closeOverlay();
}

function applyFormatting(command) {
  document.execCommand(command, false, null);
}

export function initNotes() {
  listEl = document.getElementById("notes-list");
  searchInput = document.getElementById("note-search-input");
  addBtn = document.getElementById("add-note-button");
  overlayEl = document.getElementById("note-editor-overlay");
  titleLabelEl = document.getElementById("note-editor-title-label");
  titleInputEl = document.getElementById("note-editor-title-input");
  contentEl = document.getElementById("note-editor-content");
  saveBtn = document.getElementById("save-note-button");
  deleteBtn = document.getElementById("delete-note-button");
  closeBtn = document.getElementById("close-note-editor");

  loadNotes();
  renderNotes();

  if (addBtn) addBtn.addEventListener("click", newNote);

  if (searchInput) {
    searchInput.addEventListener("input", renderNotes);
  }

  if (saveBtn) saveBtn.addEventListener("click", saveNote);
  if (deleteBtn) deleteBtn.addEventListener("click", deleteNote);
  if (closeBtn) closeBtn.addEventListener("click", closeOverlay);

  if (overlayEl) {
    overlayEl.addEventListener("click", (evt) => {
      if (evt.target === overlayEl) {
        closeOverlay();
      }
    });
  }

  const toolbarButtons = Array.from(
    document.querySelectorAll(".note-editor-toolbar .toolbar-button")
  );
  toolbarButtons.forEach((btn) => {
    const cmd = btn.dataset.command;
    if (!cmd) return;
    btn.addEventListener("click", () => applyFormatting(cmd));
  });
}
