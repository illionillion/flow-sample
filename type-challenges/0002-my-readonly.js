/* @flow */

import type { Equal, Expect } from './utils.js';

/**
 * Easy — MyReadonly
 * Make all properties readonly.
 */

type Todo = {
  title: string,
  description: string,
};

type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

type _cases = [
  Expect<Equal<MyReadonly<Todo>, { readonly title: string, readonly description: string }>>,
  Expect<Equal<MyReadonly<Todo>, Readonly<Todo>>>,
];
