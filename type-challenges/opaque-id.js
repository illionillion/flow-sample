/* @flow */

/**
 * Subtype opaque: usable as string, but raw string cannot be passed as UserId
 * from outside this module.
 */
export opaque type UserId: string = string;

export function asUserId(raw: string): UserId {
  return raw;
}
