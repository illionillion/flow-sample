/* @flow */

import { v4 as uuidv4 } from 'uuid';
import { isBoolean, isNonEmptyString, isPlainObject, isString } from './guards.js';
import { err, ok } from './result.js';
import type { Result } from './result.js';

/**
 * Branded UUID. Outside this file you cannot assign a raw string to TodoId.
 * Inside this file it is still a string, so uuidv4() can create it.
 */
export opaque type TodoId: string = string;

/**
 * `readonly` on fields = covariant / cannot assign to props from outside.
 */
export type Todo = {
  readonly id: TodoId,
  readonly name: string,
  readonly checked: boolean,
};

/** `keyof T` — union of property names (was `$Keys`). */
export type TodoKey = keyof Todo;

/**
 * `Omit` + `Partial` — patch without `id` (was roughly `$Diff`).
 */
export type TodoPatch = Partial<Omit<Todo, 'id'>>;

/**
 * Discriminated union for inline edit UI.
 * After checking `type`, Flow narrows which fields exist.
 */
export type EditState = { type: 'idle' } | { type: 'editing', id: TodoId, draft: string };

export const idleEditState = (): EditState => ({ type: 'idle' });

export const startEditing = (id: TodoId, draft: string): EditState => ({
  type: 'editing',
  id,
  draft,
});

export const createTodoId = (): TodoId => uuidv4();

export const createTodo = (name: string): Todo => ({
  id: createTodoId(),
  name,
  checked: false,
});

/**
 * Maybe type `?Todo` = `Todo | null | void`.
 * Not optional chaining (`?.`) — that is a runtime operator.
 */
export const findTodo = (todos: ReadonlyArray<Todo>, id: TodoId): ?Todo =>
  todos.find((todo) => todo.id === id);

export const updateTodo = (todo: Todo, patch: TodoPatch): Todo => ({
  ...todo,
  ...patch,
});

const parseTodoId = (value: unknown): Result<TodoId, string> => {
  if (!isNonEmptyString(value)) {
    return err('todo id must be a non-empty string');
  }
  // Opaque: only this file may treat a raw string as TodoId.
  const id: TodoId = value;
  return ok(id);
};

export const parseTodo = (value: unknown): Result<Todo, string> => {
  if (!isPlainObject(value)) {
    return err('todo must be an object');
  }

  const idResult = parseTodoId(value.id);
  if (!idResult.ok) return idResult;

  const name = value.name;
  if (!isString(name)) {
    return err('todo name must be a string');
  }

  const checked = value.checked;
  if (!isBoolean(checked)) {
    return err('todo checked must be a boolean');
  }

  return ok({
    id: idResult.value,
    name,
    checked,
  });
};

export const parseTodos = (value: unknown): Result<Array<Todo>, string> => {
  if (!Array.isArray(value)) {
    return err('todos must be an array');
  }

  const todos: Array<Todo> = [];
  for (let i = 0; i < value.length; i++) {
    const parsed = parseTodo(value[i]);
    if (!parsed.ok) {
      return err(`todos[${i}]: ${parsed.error}`);
    }
    todos.push(parsed.value);
  }
  return ok(todos);
};
