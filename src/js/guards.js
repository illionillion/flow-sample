/* @flow */

/**
 * Type guards (modern replacement for `%checks`).
 * If the function returns true, Flow narrows the argument.
 */
/* eslint-disable no-undef -- Flow `x is T` / `implies x is T` predicates */

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * One-sided guard (`implies`): only narrows the `true` branch.
 * Needed when the false case is not a clean complement of `string`
 * (empty string is still a string).
 */
export function isNonEmptyString(value: unknown): implies value is string {
  return typeof value === 'string' && value.trim() !== '';
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isPlainObject(value: unknown): value is { readonly [string]: unknown } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isNonMaybe<T>(value: ?T): implies value is T {
  return value != null;
}
