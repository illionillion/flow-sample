/* @flow */

import { asUserId } from './opaque-id.js';
import type { UserId } from './opaque-id.js';
import type { Equal, Expect, NotEqual } from './utils.js';

/**
 * Flow-flavored — Opaque brand (checked from outside the defining module)
 *
 * `opaque type UserId: string = string` means:
 * - UserId is usable where string is expected (subtype)
 * - raw string is NOT assignable to UserId outside `opaque-id.js`
 */

declare function needsUserId(id: UserId): void;
declare function needsString(s: string): void;

const id: UserId = asUserId('u-1');

// OK: opaque subtype may flow to its supertype
needsString(id);

// OK: branded value accepted
needsUserId(id);

type _cases = [
  Expect<Equal<UserId, UserId>>,
  // Outside the opaque module, string ↛ UserId
  Expect<NotEqual<UserId, string>>,
];

// Uncomment to see Flow reject assigning a raw string:
// needsUserId('u-1');
