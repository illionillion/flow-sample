/* @flow */

/**
 * Generic success / failure wrapper.
 * After checking `ok`, Flow narrows `value` or `error`.
 */
export type Result<T, E = string> = {| ok: true, value: T |} | {| ok: false, error: E |};

export const ok = <T, E = string>(value: T): Result<T, E> => ({ ok: true, value });

export const err = <T, E = string>(error: E): Result<T, E> => ({ ok: false, error });
