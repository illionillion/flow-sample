/* @flow */

let todos: string[] = [];

window.addEventListener('load', () => {
    const app = document.getElementById('app');
    const input = document.getElementById('input');
    const list = document.getElementById('list');
    const clear = document.getElementById('clear');

    if (!(app instanceof HTMLFormElement)) return;
    if (!(input instanceof HTMLInputElement)) return;
    if (!(list instanceof HTMLUListElement)) return;

    const handleAdd = (e: Event) => {
        e.preventDefault();
        const todo = input.value;
        if (!todo) return;
        todos.push(todo);
        list.innerHTML += `<li>${todo}</li>`;
        input.value = '';
    };

    const handleClear = () => {
        todos.length = 0;
        list.innerHTML = '';
        input.value = '';
    };

    app.addEventListener('submit', handleAdd);
    clear.addEventListener('click', handleClear);
});
