/* @flow */

import type { Equal, Expect } from './utils.js';

/**
 * Easy — MyExclude
 * Exclude from a union (distributive conditional types).
 * Flow's bottom type is `empty` (≈ TypeScript `never`).
 */

type MyExclude<T, U> = T extends U ? empty : T;

type _cases = [
  Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a'>, 'b' | 'c'>>,
  Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a' | 'b'>, 'c'>>,
  Expect<Equal<MyExclude<string | number | boolean, boolean>, string | number>>,
];
