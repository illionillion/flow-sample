/* @flow */

import { confirm } from './confirm.js';
import { createTodo } from './types.js';
import type { Todo, TodoId } from './types.js';

let todos: Array<Todo> = [];

const appendTodoItem = (
    list: HTMLUListElement,
    template: HTMLTemplateElement,
    todo: Todo,
    onToggle: (id: TodoId, checked: boolean) => void
) => {
    const fragment = template.content.cloneNode(true);
    if (!(fragment instanceof DocumentFragment)) return;

    const item = fragment.querySelector('[data-todo-item]');
    const textEl = fragment.querySelector('[data-todo-text]');
    const checkEl = fragment.querySelector('[data-todo-check]');

    if (!(item instanceof HTMLLIElement)) return;
    if (!(textEl instanceof HTMLSpanElement)) return;
    if (!(checkEl instanceof HTMLInputElement)) return;

    item.dataset.todoId = todo.id;
    textEl.textContent = todo.name;
    checkEl.checked = todo.checked;

    if (todo.checked) {
        textEl.classList.add('line-through', 'text-slate-400');
        item.classList.add('opacity-70');
    }

    checkEl.addEventListener('change', () => {
        onToggle(todo.id, checkEl.checked);
    });

    list.appendChild(fragment);
};

const renderList = (
    list: HTMLUListElement,
    count: HTMLElement,
    template: HTMLTemplateElement,
    onToggle: (id: TodoId, checked: boolean) => void
) => {
    const done = todos.filter((todo) => todo.checked).length;
    count.textContent = `${todos.length} 件（完了 ${done}）`;
    list.replaceChildren();
    todos.forEach((todo) => appendTodoItem(list, template, todo, onToggle));
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

    const handleToggle = (id: TodoId, checked: boolean) => {
        todos = todos.map((todo) =>
            todo.id === id ? { ...todo, checked } : todo
        );
        renderList(list, count, template, handleToggle);
    };

    const handleAdd = (e: Event) => {
        e.preventDefault();
        const name = input.value.trim();
        if (!name) return;

        const todo = createTodo(name);
        todos.push(todo);
        renderList(list, count, template, handleToggle);
        input.value = '';
        input.focus();
    };

    const handleClear = async () => {
        if (!todos.length) return;

        const ok = await confirm(
            confirmDialog,
            confirmMessage,
            'すべての todo を削除しますか？'
        );
        if (!ok) return;

        todos = [];
        renderList(list, count, template, handleToggle);
        input.value = '';
        input.focus();
    };

    app.addEventListener('submit', handleAdd);
    clear.addEventListener('click', handleClear);
    renderList(list, count, template, handleToggle);
});
