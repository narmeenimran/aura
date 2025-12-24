// notes.js — rich text notes system

import { storage } from "../utils/storage.js";

export function initNotes() {
  const notesList = document.getElementById("notes-list");
  const searchInput = document.getElementById("note-search-input");

  const editorOverlay = document.getElementById("note-editor-overlay");
  const closeEditorBtn = document.getElementById("close-note-editor");
  const saveNoteBtn = document.getElementById("save-note-button");

  const editorTitleInput = document.getElementById("note-editor-title-input");
  const editorContent = document.getElementById("note-editor-content");
  const editorTitleLabel = document.getElementById("note-editor-title-label");

  const addNoteBtn = document.getElementById("add-note-button");

  if (!notesList || !editorOverlay) return;

  // Load notes
  let notes = storage.get("aura_notes") || {};

  let editingId = null;

  function saveNotes() {
    storage.set("aura_notes", notes);
  }

  function renderNotes(filter = "") {
    notesList.innerHTML = "";

    const entries = Object.entries(notes);

    const filtered = entries.filter(([id, note]) => {
      const text = (note.title + " " + note.content).toLowerCase();
      return text.includes(filter.toLowerCase());
    });

    if (filtered.length === 0) {
      notesList.innerHTML = `
        <p style="opacity:0.6; font-size:14px; padding:10px;">
          No notes found.
        </p>`;
      return;
    }

    filtered.forEach(([id, note]) => {
      const card = document.createElement("article");
      card.className = "aura-card aura-card-darkglass aura-glow note-card";
      card.setAttribute("data-note-id", id);

      card.innerHTML = `
        <div class="aura-card-body">
          <h3 class="aura-card-title">${note.title}</h3>
          <p class="aura-card-snippet">${note.snippet}</p>
        </div>
      `;

      card.addEventListener("click", () => openEditor(id));
      notesList.appendChild(card);
    });
  }

  function openEditor(id = null) {
    editingId = id;

    if (id) {
      const note = notes[id];
      editorTitleInput.value = note.title;
      editorContent.innerHTML = note.content;
      editorTitleLabel.textContent = "Edit note";
    } else {
      editorTitleInput.value = "";
      editorContent.innerHTML = "";
      editorTitleLabel.textContent = "New note";
    }

    editorOverlay.classList.add("aura-overlay-active");
    editorOverlay.removeAttribute("aria-hidden");
  }

  function closeEditor() {
    editorOverlay.classList.remove("aura-overlay-active");
    editorOverlay.setAttribute("aria-hidden", "true");
  }

  function saveNote() {
    const title = editorTitleInput.value.trim() || "Untitled";
    const content = editorContent.innerHTML.trim();
    const snippet = editorContent.textContent.trim().slice(0, 120) + "...";

    if (editingId) {
      notes[editingId] = { title, content, snippet };
    } else {
      const id = Date.now().toString();
      notes[id] = { title, content, snippet };
    }

    saveNotes();
    renderNotes();
    closeEditor();
  }

  // Toolbar formatting
  document.querySelectorAll(".note-editor-toolbar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-command");
      const value = btn.getAttribute("data-value") || null;
      document.execCommand(cmd, false, value);
      editorContent.focus();
    });
  });

  // Search
  searchInput.addEventListener("input", () => {
    renderNotes(searchInput.value);
  });

  // Buttons
  addNoteBtn.addEventListener("click", () => openEditor(null));
  closeEditorBtn.addEventListener("click", closeEditor);
  saveNoteBtn.addEventListener("click", saveNote);

  // Initial render
  renderNotes();
}
