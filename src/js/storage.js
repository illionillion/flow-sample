/* @flow */

import { err, ok } from './result.js';
import { parseTodos } from './types.js';
import type { Result } from './result.js';
import type { Todo } from './types.js';

const STORAGE_KEY = 'flow-sample:todos';

export const serializeTodos = (todos: ReadonlyArray<Todo>): string => JSON.stringify(todos);

export const deserializeTodos = (raw: string): Result<Array<Todo>, string> => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return err('invalid JSON');
  }
  return parseTodos(parsed);
};

export const loadTodos = (): Result<Array<Todo>, string> => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw == null || raw === '') {
    return ok([]);
  }
  return deserializeTodos(raw);
};

export const saveTodos = (todos: ReadonlyArray<Todo>): Result<void, string> => {
  try {
    localStorage.setItem(STORAGE_KEY, serializeTodos(todos));
    return ok(undefined);
  } catch {
    return err('failed to write localStorage');
  }
};
