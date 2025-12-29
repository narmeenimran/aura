const TODO_KEY = "aura_todo_list";

function loadTodos() {
  const saved = localStorage.getItem(TODO_KEY);
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveTodos(list) {
  localStorage.setItem(TODO_KEY, JSON.stringify(list));
}

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

    li.querySelector(".todo-checkbox").addEventListener("change", () => {
      removeTodo(index);
    });

    todoListEl.appendChild(li);
  });
}

function addTodo() {
  const text = prompt("what do you want to do today?");
  if (!text || !text.trim()) return;

  const list = loadTodos();
  list.push(text.trim());
  saveTodos(list);

  renderTodoList();
}

function removeTodo(index) {
  const list = loadTodos();
  list.splice(index, 1);
  saveTodos(list);

  renderTodoList();
}

let todoListEl;
let addButton;

export function initHome() {
  todoListEl = document.getElementById("todo-list");
  addButton = document.getElementById("todo-add-button");

  renderTodoList();

  addButton.addEventListener("click", addTodo);
}
