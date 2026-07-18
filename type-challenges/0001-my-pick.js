/* @flow */

import type { Equal, Expect } from './utils.js';

/**
 * Easy — MyPick
 * Implement `Pick<T, K>` yourself.
 *
 * @example
 *   type TodoPreview = MyPick<Todo, 'title' | 'completed'>
 */

type Todo = {
  title: string,
  description: string,
  completed: boolean,
};

type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

type _cases = [
  Expect<Equal<MyPick<Todo, 'title'>, { title: string }>>,
  Expect<Equal<MyPick<Todo, 'title' | 'completed'>, { title: string, completed: boolean }>>,
  Expect<Equal<MyPick<Todo, keyof Todo>, Todo>>,
];
