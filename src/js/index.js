/* @flow */

let todos: string[] = [];

const appendTodoItem = (
    list: HTMLUListElement,
    template: HTMLTemplateElement,
    todo: string
) => {
    const fragment = template.content.cloneNode(true);
    if (!(fragment instanceof DocumentFragment)) return;

    const textEl = fragment.querySelector('[data-todo-text]');
    if (!(textEl instanceof HTMLSpanElement)) return;

    textEl.textContent = todo;
    list.appendChild(fragment);
};

const renderList = (
    list: HTMLUListElement,
    count: HTMLElement,
    template: HTMLTemplateElement
) => {
    count.textContent = `${todos.length} 件`;
    list.replaceChildren();
    todos.forEach((todo) => appendTodoItem(list, template, todo));
};

const scrollListToBottom = (listScroll: HTMLDivElement) => {
    listScroll.scrollTop = listScroll.scrollHeight;
};

window.addEventListener('load', () => {
    const app = document.getElementById('app');
    const input = document.getElementById('input');
    const list = document.getElementById('list');
    const listScroll = document.getElementById('list-scroll');
    const clear = document.getElementById('clear');
    const count = document.getElementById('count');
    const template = document.getElementById('todo-item-template');

    if (!(app instanceof HTMLFormElement)) return;
    if (!(input instanceof HTMLInputElement)) return;
    if (!(list instanceof HTMLUListElement)) return;
    if (!(listScroll instanceof HTMLDivElement)) return;
    if (!(clear instanceof HTMLButtonElement)) return;
    if (!(count instanceof HTMLParagraphElement)) return;
    if (!(template instanceof HTMLTemplateElement)) return;

    const handleAdd = (e: Event) => {
        e.preventDefault();
        const todo = input.value.trim();
        if (!todo) return;
        todos.push(todo);
        appendTodoItem(list, template, todo);
        count.textContent = `${todos.length} 件`;
        input.value = '';
        input.focus();
        scrollListToBottom(listScroll);
    };

    const handleClear = () => {
        todos.length = 0;
        renderList(list, count, template);
        scrollListToBottom(listScroll);
        input.value = '';
        input.focus();
    };

    app.addEventListener('submit', handleAdd);
    clear.addEventListener('click', handleClear);
    renderList(list, count, template);
});
