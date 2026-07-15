/* @flow */

import { confirm } from './confirm.js';
import { createTodo } from './types.js';
import type { Todo, TodoId } from './types.js';

let todos: Array<Todo> = [];
let editingId: TodoId | null = null;

const appendTodoItem = (
  list: HTMLUListElement,
  template: HTMLTemplateElement,
  todo: Todo,
  onToggle: (id: TodoId, checked: boolean) => void,
  onDelete: (id: TodoId, name: string) => void | Promise<void>,
  onStartEdit: (id: TodoId) => void,
  onSaveEdit: (id: TodoId, name: string) => void,
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
  editInput.value = todo.name;
  checkEl.checked = todo.checked;

  if (todo.checked) {
    textEl.classList.add('line-through', 'text-slate-400');
    item.classList.add('opacity-70');
  }

  const isEditing = editingId === todo.id;
  if (isEditing) {
    textEl.classList.add('hidden');
    editEl.classList.add('hidden');
    deleteEl.classList.add('hidden');
    editInput.classList.remove('hidden');
    saveEl.classList.remove('hidden');
    cancelEl.classList.remove('hidden');
  }

  checkEl.addEventListener('change', () => {
    onToggle(todo.id, checkEl.checked);
  });

  editEl.addEventListener('click', () => {
    onStartEdit(todo.id);
  });

  const save = () => {
    onSaveEdit(todo.id, editInput.value);
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

  if (isEditing) {
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
  onSaveEdit: (id: TodoId, name: string) => void,
  onCancelEdit: () => void,
) => {
  const done = todos.filter((todo) => todo.checked).length;
  count.textContent = `${todos.length} 件（完了 ${done}）`;
  list.replaceChildren();
  todos.forEach((todo) =>
    appendTodoItem(list, template, todo, onToggle, onDelete, onStartEdit, onSaveEdit, onCancelEdit),
  );
};

window.addEventListener('load', () => {
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

  const refresh = () => {
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
    todos = todos.map((todo) => (todo.id === id ? { ...todo, checked } : todo));
    refresh();
  };

  const handleDelete = async (id: TodoId, name: string) => {
    const ok = await confirm(confirmDialog, confirmMessage, `「${name}」を削除しますか？`);
    if (!ok) return;

    if (editingId === id) {
      editingId = null;
    }
    todos = todos.filter((todo) => todo.id !== id);
    refresh();
  };

  const handleStartEdit = (id: TodoId) => {
    editingId = id;
    refresh();
  };

  const handleSaveEdit = (id: TodoId, name: string) => {
    const nextName = name.trim();
    if (!nextName) {
      editingId = null;
      refresh();
      return;
    }

    todos = todos.map((todo) => (todo.id === id ? { ...todo, name: nextName } : todo));
    editingId = null;
    refresh();
  };

  const handleCancelEdit = () => {
    editingId = null;
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

    editingId = null;
    todos = [];
    refresh();
    input.value = '';
    input.focus();
  };

  app.addEventListener('submit', handleAdd);
  clear.addEventListener('click', handleClear);
  refresh();
});
