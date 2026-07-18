/* @flow */

/**
 * Type-level assert helpers (stripped at build time; only for `flow check`).
 * Inspired by type-challenges / type-testing.
 */

/** Fail `flow check` unless `T` is exactly `true`. */
export type Expect<T extends true> = T;

/**
 * Bidirectional assignability (good enough for Easy drills).
 * Tuple wrap avoids distributive conditional surprises.
 */
export type Equal<X, Y> = [X] extends [Y] ? ([Y] extends [X] ? true : false) : false;

export type NotEqual<X, Y> = Equal<X, Y> extends true ? false : true;
