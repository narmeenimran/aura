import { storage } from "../utils/storage.js";

const STORAGE_KEY = "aura_todos";

let todos = [];

function vibrate(ms = 10) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function loadTodos() {
  const saved = storage.get(STORAGE_KEY);
  todos = Array.isArray(saved) ? saved : [];
}

function saveTodos() {
  storage.set(STORAGE_KEY, todos);
}

let todoListEl;
let addTodoBtn;

function renderTodos() {
  todoListEl.innerHTML = "";

  if (todos.length === 0) {
    todoListEl.innerHTML = `<p class="overlay-meta">No tasks yet.</p>`;
    return;
  }

  todos.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    li.innerHTML = `
      <input type="checkbox" ${item.done ? "checked" : ""} />
      <span style="flex:1; ${item.done ? "text-decoration: line-through; opacity:0.6;" : ""}">
        ${item.text}
      </span>
      <button class="ghost-button small delete-btn">✕</button>
    `;

    li.querySelector("input").addEventListener("change", () => {
      item.done = !item.done;
      saveTodos();
      renderTodos();
      vibrate(10);
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
      vibrate(15);
    });

    todoListEl.appendChild(li);
  });
}

function addTodo() {
  const text = prompt("New task:");
  if (!text || !text.trim()) return;

  todos.push({
    text: text.trim(),
    done: false
  });

  saveTodos();
  renderTodos();
  vibrate(15);
}

export function initHome() {
  todoListEl = document.getElementById("todo-list");
  addTodoBtn = document.getElementById("todo-add-button");

  loadTodos();
  renderTodos();

  addTodoBtn.addEventListener("click", addTodo);
}
