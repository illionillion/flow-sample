/* @flow */

/**
 * Generic success / failure wrapper.
 * `out` = covariant type params; pair with `readonly` fields so T/E only appear in output positions.
 */
export type Result<out T, out E = string> =
  | { readonly ok: true, readonly value: T }
  | { readonly ok: false, readonly error: E };

export const ok = <T, E = string>(value: T): Result<T, E> => ({ ok: true, value });

export const err = <T, E = string>(error: E): Result<T, E> => ({ ok: false, error });
