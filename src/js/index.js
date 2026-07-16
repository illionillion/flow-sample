/* @flow */

import { isNonMaybe } from './guards.js';
import { confirm } from './confirm.js';
import { loadTodos, saveTodos } from './storage.js';
import { createTodo, findTodo, idleEditState, startEditing, updateTodo } from './types.js';
import type { EditState, Todo, TodoId } from './types.js';

const initial = loadTodos();
let todos: Array<Todo> = initial.ok ? initial.value : [];
let editState: EditState = idleEditState();

const appendTodoItem = (
  list: HTMLUListElement,
  template: HTMLTemplateElement,
  todo: Todo,
  onToggle: (id: TodoId, checked: boolean) => void,
  onDelete: (id: TodoId, name: string) => void | Promise<void>,
  onStartEdit: (id: TodoId) => void,
  onSaveEdit: (name: string) => void,
  onCancelEdit: () => void,
) => {
  const fragment = template.content.cloneNode(true);
  if (!(fragment instanceof DocumentFragment)) return;

  const item = fragment.querySelector('[data-todo-item]');
  const textEl = fragment.querySelector('[data-todo-text]');
  const editInput = fragment.querySelector('[data-todo-edit-input]');
  const checkEl = fragment.querySelector('[data-todo-check]');
  const editEl = fragment.querySelector('[data-todo-edit]');
  const saveEl = fragment.querySelector('[data-todo-save]');
  const cancelEl = fragment.querySelector('[data-todo-cancel]');
  const deleteEl = fragment.querySelector('[data-todo-delete]');

  if (!(item instanceof HTMLLIElement)) return;
  if (!(textEl instanceof HTMLSpanElement)) return;
  if (!(editInput instanceof HTMLInputElement)) return;
  if (!(checkEl instanceof HTMLInputElement)) return;
  if (!(editEl instanceof HTMLButtonElement)) return;
  if (!(saveEl instanceof HTMLButtonElement)) return;
  if (!(cancelEl instanceof HTMLButtonElement)) return;
  if (!(deleteEl instanceof HTMLButtonElement)) return;

  item.dataset.todoId = todo.id;
  textEl.textContent = todo.name;
  checkEl.checked = todo.checked;

  if (todo.checked) {
    textEl.classList.add('line-through', 'text-slate-400');
    item.classList.add('opacity-70');
  }

  if (editState.type === 'editing' && editState.id === todo.id) {
    editInput.value = editState.draft;
    textEl.classList.add('hidden');
    editEl.classList.add('hidden');
    deleteEl.classList.add('hidden');
    editInput.classList.remove('hidden');
    saveEl.classList.remove('hidden');
    cancelEl.classList.remove('hidden');
  } else {
    editInput.value = todo.name;
  }

  checkEl.addEventListener('change', () => {
    onToggle(todo.id, checkEl.checked);
  });

  editEl.addEventListener('click', () => {
    onStartEdit(todo.id);
  });

  const save = () => {
    onSaveEdit(editInput.value);
  };

  saveEl.addEventListener('click', save);
  cancelEl.addEventListener('click', onCancelEdit);

  editInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancelEdit();
    }
  });

  deleteEl.addEventListener('click', () => {
    void onDelete(todo.id, todo.name);
  });

  list.appendChild(fragment);

  if (editState.type === 'editing' && editState.id === todo.id) {
    editInput.focus();
    editInput.select();
  }
};

const renderList = (
  list: HTMLUListElement,
  count: HTMLElement,
  template: HTMLTemplateElement,
  onToggle: (id: TodoId, checked: boolean) => void,
  onDelete: (id: TodoId, name: string) => void | Promise<void>,
  onStartEdit: (id: TodoId) => void,
  onSaveEdit: (name: string) => void,
  onCancelEdit: () => void,
) => {
  const done = todos.filter((todo) => todo.checked).length;
  count.textContent = `${todos.length} 件（完了 ${done}）`;
  list.replaceChildren();
  todos.forEach((todo) =>
    appendTodoItem(list, template, todo, onToggle, onDelete, onStartEdit, onSaveEdit, onCancelEdit),
  );
};

const main = () => {
  const app = document.getElementById('app');
  const input = document.getElementById('input');
  const list = document.getElementById('list');
  const clear = document.getElementById('clear');
  const count = document.getElementById('count');
  const template = document.getElementById('todo-item-template');
  const confirmDialog = document.getElementById('confirm-dialog');
  const confirmMessage = document.getElementById('confirm-message');

  if (!(app instanceof HTMLFormElement)) return;
  if (!(input instanceof HTMLInputElement)) return;
  if (!(list instanceof HTMLUListElement)) return;
  if (!(clear instanceof HTMLButtonElement)) return;
  if (!(count instanceof HTMLParagraphElement)) return;
  if (!(template instanceof HTMLTemplateElement)) return;
  if (!(confirmDialog instanceof HTMLDialogElement)) return;
  if (!(confirmMessage instanceof HTMLParagraphElement)) return;

  const persist = () => {
    saveTodos(todos);
  };

  const refresh = () => {
    persist();
    renderList(
      list,
      count,
      template,
      handleToggle,
      handleDelete,
      handleStartEdit,
      handleSaveEdit,
      handleCancelEdit,
    );
  };

  const handleToggle = (id: TodoId, checked: boolean) => {
    todos = todos.map((todo) => (todo.id === id ? updateTodo(todo, { checked }) : todo));
    refresh();
  };

  const handleDelete = async (id: TodoId, name: string) => {
    const ok = await confirm(confirmDialog, confirmMessage, `「${name}」を削除しますか？`);
    if (!ok) return;

    if (editState.type === 'editing' && editState.id === id) {
      editState = idleEditState();
    }
    todos = todos.filter((todo) => todo.id !== id);
    refresh();
  };

  const handleStartEdit = (id: TodoId) => {
    const todo = findTodo(todos, id);
    if (!isNonMaybe(todo)) return;

    editState = startEditing(todo.id, todo.name);
    refresh();
  };

  const handleSaveEdit = (name: string) => {
    if (editState.type !== 'editing') return;

    const { id } = editState;
    const nextName = name.trim();
    if (!nextName) {
      editState = idleEditState();
      refresh();
      return;
    }

    todos = todos.map((todo) => (todo.id === id ? updateTodo(todo, { name: nextName }) : todo));
    editState = idleEditState();
    refresh();
  };

  const handleCancelEdit = () => {
    editState = idleEditState();
    refresh();
  };

  const handleAdd = (e: Event) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;

    const todo = createTodo(name);
    todos.push(todo);
    refresh();
    input.value = '';
    input.focus();
  };

  const handleClear = async () => {
    if (!todos.length) return;

    const ok = await confirm(confirmDialog, confirmMessage, 'すべての todo を削除しますか？');
    if (!ok) return;

    editState = idleEditState();
    todos = [];
    refresh();
    input.value = '';
    input.focus();
  };

  app.addEventListener('submit', handleAdd);
  clear.addEventListener('click', handleClear);
  refresh();
};

window.addEventListener('load', main);
