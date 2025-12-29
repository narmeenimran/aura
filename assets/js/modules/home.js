// home.js — minimal home screen + premade list + add/remove

const TODO_KEY = "aura_todo_list";

/* -----------------------------------------------------------
   PREMADE WELLNESS LIST
----------------------------------------------------------- */

const PREMADE_LIST = [
  "drink water",
  "stretch for 5 minutes",
  "take a walk",
  "journal one thought"
];

/* -----------------------------------------------------------
   LOAD + SAVE
----------------------------------------------------------- */

function loadTodos() {
  const saved = localStorage.getItem(TODO_KEY);

  // If no saved list → use premade list
  if (!saved) {
    saveTodos(PREMADE_LIST);
    return [...PREMADE_LIST];
  }

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed;
    return [...PREMADE_LIST];
  } catch {
    return [...PREMADE_LIST];
  }
}

function saveTodos(list) {
  localStorage.setItem(TODO_KEY, JSON.stringify(list));
}

/* -----------------------------------------------------------
   RENDER LIST
----------------------------------------------------------- */

function renderTodoList() {
  const list = loadTodos();
  todoListEl.innerHTML = "";

  list.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" data-index="${index}">
      <span class="todo-text">${item}</span>
    `;

    // When checked → remove item
    li.querySelector(".todo-checkbox").addEventListener("change", () => {
      removeTodo(index);
    });

    todoListEl.appendChild(li);
  });
}

/* -----------------------------------------------------------
   ADD ITEM
----------------------------------------------------------- */

function addTodo() {
  const text = prompt("what do you want to do?");
  if (!text || !text.trim()) return;

  const list = loadTodos();
  list.push(text.trim());
  saveTodos(list);

  renderTodoList();
}

/* -----------------------------------------------------------
   REMOVE ITEM
----------------------------------------------------------- */

function removeTodo(index) {
  const list = loadTodos();
  list.splice(index, 1);
  saveTodos(list);

  renderTodoList();
}

/* -----------------------------------------------------------
   INIT
----------------------------------------------------------- */

let todoListEl;
let addButton;

export function initHome() {
  todoListEl = document.getElementById("todo-list");
  addButton = document.getElementById("todo-add-button");

  renderTodoList();

  addButton.addEventListener("click", addTodo);
}
